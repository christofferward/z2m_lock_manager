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
from homeassistant.util import dt as dt_util

from .const import DOMAIN, WS_GET_LOCKS, WS_SET_CODE, WS_CLEAR_CODE
from .storage import Z2MLockManagerStore

_LOGGER = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _require_store(hass: HomeAssistant) -> Z2MLockManagerStore:
    store: Z2MLockManagerStore | None = hass.data.get(DOMAIN, {}).get("store")
    if store is None:
        raise websocket_api.ActiveConnectionError("Lock manager store is not loaded")
    return store


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


# ---------------------------------------------------------------------------
# WebSocket command handlers
# ---------------------------------------------------------------------------

@websocket_api.websocket_command({vol.Required("type"): WS_GET_LOCKS})
@callback
def ws_get_locks(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Return all configured locks and their slot data."""
    store = _require_store(hass)

    # Collect lock entity IDs from every config entry for this domain.
    configured: list[str] = []
    max_slots = 10
    for entry in hass.config_entries.async_entries(DOMAIN):
        locks = entry.options.get("locks", entry.data.get("locks", []))
        entry_max = int(entry.options.get("max_slots", entry.data.get("max_slots", 10)))
        if entry_max > max_slots:
            max_slots = entry_max
        for lock_id in locks:
            if lock_id not in configured:
                configured.append(lock_id)

    result = []
    for lock_id in configured:
        state = hass.states.get(lock_id)
        friendly_name = state.name if state else lock_id
        lock_data = store.get_lock_data(lock_id)
        result.append(
            {
                "entity_id": lock_id,
                "name": friendly_name,
                "slots": lock_data.get("slots", {}),
                "max_slots": max_slots, # Use the max_slots from config
            }
        )

    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_SET_CODE,
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
        vol.Optional("valid_from"): vol.Any(str, None),
        vol.Optional("valid_to"): vol.Any(str, None),
        vol.Optional("recurring_days"): vol.Any([int], None),
        vol.Optional("recurring_start_time"): vol.Any(str, None),
        vol.Optional("recurring_end_time"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_set_code(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Set (or update) a PIN code on a lock slot."""
    store = _require_store(hass)

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
    valid_from = msg.get("valid_from")
    valid_to = msg.get("valid_to")
    recurring_days = msg.get("recurring_days", [])
    recurring_start_time = msg.get("recurring_start_time")
    recurring_end_time = msg.get("recurring_end_time")

    # Get max_slots from config to ensure store is kept in sync
    max_slots = 10
    for entry in hass.config_entries.async_entries(DOMAIN):
        locks = entry.options.get("locks", entry.data.get("locks", []))
        if entity_id in locks:
            max_slots = int(entry.options.get("max_slots", entry.data.get("max_slots", 10)))
            break

    # If auto-rotate is on and no code was provided, generate one immediately.
    last_rotated: str | None = None
    if auto_rotate and enabled and not code:
        code = str(random.randint(100000, 999999))
        last_rotated = datetime.now(timezone.utc).isoformat()

    z2m_name = _get_z2m_friendly_name(hass, entity_id)
    if z2m_name is None:
        connection.send_error(
            msg["id"], "not_found", f"Could not resolve Z2M device name for {entity_id}"
        )
        return

    topic = f"zigbee2mqtt/{z2m_name}/set"
    
    active_now = True
    now_utc = dt_util.utcnow()
    now_local = dt_util.now()
    
    if valid_from and valid_from.strip():
        dt_val = dt_util.parse_datetime(valid_from)
        if dt_val and dt_val > now_utc:
            active_now = False

    if valid_to and valid_to.strip():
        dt_val = dt_util.parse_datetime(valid_to)
        if dt_val and dt_val < now_utc:
            active_now = False

    if active_now and recurring_days:
        if now_local.weekday() not in recurring_days:
            active_now = False
        else:
            current_time = now_local.strftime("%H:%M")
            if recurring_start_time and recurring_end_time and recurring_start_time > recurring_end_time:
                # Crosses midnight
                if not (current_time >= recurring_start_time or current_time <= recurring_end_time):
                    active_now = False
            else:
                if recurring_start_time and current_time < recurring_start_time:
                    active_now = False
                if recurring_end_time and current_time > recurring_end_time:
                    active_now = False

    pin_synced_to_lock = enabled and active_now

    if pin_synced_to_lock:
        payload = json.dumps(
            {"pin_code": {"user": slot, "user_type": user_type, "pin_code": code}}
        )
    else:
        payload = json.dumps({"pin_code": {"user": slot, "pin_code": None}})

    await hass.services.async_call("mqtt", "publish", {"topic": topic, "payload": payload})

    await store.async_update_slot(
        entity_id, slot, name, code, enabled, user_type,
        has_fingerprint, has_rfid, auto_rotate, rotate_interval_hours, last_rotated,
        valid_from=valid_from, valid_to=valid_to, 
        recurring_days=recurring_days, recurring_start_time=recurring_start_time, recurring_end_time=recurring_end_time,
        pin_synced_to_lock=pin_synced_to_lock, max_slots=max_slots,
    )

    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_CLEAR_CODE,
        vol.Required("entity_id"): str,
        vol.Required("slot"): int,
    }
)
@websocket_api.async_response
async def ws_clear_code(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
) -> None:
    """Clear a PIN code from a lock slot."""
    store = _require_store(hass)

    entity_id = msg["entity_id"]
    slot = msg["slot"]

    z2m_name = _get_z2m_friendly_name(hass, entity_id)
    if z2m_name is None:
        connection.send_error(
            msg["id"], "not_found", f"Could not resolve Z2M device name for {entity_id}"
        )
        return

    topic = f"zigbee2mqtt/{z2m_name}/set"
    payload = json.dumps({"pin_code": {"user": slot, "pin_code": None}})
    await hass.services.async_call("mqtt", "publish", {"topic": topic, "payload": payload})

    await store.async_clear_slot(entity_id, slot)

    connection.send_result(msg["id"], {"success": True})


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

def register_ws_handlers(hass: HomeAssistant) -> None:
    """Register all WebSocket command handlers."""
    websocket_api.async_register_command(hass, ws_get_locks)
    websocket_api.async_register_command(hass, ws_set_code)
    websocket_api.async_register_command(hass, ws_clear_code)
