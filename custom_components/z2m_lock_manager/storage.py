"""Data store for Z2M Lock Manager."""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN, STORAGE_KEY, STORAGE_VERSION, MAX_LOG_ENTRIES

_LOGGER = logging.getLogger(__name__)


@dataclass
class Slot:
    """Represents a single user slot on a lock."""

    slot: int
    name: str = ""
    code: str = ""
    enabled: bool = False
    user_type: str = "unrestricted"
    has_fingerprint: bool = False
    has_rfid: bool = False
    auto_rotate: bool = False
    rotate_interval_hours: int = 24
    last_rotated: Optional[str] = None
    valid_from: Optional[str] = None
    valid_to: Optional[str] = None
    recurring_days: list[int] = field(default_factory=list)
    recurring_start_time: Optional[str] = None
    recurring_end_time: Optional[str] = None
    pin_synced_to_lock: bool = False


@dataclass
class Lock:
    """Represents a managed lock device."""

    entity_id: str
    name: str
    max_slots: int = 10
    slots: dict[int, Slot] = field(default_factory=dict)
    log: list[dict] = field(default_factory=list)


class Z2MLockManagerStore:
    """HA storage wrapper with typed lock and slot models."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialise the store."""
        self.hass = hass
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.locks: dict[str, Lock] = {}

    # ------------------------------------------------------------------
    # Load / save
    # ------------------------------------------------------------------

    async def async_load(self) -> None:
        """Load data from HA storage into typed objects."""
        raw = await self._store.async_load()
        if not raw:
            self.locks = {}
            return

        self.locks = {}
        for entity_id, lock_raw in raw.get("locks", {}).items():
            slots: dict[int, Slot] = {}
            for slot_str, slot_raw in lock_raw.get("slots", {}).items():
                slot_int = int(slot_str)
                slots[slot_int] = Slot(
                    slot=slot_int,
                    name=slot_raw.get("name", ""),
                    code=slot_raw.get("code", ""),
                    enabled=slot_raw.get("enabled", False),
                    user_type=slot_raw.get("user_type", "unrestricted"),
                    has_fingerprint=slot_raw.get("has_fingerprint", False),
                    has_rfid=slot_raw.get("has_rfid", False),
                    auto_rotate=slot_raw.get("auto_rotate", False),
                    rotate_interval_hours=slot_raw.get("rotate_interval_hours", 24),
                    last_rotated=slot_raw.get("last_rotated"),
                    valid_from=slot_raw.get("valid_from"),
                    valid_to=slot_raw.get("valid_to"),
                    recurring_days=slot_raw.get("recurring_days", []),
                    recurring_start_time=slot_raw.get("recurring_start_time"),
                    recurring_end_time=slot_raw.get("recurring_end_time"),
                    pin_synced_to_lock=slot_raw.get("pin_synced_to_lock", False),
                )
            self.locks[entity_id] = Lock(
                entity_id=entity_id,
                name=lock_raw.get("name", entity_id),
                max_slots=lock_raw.get("max_slots", 10),
                slots=slots,
                log=lock_raw.get("log", []),
            )

    async def async_save(self) -> None:
        """Persist typed objects back to HA storage."""
        data: dict = {
            "locks": {
                entity_id: {
                    "name": lock.name,
                    "max_slots": lock.max_slots,
                    "log": lock.log,
                    "slots": {
                        str(s.slot): {
                            "name": s.name,
                            "code": s.code,
                            "enabled": s.enabled,
                            "user_type": s.user_type,
                            "has_fingerprint": s.has_fingerprint,
                            "has_rfid": s.has_rfid,
                            "auto_rotate": s.auto_rotate,
                            "rotate_interval_hours": s.rotate_interval_hours,
                            "last_rotated": s.last_rotated,
                            "valid_from": s.valid_from,
                            "valid_to": s.valid_to,
                            "recurring_days": s.recurring_days,
                            "recurring_start_time": s.recurring_start_time,
                            "recurring_end_time": s.recurring_end_time,
                            "pin_synced_to_lock": s.pin_synced_to_lock,
                        }
                        for s in lock.slots.values()
                    },
                }
                for entity_id, lock in self.locks.items()
            }
        }
        await self._store.async_save(data)

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def get_lock(self, entity_id: str) -> Lock | None:
        """Return the Lock object for *entity_id*, or None."""
        return self.locks.get(entity_id)

    def ensure_lock(self, entity_id: str, name: str = "", max_slots: Optional[int] = None) -> Lock:
        """Return (or create) the Lock object for *entity_id*."""
        if entity_id not in self.locks:
            self.locks[entity_id] = Lock(
                entity_id=entity_id,
                name=name or entity_id,
                max_slots=max_slots if max_slots is not None else 10,
            )
        elif max_slots is not None:
            self.locks[entity_id].max_slots = max_slots
        return self.locks[entity_id]

    def ensure_slot(self, lock: Lock, slot: int) -> Slot:
        """Return (or create) the Slot object for *slot* on *lock*."""
        if slot not in lock.slots:
            lock.slots[slot] = Slot(slot=slot)
        return lock.slots[slot]

    async def async_add_log_entry(
        self,
        entity_id: str,
        action: str,
        slot: int | None,
        name: str,
        source: str,
    ) -> None:
        """Add a log entry for a lock event and persist."""
        lock = self.get_lock(entity_id)
        if lock is None:
            return

        entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "action": action,
            "slot": slot,
            "name": name,
            "source": source,
        }

        lock.log.insert(0, entry)
        lock.log = lock.log[:MAX_LOG_ENTRIES]
        await self.async_save()

    def get_lock_data(self, entity_id: str) -> dict:
        """Return a raw-dict view of the lock for the legacy websocket API."""
        lock = self.get_lock(entity_id)
        if lock is None:
            return {"slots": {}}
        return {
            "slots": {
                str(s.slot): {
                    "name": s.name,
                    "code": s.code,
                    "enabled": s.enabled,
                    "user_type": s.user_type,
                    "has_fingerprint": s.has_fingerprint,
                    "has_rfid": s.has_rfid,
                    "auto_rotate": s.auto_rotate,
                    "rotate_interval_hours": s.rotate_interval_hours,
                    "last_rotated": s.last_rotated,
                    "valid_from": s.valid_from,
                    "valid_to": s.valid_to,
                    "recurring_days": s.recurring_days,
                    "recurring_start_time": s.recurring_start_time,
                    "recurring_end_time": s.recurring_end_time,
                    "pin_synced_to_lock": s.pin_synced_to_lock,
                }
                for s in lock.slots.values()
            },
            "max_slots": lock.max_slots,
        }

    async def async_update_slot(
        self,
        entity_id: str,
        slot: int,
        name: str,
        code: str,
        enabled: bool,
        user_type: str = "unrestricted",
        has_fingerprint: bool = False,
        has_rfid: bool = False,
        auto_rotate: bool = False,
        rotate_interval_hours: int = 24,
        last_rotated: str | None = None,
        valid_from: str | None = None,
        valid_to: str | None = None,
        recurring_days: list[int] | None = None,
        recurring_start_time: str | None = None,
        recurring_end_time: str | None = None,
        pin_synced_to_lock: bool = False,
        max_slots: Optional[int] = None,
    ) -> None:
        """Update (or create) a slot and persist."""
        lock = self.ensure_lock(entity_id, max_slots=max_slots)
        s = self.ensure_slot(lock, slot)
        s.name = name
        s.code = code
        s.enabled = enabled
        s.user_type = user_type
        s.has_fingerprint = has_fingerprint
        s.has_rfid = has_rfid
        s.auto_rotate = auto_rotate
        s.rotate_interval_hours = rotate_interval_hours
        s.last_rotated = last_rotated
        s.valid_from = valid_from
        s.valid_to = valid_to
        s.recurring_days = recurring_days or []
        s.recurring_start_time = recurring_start_time
        s.recurring_end_time = recurring_end_time
        s.pin_synced_to_lock = pin_synced_to_lock
        await self.async_save()

    async def async_clear_slot(self, entity_id: str, slot: int) -> None:
        """Remove a slot and persist."""
        lock = self.get_lock(entity_id)
        if lock and slot in lock.slots:
            del lock.slots[slot]
            await self.async_save()
