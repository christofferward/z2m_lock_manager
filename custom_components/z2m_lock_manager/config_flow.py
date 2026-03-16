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
                    selector.NumberSelectorConfig(min=1, max=100, step=1, mode=selector.NumberSelectorMode.BOX)
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

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        """Create the options flow."""
        return OptionsFlowHandler(config_entry)


class OptionsFlowHandler(config_entries.OptionsFlow):
    """Handle an options flow for Zigbee2MQTT Lock Manager."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        schema = vol.Schema(
            {
                vol.Required(
                    "locks",
                    default=self.config_entry.options.get(
                        "locks", self.config_entry.data.get("locks", [])
                    ),
                ): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="lock", multiple=True)
                ),
                vol.Required(
                    "max_slots",
                    default=self.config_entry.options.get(
                        "max_slots", self.config_entry.data.get("max_slots", 10)
                    ),
                ): selector.NumberSelector(
                    selector.NumberSelectorConfig(min=1, max=100, step=1, mode=selector.NumberSelectorMode.BOX)
                ),
            }
        )

        return self.async_show_form(step_id="init", data_schema=schema)
