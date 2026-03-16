"""Config flow for Zigbee2MQTT Lock Manager integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import selector
import homeassistant.helpers.config_validation as cv

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

STEP_USER_DATA_SCHEMA = vol.Schema(
    {
        vol.Required("name", default="Z2M Lock Manager"): str,
        vol.Required("locks"): selector.EntitySelector(
            selector.EntitySelectorConfig(domain="lock", multiple=True)
        ),
    }
)

class ConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Zigbee2MQTT Lock Manager."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}
        
        # We want to find devices from mqtt that might be locks. 
        # For simplicity in this first step, let the user choose entities.
        # Build a list of lock entities 
        schema = vol.Schema(
            {
                vol.Required("name", default="Z2M Lock Manager"): str,
                vol.Required("locks"): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="lock", multiple=True)
                ),
                vol.Optional("max_slots", default=10): selector.NumberSelector(
                    selector.NumberSelectorConfig(min=10, max=50, step=1, mode=selector.NumberSelectorMode.BOX)
                ),
            }
        )

        if user_input is not None:
            # Validate and create entry
            if not errors:
                return self.async_create_entry(title=user_input["name"], data=user_input)

        return self.async_show_form(
            step_id="user", data_schema=schema, errors=errors
        )
