"""Constants for the Zigbee2MQTT Lock Manager integration."""

DOMAIN = "z2m_lock_manager"
PLATFORMS: list[str] = []  # UI-only integration: no entity platforms

# --- Storage ---
STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1

# --- Config-entry keys ---
CONF_LOCKS = "locks"
CONF_MAX_SLOTS = "max_slots"
DEFAULT_MAX_SLOTS = 10

# --- Frontend / panel ---
PANEL_URL_BASE = "/z2m-lock-manager-frontend"
PANEL_PATH = "frontend"  # subdirectory inside the integration package
PANEL_MODULE_URL = f"{PANEL_URL_BASE}/z2m_lock_manager_panel.js"
PANEL_TITLE = "Z2M Locks"
PANEL_ICON = "mdi:lock-smart"
PANEL_URL_PATH = "z2m-lock-manager"

# --- WebSocket command types ---
WS_NS = DOMAIN
WS_GET_LOCKS = f"{WS_NS}/get_locks"
WS_SET_CODE = f"{WS_NS}/set_code"
WS_CLEAR_CODE = f"{WS_NS}/clear_code"
