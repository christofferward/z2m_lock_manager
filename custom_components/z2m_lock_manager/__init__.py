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


async def _check_schedules(hass: HomeAssistant, store: Z2MLockManagerStore) -> None:
    """Check slots for auto-rotation and date-based schedule enforcement."""
    from homeassistant.util import dt as dt_util
    now_utc = dt_util.utcnow()
    now_local = dt_util.now()

    for entity_id, lock in store.locks.items():
        for slot_int, slot in lock.slots.items():
            if not slot.enabled:
                continue

            z2m_name = _get_z2m_friendly_name(hass, entity_id)
            if not z2m_name:
                continue

            # --- DATE SCHEDULE ENFORCEMENT ---
            active_now = True
            expired = False
            
            if slot.valid_from and slot.valid_from.strip():
                try:
                    vf = dt_util.parse_datetime(slot.valid_from)
                    if vf and vf > now_utc:
                        active_now = False
                except Exception:
                    pass

            if slot.valid_to and slot.valid_to.strip():
                try:
                    vt = dt_util.parse_datetime(slot.valid_to)
                    if vt and vt < now_utc:
                        active_now = False
                        expired = True
                except Exception:
                    pass
                    
            if active_now and slot.recurring_days:
                if now_local.weekday() not in slot.recurring_days:
                    active_now = False
                else:
                    current_time = now_local.strftime("%H:%M")
                    if slot.recurring_start_time and slot.recurring_end_time and slot.recurring_start_time > slot.recurring_end_time:
                        if not (current_time >= slot.recurring_start_time or current_time <= slot.recurring_end_time):
                            active_now = False
                    else:
                        if slot.recurring_start_time and current_time < slot.recurring_start_time:
                            active_now = False
                        if slot.recurring_end_time and current_time > slot.recurring_end_time:
                            active_now = False
            
            # If crossed into active window
            if active_now and not slot.pin_synced_to_lock:
                topic = f"zigbee2mqtt/{z2m_name}/set"
                payload = json.dumps({"pin_code": {"user": slot_int, "user_type": slot.user_type, "pin_code": slot.code}})
                await hass.services.async_call("mqtt", "publish", {"topic": topic, "payload": payload})
                
                await store.async_update_slot(
                    entity_id, slot_int, slot.name, slot.code, slot.enabled, slot.user_type,
                    slot.has_fingerprint, slot.has_rfid, slot.auto_rotate, slot.rotate_interval_hours,
                    slot.last_rotated, slot.valid_from, slot.valid_to,
                    recurring_days=slot.recurring_days, recurring_start_time=slot.recurring_start_time, recurring_end_time=slot.recurring_end_time, 
                    pin_synced_to_lock=True,
                    max_slots=lock.max_slots,
                )
                _LOGGER.info("Date-based code enabled for %s on %s", slot.name, entity_id)

            # If crossed into expired window
            elif not active_now and slot.pin_synced_to_lock:
                topic = f"zigbee2mqtt/{z2m_name}/set"
                payload = json.dumps({"pin_code": {"user": slot_int, "pin_code": None}})
                await hass.services.async_call("mqtt", "publish", {"topic": topic, "payload": payload})
                
                enabled_state = slot.enabled
                if expired:
                    enabled_state = False
                    hass.bus.async_fire(
                        f"{DOMAIN}_code_expired",
                        {"entity_id": entity_id, "slot": slot_int, "name": slot.name}
                    )
                    _LOGGER.info("Date-based code expired for %s on %s", slot.name, entity_id)
                else:
                    _LOGGER.info("Date-based code suspended for %s on %s", slot.name, entity_id)

                await store.async_update_slot(
                    entity_id, slot_int, slot.name, slot.code, enabled_state, slot.user_type,
                    slot.has_fingerprint, slot.has_rfid, slot.auto_rotate, slot.rotate_interval_hours,
                    slot.last_rotated, slot.valid_from, slot.valid_to,
                    recurring_days=slot.recurring_days, recurring_start_time=slot.recurring_start_time, recurring_end_time=slot.recurring_end_time, 
                    pin_synced_to_lock=False,
                    max_slots=lock.max_slots,
                )

            # --- AUTO-ROTATE ENFORCEMENT ---
            if slot.auto_rotate and active_now:
                should_rotate = False
                if not slot.last_rotated:
                    should_rotate = True
                else:
                    try:
                        last_rotated = dt_util.parse_datetime(slot.last_rotated)
                        if last_rotated:
                            # if offset-naive, assume UTC (though fromisoformat handles tz if present)
                            if last_rotated.tzinfo is None:
                                last_rotated = last_rotated.replace(tzinfo=timezone.utc)
                            if now_utc >= last_rotated + timedelta(hours=slot.rotate_interval_hours):
                                should_rotate = True
                    except Exception:
                        should_rotate = True

                if should_rotate:
                    new_pin = str(random.randint(100000, 999999))
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
                        now_utc.isoformat(),
                        slot.valid_from,
                        slot.valid_to,
                        recurring_days=slot.recurring_days, 
                        recurring_start_time=slot.recurring_start_time, 
                        recurring_end_time=slot.recurring_end_time,
                        pin_synced_to_lock=True,
                        max_slots=lock.max_slots,
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
    # Sync max_slots from config entry to store
    locks = entry.options.get("locks", entry.data.get("locks", []))
    max_slots = int(entry.options.get("max_slots", entry.data.get("max_slots", 10)))
    for lock_id in locks:
        store.ensure_lock(lock_id, max_slots=max_slots)

    # Make the store accessible to WebSocket handlers via the top-level domain key
    hass.data[DOMAIN]["store"] = store

    # Register WebSocket API
    register_ws_handlers(hass)

    # Register sidebar panel + static assets
    await async_register_panel(hass)

    # Schedule periodic schedule checks (every 1 minute)
    async def _rotate_interval(now: datetime) -> None:
        await _check_schedules(hass, store)

    entry.async_on_unload(
        async_track_time_interval(hass, _rotate_interval, timedelta(minutes=1))
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
