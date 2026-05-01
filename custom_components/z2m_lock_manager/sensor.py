"""Sensor platform for Z2M Lock Manager — exposes slot names and lock log as HA entities."""
from __future__ import annotations

import logging

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event

from .const import DOMAIN
from .storage import Z2MLockManagerStore

_LOGGER = logging.getLogger(__name__)

SOURCES_SV = {
    "keypad": "kod",
    "rfid": "tagg",
    "manual": "manuellt",
    "rf": "fjärrkontroll",
    "fingerprint": "fingeravtryck",
}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up slot name sensors and log sensors from a config entry."""
    store: Z2MLockManagerStore = hass.data[DOMAIN]["store"]

    locks = entry.options.get("locks", entry.data.get("locks", []))
    max_slots = int(entry.options.get("max_slots", entry.data.get("max_slots", 10)))

    sensors: list[SlotNameSensor] = []
    log_sensors: list[LockLogSensor] = []

    for lock_id in locks:
        for slot_num in range(1, max_slots + 1):
            sensors.append(SlotNameSensor(hass, store, lock_id, slot_num))
        log_sensors.append(LockLogSensor(hass, store, lock_id))

    all_entities = sensors + log_sensors
    async_add_entities(all_entities)

    # Callback för slot-uppdateringar
    @callback
    def _on_slot_updated(lock_id: str, slot_num: int) -> None:
        for sensor in sensors:
            if sensor.lock_entity_id == lock_id and sensor.slot_num == slot_num:
                sensor.async_schedule_update_ha_state()

    hass.data[DOMAIN]["slot_updated_callback"] = _on_slot_updated

    # Lyssna på action_user-sensorer för varje lås
    for lock_id in locks:
        lock_part = lock_id.split(".")[-1]
        action_user_entity = f"sensor.{lock_part}_action_user"

        @callback
        def _on_action_user_changed(
            event,
            _lock_id=lock_id,
            _lock_part=lock_part,
            _log_sensors=log_sensors,
        ) -> None:
            new_state = event.data.get("new_state")
            if new_state is None or new_state.state in ("unknown", "unavailable", ""):
                return

            try:
                slot_num = int(float(new_state.state))
            except (ValueError, TypeError):
                return

            # Hämta source vid samma tidpunkt
            source_state = hass.states.get(f"sensor.{_lock_part}_action_source_name")
            source = source_state.state if source_state else "unknown"
            source_sv = SOURCES_SV.get(source, source)

            # action_user triggar bara vid faktisk användning → alltid unlocked
            action = "unlocked"

            # Slå upp namn från store
            lock = store.get_lock(_lock_id)
            name = "Okänd"
            if lock:
                slot = lock.slots.get(slot_num)
                if slot and slot.name:
                    name = slot.name

            async def _save_and_update(
                __lock_id=_lock_id,
                __action=action,
                __slot_num=slot_num,
                __name=name,
                __source_sv=source_sv,
                __log_sensors=_log_sensors,
            ):
                await store.async_add_log_entry(
                    __lock_id, __action, __slot_num, __name, __source_sv
                )
                for ls in __log_sensors:
                    if ls.lock_entity_id == __lock_id:
                        ls.async_schedule_update_ha_state()

            hass.async_create_task(_save_and_update())

        async_track_state_change_event(hass, action_user_entity, _on_action_user_changed)


class SlotNameSensor(SensorEntity):
    """Sensor som visar personnamnet för ett specifikt kodslot."""

    _attr_has_entity_name = True
    _attr_icon = "mdi:account-key"

    def __init__(
        self,
        hass: HomeAssistant,
        store: Z2MLockManagerStore,
        lock_entity_id: str,
        slot_num: int,
    ) -> None:
        self.hass = hass
        self._store = store
        self.lock_entity_id = lock_entity_id
        self.slot_num = slot_num

        safe_lock = lock_entity_id.replace(".", "_").replace(" ", "_")
        self._attr_unique_id = f"{DOMAIN}_{safe_lock}_slot_{slot_num}_name"

        lock_part = lock_entity_id.split(".")[-1]
        self.entity_id = f"sensor.{lock_part}_slot_{slot_num}_name"
        self._attr_name = f"Slot {slot_num} namn"

    @property
    def native_value(self) -> str:
        lock = self._store.get_lock(self.lock_entity_id)
        if lock is None:
            return ""
        slot = lock.slots.get(self.slot_num)
        return slot.name if slot and slot.name else ""

    @property
    def extra_state_attributes(self) -> dict:
        lock = self._store.get_lock(self.lock_entity_id)
        if lock is None:
            return {}
        slot = lock.slots.get(self.slot_num)
        if slot is None:
            return {"enabled": False}
        return {
            "enabled": slot.enabled,
            "has_fingerprint": slot.has_fingerprint,
            "has_rfid": slot.has_rfid,
            "user_type": slot.user_type,
            "pin_synced_to_lock": slot.pin_synced_to_lock,
        }

    @property
    def device_info(self):
        from homeassistant.helpers import entity_registry as er, device_registry as dr
        ent_reg = er.async_get(self.hass)
        entry = ent_reg.async_get(self.lock_entity_id)
        if entry and entry.device_id:
            dev_reg = dr.async_get(self.hass)
            device = dev_reg.async_get(entry.device_id)
            if device:
                return {"identifiers": device.identifiers}
        return None


class LockLogSensor(SensorEntity):
    """Sensor som visar logg över dörröppningar för ett lås."""

    _attr_has_entity_name = True
    _attr_icon = "mdi:history"

    def __init__(
        self,
        hass: HomeAssistant,
        store: Z2MLockManagerStore,
        lock_entity_id: str,
    ) -> None:
        self.hass = hass
        self._store = store
        self.lock_entity_id = lock_entity_id

        safe_lock = lock_entity_id.replace(".", "_").replace(" ", "_")
        self._attr_unique_id = f"{DOMAIN}_{safe_lock}_log"

        lock_part = lock_entity_id.split(".")[-1]
        self.entity_id = f"sensor.{lock_part}_log"
        self._attr_name = "Logg"

    @property
    def native_value(self) -> str:
        """Senaste händelsen som state."""
        lock = self._store.get_lock(self.lock_entity_id)
        if not lock or not lock.log:
            return "Ingen aktivitet"
        entry = lock.log[0]
        return f"{entry['name']} – {entry['action']} ({entry['source']})"

    @property
    def extra_state_attributes(self) -> dict:
        """Hela loggen som attribut."""
        lock = self._store.get_lock(self.lock_entity_id)
        if not lock:
            return {"log": []}
        return {"log": lock.log}

    @property
    def device_info(self):
        from homeassistant.helpers import entity_registry as er, device_registry as dr
        ent_reg = er.async_get(self.hass)
        entry = ent_reg.async_get(self.lock_entity_id)
        if entry and entry.device_id:
            dev_reg = dr.async_get(self.hass)
            device = dev_reg.async_get(entry.device_id)
            if device:
                return {"identifiers": device.identifiers}
        return None
