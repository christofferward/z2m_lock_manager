"""WebSocket API for Z2M Lock Manager."""
from __future__ import annotations

import json
import logging
import random
from datetime import datetime, timezone

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr, entity_registry as er

from .const import DOMAIN
from .store import Z2MLockManagerStore

_LOGGER = logging.getLogger(__name__)


def _get_z2m_friendly_name(hass: HomeAssistant, entity_id: str) -> str | None:
    """Resolve the Zigbee2MQTT friendly name for a given entity.
    
    Looks up the entity in the entity registry, finds its parent device,
    and returns the device name (which Z2M sets to the friendly name).
    """
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get(entity_id)
    if entry is None or entry.device_id is None:
        return None

    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get(entry.device_id)
    if device is None or device.name is None:
        return None

    return device.name

def async_setup_api(hass: HomeAssistant, store: Z2MLockManagerStore) -> None:
    """Set up the WebSocket API."""
    
    @websocket_api.websocket_command(
        {
            vol.Required("type"): f"{DOMAIN}/get_locks",
        }
    )
    @callback
    def ws_get_locks(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        """Handle get locks command."""
        # Retrieve locks from config entries
        configured_locks = []
        max_slots = 10
        for entry in hass.config_entries.async_entries(DOMAIN):
            locks = entry.data.get("locks", [])
            entry_max = int(entry.data.get("max_slots", 10))
            if entry_max > max_slots:
                max_slots = entry_max
            for lock in locks:
                if lock not in configured_locks:
                    configured_locks.append(lock)
        
        # Merge with store data
        result = []
        for lock_id in configured_locks:
            state = hass.states.get(lock_id)
            friendly_name = state.name if state else lock_id
            store_data = store.get_lock_data(lock_id)
            
            result.append({
                "entity_id": lock_id,
                "name": friendly_name,
                "slots": store_data.get("slots", {}),
                "max_slots": max_slots
            })

        connection.send_result(msg["id"], result)

    @websocket_api.websocket_command(
        {
            vol.Required("type"): f"{DOMAIN}/set_code",
            vol.Required("entity_id"): str,
            vol.Required("slot"): int,
            vol.Required("name"): str,
            vol.Required("code"): str,
            vol.Required("enabled"): bool,
            vol.Optional("user_type", default="unrestricted"): vol.In(
                ["unrestricted", "year_day_schedule", "week_day_schedule", "master", "non_access"]
            ),
            vol.Optional("has_fingerprint", default=False): bool,
            vol.Optional("has_rfid", default=False): bool,
            vol.Optional("auto_rotate", default=False): bool,
            vol.Optional("rotate_interval_hours", default=24): int,
        }
    )
    @websocket_api.async_response
    async def ws_set_code(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        """Handle set code command."""
        entity_id = msg["entity_id"]
        slot = msg["slot"]
        name = msg["name"]
        code = msg["code"]
        enabled = msg["enabled"]
        user_type = msg.get("user_type", "unrestricted")
        has_fingerprint = msg.get("has_fingerprint", False)
        has_rfid = msg.get("has_rfid", False)
        auto_rotate = msg.get("auto_rotate", False)
        rotate_interval_hours = msg.get("rotate_interval_hours", 24)

        # If auto-rotate is enabled and no code was provided, generate one immediately
        last_rotated = None
        if auto_rotate and enabled and not code:
            code = str(random.randint(100000, 999999))
            last_rotated = datetime.now(timezone.utc).isoformat()

        # Resolve the Z2M friendly name from the device registry
        z2m_name = _get_z2m_friendly_name(hass, entity_id)
        if z2m_name is None:
            connection.send_error(msg["id"], "not_found", f"Could not resolve Z2M device name for {entity_id}")
            return
            
        topic = f"zigbee2mqtt/{z2m_name}/set"
        
        if enabled:
            payload = json.dumps({
                "pin_code": {
                    "user": slot,
                    "user_type": user_type,
                    "pin_code": code
                }
            })
        else:
            # If disabled, we still save the metadata to the store, but we clear the physical lock
            payload = json.dumps({
                "pin_code": {
                    "user": slot,
                    "pin_code": None
                }
            })
            
        await hass.services.async_call("mqtt", "publish", {"topic": topic, "payload": payload})
        
        # Save to store
        await store.async_update_slot(
            entity_id, slot, name, code, enabled, user_type, 
            has_fingerprint, has_rfid, auto_rotate, rotate_interval_hours,
            last_rotated
        )
        
        connection.send_result(msg["id"], {"success": True})

    @websocket_api.websocket_command(
        {
            vol.Required("type"): f"{DOMAIN}/clear_code",
            vol.Required("entity_id"): str,
            vol.Required("slot"): int,
        }
    )
    @websocket_api.async_response
    async def ws_clear_code(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        """Handle clear code command."""
        entity_id = msg["entity_id"]
        slot = msg["slot"]
        
        # Resolve the Z2M friendly name from the device registry
        z2m_name = _get_z2m_friendly_name(hass, entity_id)
        if z2m_name is None:
            connection.send_error(msg["id"], "not_found", f"Could not resolve Z2M device name for {entity_id}")
            return
        topic = f"zigbee2mqtt/{z2m_name}/set"
        payload = json.dumps({
            "pin_code": {
                "user": slot,
                "pin_code": None
            }
        })
        await hass.services.async_call("mqtt", "publish", {"topic": topic, "payload": payload})

        # Remove from store
        await store.async_clear_slot(entity_id, slot)

        connection.send_result(msg["id"], {"success": True})

    websocket_api.async_register_command(hass, ws_get_locks)
    websocket_api.async_register_command(hass, ws_set_code)
    websocket_api.async_register_command(hass, ws_clear_code)
