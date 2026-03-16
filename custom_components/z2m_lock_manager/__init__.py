from __future__ import annotations

import json
import logging
import random
from datetime import datetime, timedelta, timezone

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers import device_registry as dr, entity_registry as er

from .const import DOMAIN, PLATFORMS
from .api import async_setup_api
from .store import Z2MLockManagerStore

_LOGGER = logging.getLogger(__name__)

def _get_z2m_friendly_name(hass: HomeAssistant, entity_id: str) -> str | None:
    """Resolve the Zigbee2MQTT friendly name for a given entity."""
    ent_reg = er.async_get(hass)
    entry = ent_reg.async_get(entity_id)
    if entry is None or entry.device_id is None:
        return None

    dev_reg = dr.async_get(hass)
    device = dev_reg.async_get(entry.device_id)
    if device is None or device.name is None:
        return None

    return device.name

async def _check_and_rotate_codes(hass: HomeAssistant, store: Z2MLockManagerStore) -> None:
    """Background task to rotate codes if their interval has passed."""
    now = datetime.now(timezone.utc)
    
    for lock_id, lock_data in store.data.get("locks", {}).items():
        slots = lock_data.get("slots", {})
        for slot_str, slot_data in slots.items():
            if not slot_data.get("enabled") or not slot_data.get("auto_rotate"):
                continue
                
            interval_hours = slot_data.get("rotate_interval_hours", 24)
            last_rotated_str = slot_data.get("last_rotated")
            
            should_rotate = False
            if not last_rotated_str:
                should_rotate = True
            else:
                try:
                    last_rotated = datetime.fromisoformat(last_rotated_str)
                    if now >= last_rotated + timedelta(hours=interval_hours):
                        should_rotate = True
                except ValueError:
                    should_rotate = True
                    
            if should_rotate:
                # Generate a random 6-digit PIN
                new_pin = str(random.randint(100000, 999999))
                slot_int = int(slot_str)
                name = slot_data.get("name", f"Slot {slot_str}")
                user_type = slot_data.get("user_type", "unrestricted")
                
                # Send to Z2M
                z2m_name = _get_z2m_friendly_name(hass, lock_id)
                if z2m_name:
                    topic = f"zigbee2mqtt/{z2m_name}/set"
                    payload = json.dumps({
                        "pin_code": {
                            "user": slot_int,
                            "user_type": user_type,
                            "pin_code": new_pin
                        }
                    })
                    await hass.services.async_call("mqtt", "publish", {"topic": topic, "payload": payload})
                    
                    # Save to store
                    await store.async_update_slot(
                        lock_id, slot_int, name, new_pin, True, user_type,
                        slot_data.get("has_fingerprint", False),
                        slot_data.get("has_rfid", False),
                        True, interval_hours, now.isoformat()
                    )
                    
                    # Dispatch Native HA Event
                    hass.bus.async_fire(f"{DOMAIN}_code_rotated", {
                        "entity_id": lock_id,
                        "slot": slot_int,
                        "name": name,
                        "code": new_pin
                    })
                    _LOGGER.info(f"Rotated guest code for {name} on {lock_id}")

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Zigbee2MQTT Lock Manager from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    
    store = Z2MLockManagerStore(hass)
    await store.async_load()
    
    # Store configuration options and store instance
    hass.data[DOMAIN][entry.entry_id] = {
        "data": entry.data,
        "store": store
    }
    
    # Setup websocket API
    async_setup_api(hass, store)
    
    # Setup background auto-rotation task
    async def _rotate_interval(now: datetime):
        await _check_and_rotate_codes(hass, store)
        
    entry.async_on_unload(
        async_track_time_interval(hass, _rotate_interval, timedelta(minutes=5))
    )
    
    # Register web view
    from homeassistant.components.http import StaticPathConfig
    
    await hass.http.async_register_static_paths([
        StaticPathConfig(
            "/z2m_lock_manager_panel",
            hass.config.path("custom_components/z2m_lock_manager/www"),
            cache_headers=False
        )
    ])
    
    # Register the side panel
    from homeassistant.components import frontend
    
    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title="Z2M Locks",
        sidebar_icon="mdi:lock-smart",
        frontend_url_path="z2m_lock_manager",
        config={
            "_panel_custom": {
                "name": "z2m-lock-manager-panel",
                "embed_iframe": False,
                "trust_external": False,
                "module_url": "/z2m_lock_manager_panel/z2m_lock_manager_panel.js",
            }
        },
        require_admin=True,
    )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        hass.data[DOMAIN].pop(entry.entry_id)

    return unload_ok
