"""Zigbee2MQTT Lock Manager integration."""
from __future__ import annotations

import json
import logging
import random
from datetime import datetime, timedelta, timezone

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval

from .const import DOMAIN, PLATFORMS
from .panel import async_register_panel, async_unregister_panel
from .storage import Z2MLockManagerStore
from .websocket import register_ws_handlers

_LOGGER = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Auto-rotation helper
# ---------------------------------------------------------------------------

def _get_z2m_friendly_name(hass: HomeAssistant, entity_id: str) -> str | None:
    """Resolve the Zigbee2MQTT friendly name for a given lock entity."""
    from homeassistant.helpers import device_registry as dr, entity_registry as er

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
    """Rotate guest codes whose interval has expired."""
    now = datetime.now(timezone.utc)

    for entity_id, lock in store.locks.items():
        for slot_int, slot in lock.slots.items():
            if not slot.enabled or not slot.auto_rotate:
                continue

            should_rotate = False
            if not slot.last_rotated:
                should_rotate = True
            else:
                try:
                    last_rotated = datetime.fromisoformat(slot.last_rotated)
                    if now >= last_rotated + timedelta(hours=slot.rotate_interval_hours):
                        should_rotate = True
                except ValueError:
                    should_rotate = True

            if not should_rotate:
                continue

            new_pin = str(random.randint(100000, 999999))
            z2m_name = _get_z2m_friendly_name(hass, entity_id)
            if not z2m_name:
                continue

            topic = f"zigbee2mqtt/{z2m_name}/set"
            payload = json.dumps(
                {
                    "pin_code": {
                        "user": slot_int,
                        "user_type": slot.user_type,
                        "pin_code": new_pin,
                    }
                }
            )
            await hass.services.async_call("mqtt", "publish", {"topic": topic, "payload": payload})

            await store.async_update_slot(
                entity_id,
                slot_int,
                slot.name,
                new_pin,
                True,
                slot.user_type,
                slot.has_fingerprint,
                slot.has_rfid,
                True,
                slot.rotate_interval_hours,
                now.isoformat(),
            )

            hass.bus.async_fire(
                f"{DOMAIN}_code_rotated",
                {"entity_id": entity_id, "slot": slot_int, "name": slot.name, "code": new_pin},
            )
            _LOGGER.info("Rotated guest code for %s on %s", slot.name, entity_id)


# ---------------------------------------------------------------------------
# Integration lifecycle
# ---------------------------------------------------------------------------

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Zigbee2MQTT Lock Manager from a config entry."""
    hass.data.setdefault(DOMAIN, {})

    # Load persistent state
    store = Z2MLockManagerStore(hass)
    await store.async_load()
    hass.data[DOMAIN][entry.entry_id] = {"data": entry.data, "store": store}

    # Make the store accessible to WebSocket handlers via the top-level domain key
    hass.data[DOMAIN]["store"] = store

    # Register WebSocket API
    register_ws_handlers(hass)

    # Register sidebar panel + static assets
    await async_register_panel(hass)

    # Schedule periodic auto-rotation checks (every 5 minutes)
    async def _rotate_interval(now: datetime) -> None:
        await _check_and_rotate_codes(hass, store)

    entry.async_on_unload(
        async_track_time_interval(hass, _rotate_interval, timedelta(minutes=5))
    )

    entry.async_on_unload(entry.add_update_listener(update_listener))

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def update_listener(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload the integration when options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        hass.data[DOMAIN].pop(entry.entry_id, None)

        # Remove the panel only when the last entry is removed
        if not any(k for k in hass.data[DOMAIN] if k not in ("store", "static_paths_registered", "panel_registered")):
            async_unregister_panel(hass)

    return unload_ok
