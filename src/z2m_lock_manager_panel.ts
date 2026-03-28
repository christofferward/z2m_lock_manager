import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { LockData, LockSlot } from "./types";
import { TRANSLATIONS } from "./translations";
import { PERSON_ICON, ROTATE_ICON, LOCK_ICON, CLOCK_ICON } from "./icons";
import { panelStyles } from "./styles";
import "./z2m_lock_slot";

const EMPTY_SLOT: LockSlot = {
  name: "",
  code: "",
  enabled: false,
  user_type: "unrestricted",
  auto_rotate: false,
  rotate_interval_hours: 24,
};

@customElement("z2m-lock-manager-panel")
export class Z2MLockManagerPanel extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @property({ type: Boolean }) public narrow!: boolean;

  @state() private locks: LockData[] = [];
  @state() private selectedLock: string | null = null;
  @state() private selectedSlot: string | null = null;
  @state() private actionState: {
    slot: string;
    type: "saving" | "saved" | "clearing" | "cleared";
  } | null = null;
  @state() private currentTime: Date = new Date();
  @state() private _currentPage = 0;
  private _loading = false;
  private PAGE_SIZE = 20;

  static override styles = panelStyles;

  private _timerInterval: number | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this._timerInterval = window.setInterval(() => {
      this.currentTime = new Date();
    }, 60_000);
    document.addEventListener("visibilitychange", this._handleVisibilityChange);
    if (this.hass) this.loadLocks();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timerInterval !== null) window.clearInterval(this._timerInterval);
    document.removeEventListener(
      "visibilitychange",
      this._handleVisibilityChange,
    );
  }

  protected override updated(changed: Map<string | number | symbol, unknown>) {
    if (changed.has("hass") && this.hass) {
      const old = changed.get("hass") as any;
      if (!old || this.locks.length === 0) {
        this.loadLocks().catch((e) => console.warn("Failed loading locks:", e));
      }
    }
  }

  private _handleVisibilityChange = () => {
    if (document.visibilityState === "visible" && this.hass) {
      this.loadLocks().catch((e) => console.warn("Skipped reload:", e));
    }
  };

  private t(key: string): string {
    const lang = this.hass?.language || "en";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS["en"];
    return dict[key] || TRANSLATIONS["en"][key] || key;
  }

  async loadLocks() {
    if (this._loading) return;
    this._loading = true;
    try {
      this.locks = await this.hass.connection.sendMessagePromise({
        type: "z2m_lock_manager/get_locks",
      });
      if (this.locks.length > 0) {
        // Initialize selection if needed, or validate current selection
        const lockExists = this.locks.some(l => l.entity_id === this.selectedLock);
        if (!this.selectedLock || !lockExists) {
          this.selectedLock = this.locks[0].entity_id;
        }
      }
    } catch (err) {
      console.error("Failed to load locks", err);
    } finally {
      this._loading = false;
    }
  }



  private async handleSlotSave(e: CustomEvent) {
    const data = e.detail;
    this.actionState = { slot: data.slot, type: "saving" };
    try {
      await this.hass.connection.sendMessagePromise({
        type: "z2m_lock_manager/set_code",
        entity_id: this.selectedLock,
        slot: parseInt(data.slot, 10),
        name: data.name,
        code: data.code,
        enabled: data.enabled,
        user_type: data.userType,
        has_fingerprint: data.hasFingerprint,
        has_rfid: data.hasRfid,
        auto_rotate: data.autoRotate,
        rotate_interval_hours: data.rotateIntervalHours,
        valid_from: data.validFrom,
        valid_to: data.validTo,
        recurring_days: data.recurringDays,
        recurring_start_time: data.recurringStartTime,
        recurring_end_time: data.recurringEndTime,
      });
      await this.loadLocks();
      this.actionState = { slot: data.slot, type: "saved" };
    } catch (err) {
      console.error("Failed to set code", err);
      this.actionState = null;
      return;
    }
    setTimeout(() => {
      const state = this.actionState;
      if (state && state.slot === data.slot && state.type === "saved") {
        this.actionState = null;
      }
    }, 2000);
  }

  private async handleSlotClear(e: CustomEvent) {
    const data = e.detail;
    this.actionState = { slot: data.slot, type: "clearing" };
    try {
      await this.hass.connection.sendMessagePromise({
        type: "z2m_lock_manager/clear_code",
        entity_id: this.selectedLock,
        slot: parseInt(data.slot, 10),
      });
      await this.loadLocks();
      this.actionState = { slot: data.slot, type: "cleared" };
    } catch (err) {
      console.error("Failed to clear code", err);
      this.actionState = null;
      return;
    }
    setTimeout(() => {
      const state = this.actionState;
      if (state && state.slot === data.slot && state.type === "cleared") {
        this.actionState = null;
      }
    }, 2000);
  }

  private handleSlotUpdate(e: CustomEvent) {
    const { slot, updates } = e.detail;
    const lockIdx = this.locks.findIndex(l => l.entity_id === this.selectedLock);
    if (lockIdx === -1) return;

    this.locks[lockIdx].slots[slot] = {
      ...(this.locks[lockIdx].slots[slot] ?? EMPTY_SLOT),
      ...updates,
    };
    this.requestUpdate();
  }

  private _getChipState(slot: LockSlot | undefined): "active" | "guest" | "disabled" | "empty" | "scheduled-active" | "scheduled-inactive" {
    if (!slot) return "empty";
    if (!slot.enabled) return slot.name || slot.code ? "disabled" : "empty";
    if (slot.auto_rotate) return "guest";
    
    const hasSchedule = slot.valid_from || slot.valid_to || (slot.recurring_days && slot.recurring_days.length > 0);
    if (!hasSchedule) return "active";

    // Check if currently within the schedule window
    const now = this.currentTime;
    const nowMs = now.getTime();
    
    // Check date boundaries
    if (slot.valid_from && nowMs < new Date(slot.valid_from).getTime()) return "scheduled-inactive";
    if (slot.valid_to && nowMs > new Date(slot.valid_to).getTime()) return "scheduled-inactive";
    
    // Check recurring day/time
    if (slot.recurring_days && slot.recurring_days.length > 0) {
      const dayIndex = (now.getDay() + 6) % 7; // Convert Sun=0 to Mon=0
      if (!slot.recurring_days.includes(dayIndex)) return "scheduled-inactive";
      
      if (slot.recurring_start_time && slot.recurring_end_time) {
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (timeStr < slot.recurring_start_time || timeStr >= slot.recurring_end_time) return "scheduled-inactive";
      }
    }
    
    return "scheduled-active";
  }

  private _getChipIcon(state: string) {
    if (state === "guest") return ROTATE_ICON;
    if (state === "active") return PERSON_ICON;
    if (state === "scheduled-active" || state === "scheduled-inactive") return CLOCK_ICON;
    return LOCK_ICON;
  }

  override render() {
    const currentLock = this.locks.find(l => l.entity_id === this.selectedLock) || this.locks[0];
    
    if (!this.hass || !this.locks.length) {
      return html`
        <div class="header">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <span class="title">${this.t("title")}</span>
        </div>
        <div class="content">
          <div class="empty-state">${this.t("loading")}</div>
        </div>
      `;
    }

    const slots = currentLock?.slots ?? {};
    const maxSlots = currentLock?.max_slots ?? 10;
    const selectedSlotData = this.selectedSlot ? (slots[this.selectedSlot] ?? { ...EMPTY_SLOT }) : null;

    return html`
      <div class="header">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <span class="title">${this.t("title")}</span>
      </div>

      <div class="content">
        <div class="lock-tabs">
          ${this.locks.map(lock => html`
            <button
              class="lock-tab ${lock.entity_id === this.selectedLock ? "active" : ""}"
              @click=${() => {
                this.selectedLock = lock.entity_id;
                this.selectedSlot = null;
                this._currentPage = 0;
              }}
            >
              ${lock.name}
            </button>
          `)}
        </div>

        <div class="overview-card">
          <div class="section-title">${this.t("select_lock")}</div>
          <div class="slot-grid">
            ${this._renderSlotGrid(slots, maxSlots)}
          </div>
          ${this._renderPagination(maxSlots)}
        </div>

        ${this.selectedSlot && selectedSlotData ? html`
          <div class="detail-card">
            <div class="detail-header">
              <span class="detail-title">
                ${this.t("slot")} ${this.selectedSlot}
                ${selectedSlotData.name ? ` · ${selectedSlotData.name}` : ""}
              </span>
              <button class="detail-close" @click=${() => this.selectedSlot = null}>✕</button>
            </div>
            <div class="detail-grid">
              <z2m-lock-slot
                .slotData=${selectedSlotData}
                .slotStr=${this.selectedSlot}
                .hass=${this.hass}
                .currentTime=${this.currentTime}
                .actionState=${this.actionState}
                @save-slot=${this.handleSlotSave}
                @clear-slot=${this.handleSlotClear}
                @update-slot-data=${this.handleSlotUpdate}
              ></z2m-lock-slot>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  }

  private _renderSlotGrid(slots: Record<string, LockSlot>, maxSlots: number) {
    const start = this._currentPage * this.PAGE_SIZE;
    const end = Math.min(start + this.PAGE_SIZE, maxSlots);

    return Array.from({ length: end - start }, (_, i) => {
      const slotNum = String(start + i + 1);
      const slot = slots[slotNum];
      const state = this._getChipState(slot);

      return html`
        <div
          class="slot-chip state-${state} ${this.selectedSlot === slotNum ? "selected" : ""}"
          @click=${() => this.selectedSlot = (this.selectedSlot === slotNum ? null : slotNum)}
          title="${slot?.name || ""}"
        >
          <span class="slot-chip-number">${this.t("slot")} ${slotNum}</span>
          <span class="slot-chip-icon">${this._getChipIcon(state)}</span>
          <span class="slot-chip-name">${slot?.name || "—"}</span>
        </div>
      `;
    });
  }

  private _renderPagination(maxSlots: number) {
    if (maxSlots <= this.PAGE_SIZE) return "";

    const startIdx = this._currentPage * this.PAGE_SIZE + 1;
    const endIdx = Math.min((this._currentPage + 1) * this.PAGE_SIZE, maxSlots);

    return html`
      <div class="pagination">
        <button
          class="page-btn"
          ?disabled=${this._currentPage === 0}
          @click=${() => { this._currentPage--; this.selectedSlot = null; }}
        >←</button>
        <span class="page-info">
          ${startIdx}–${endIdx} &nbsp;/&nbsp; ${maxSlots}
        </span>
        <button
          class="page-btn"
          ?disabled=${(this._currentPage + 1) * this.PAGE_SIZE >= maxSlots}
          @click=${() => { this._currentPage++; this.selectedSlot = null; }}
        >→</button>
      </div>
    `;
  }
}
