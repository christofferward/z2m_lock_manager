"""Panel registration for Z2M Lock Manager."""
from __future__ import annotations

from pathlib import Path

from homeassistant.components.frontend import async_register_built_in_panel, async_remove_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    PANEL_ICON,
    PANEL_MODULE_URL,
    PANEL_PATH,
    PANEL_TITLE,
    PANEL_URL_BASE,
    PANEL_URL_PATH,
)


async def async_register_panel(hass: HomeAssistant) -> None:
    """Register (or update) the sidebar panel and its static assets.

    Guards against duplicates so reloading the integration or updating
    options won't raise ValueError("Overwriting panel ...").
    """
    panel_dir = Path(__file__).parent / PANEL_PATH
    domain_data = hass.data.setdefault(DOMAIN, {})

    # Serve static assets — register once per HA session.
    if not domain_data.get("static_paths_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(PANEL_URL_BASE, str(panel_dir), cache_headers=False)]
        )
        domain_data["static_paths_registered"] = True

    # Register sidebar panel; on reload remove the old entry first.
    _panel_config = {
        "_panel_custom": {
            "name": "z2m-lock-manager-panel",
            "module_url": PANEL_MODULE_URL,
        }
    }
    try:
        async_register_built_in_panel(
            hass,
            component_name="custom",
            frontend_url_path=PANEL_URL_PATH,
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            require_admin=True,
            config=_panel_config,
        )
    except ValueError:
        # Panel already registered (e.g. integration reload) — replace it.
        async_remove_panel(hass, PANEL_URL_PATH)
        async_register_built_in_panel(
            hass,
            component_name="custom",
            frontend_url_path=PANEL_URL_PATH,
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            require_admin=True,
            config=_panel_config,
        )

    domain_data["panel_registered"] = True


def async_unregister_panel(hass: HomeAssistant) -> None:
    """Remove the sidebar panel."""
    async_remove_panel(hass, PANEL_URL_PATH)
    hass.data.get(DOMAIN, {}).pop("panel_registered", None)
