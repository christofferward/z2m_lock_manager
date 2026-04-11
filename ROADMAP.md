# Roadmap - Zigbee2MQTT Lock Manager

---

## Completed

- **HACS Support** — Published and available via Home Assistant Community Store
- **PIN Code Management** — Set, clear, and toggle user PIN codes per slot via Zigbee2MQTT / MQTT
- **Auto-Rotating Guest Codes** — Temporary codes that auto-regenerate on a configurable interval, with expiration countdown in the UI
- **Fingerprint & RFID Tracking** — Per-slot toggles to track which users have fingerprint or RFID enrolled
- **Multi-Lock Support** — Manage multiple Z2M locks from a single panel
- **Multi-Language UI** — English and Swedish translations built in
- **Admin-Only Panel** — Side panel is restricted to Home Assistant admin users (`require_admin`)
- **Save/Clear Feedback** — Visual status indicators when saving or clearing a slot
- **Configurable Slot Count** — Define the maximum number of code slots per lock via configuration (defaults to 10)
- **Date-Based User Codes** — Schedule codes to automatically enable or disable on specific dates (valid_from/valid_to) for guests and service access
- **Recurring Weekly Schedules** — Configure slots with day-of-week and time-of-day constraints (e.g. cleaner every Mon/Wed/Fri 09:00–17:00)
- **User Type-Driven UI** — Config fields appear contextually based on the selected user type (Unrestricted, Year/Day Schedule, Week/Day Schedule, Non-Access)
- **Schedule-Aware Slot Colors** — Slot chips visually distinguish between scheduled-active (purple) and scheduled-inactive (amber) states
- **Responsive Mobile Layout** — Slot configuration form adapts to narrow screens with stacked inputs
- **Pre-Commit Build Hook** — Git hook automatically builds the frontend JS before every commit, preventing stale builds from being checked in

---

## Planned

### Event-Based Notifications

> Fire HA events on key actions for use in automations.

- `z2m_lock_manager_code_set` — when a code is saved
- `z2m_lock_manager_code_cleared` — when a code is cleared
- `z2m_lock_manager_code_expired` — when a date-based code reaches its `valid_to`

### Audit Log / History

> Track when codes were last used, changed, or rotated.

- Store a lightweight history of actions per slot
- Display last-changed timestamp in the UI
- Optionally expose as HA sensors for dashboard use

---

## Ideas

- **One-Time Codes** — codes that auto-clear after a single use
- **Lock Status Dashboard Card** — a Lovelace card showing slot overview at a glance
- **Per-User HA Notifications** — send the generated guest code via HA notify services (e.g. SMS, Telegram)
- **Import/Export Slot Config** — backup and restore slot configuration as JSON/YAML

---

_Last updated: 2026-04-11_
