"""Data store for Z2M Lock Manager."""
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN

STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.store"

class Z2MLockManagerStore:
    """Class to hold Z2M Lock Manager data."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the store."""
        self.hass = hass
        self._store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: dict = {}

    async def async_load(self) -> None:
        """Load data from disk."""
        data = await self._store.async_load()
        if data is None:
            data = {"locks": {}}
        self.data = data

    async def async_save(self) -> None:
        """Save data to disk."""
        await self._store.async_save(self.data)

    def get_lock_data(self, lock_entity_id: str) -> dict:
        """Get data for a specific lock."""
        if lock_entity_id not in self.data["locks"]:
            self.data["locks"][lock_entity_id] = {"slots": {}}
        return self.data["locks"][lock_entity_id]

    async def async_update_slot(
        self, 
        lock_entity_id: str, 
        slot: int, 
        name: str, 
        code: str, 
        enabled: bool, 
        user_type: str = "unrestricted",
        has_fingerprint: bool = False,
        has_rfid: bool = False,
        auto_rotate: bool = False,
        rotate_interval_hours: int = 24,
        last_rotated: str | None = None
    ) -> None:
        """Update a specific slot."""
        lock_data = self.get_lock_data(lock_entity_id)
        lock_data["slots"][str(slot)] = {
            "name": name,
            "code": code,
            "enabled": enabled,
            "user_type": user_type,
            "has_fingerprint": has_fingerprint,
            "has_rfid": has_rfid,
            "auto_rotate": auto_rotate,
            "rotate_interval_hours": rotate_interval_hours,
            "last_rotated": last_rotated
        }
        await self.async_save()

    async def async_clear_slot(self, lock_entity_id: str, slot: int) -> None:
        """Clear a specific slot."""
        lock_data = self.get_lock_data(lock_entity_id)
        if str(slot) in lock_data["slots"]:
            del lock_data["slots"][str(slot)]
            await self.async_save()
