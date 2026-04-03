import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LockSlot } from "./types";
import { TRANSLATIONS } from "./translations";
import { EYE_ICON, EYE_OFF_ICON } from "./icons";
import { slotStyles } from "./styles";

@customElement("z2m-lock-slot")
export class Z2MLockSlot extends LitElement {
  @property({ type: Object }) public slotData!: LockSlot;
  @property({ type: String }) public slotStr!: string;
  @property({ type: Object }) public hass!: any;
  @property({ attribute: false }) public actionState: any = null;
  @property({ attribute: false }) public currentTime!: Date;

  static override styles = slotStyles;

  @state() private _codeVisible = false;

  private get _isSaving() { return this.actionState?.slot === this.slotStr && this.actionState.type === "saving"; }
  private get _isSaved() { return this.actionState?.slot === this.slotStr && this.actionState.type === "saved"; }
  private get _isClearing() { return this.actionState?.slot === this.slotStr && this.actionState.type === "clearing"; }
  private get _isCleared() { return this.actionState?.slot === this.slotStr && this.actionState.type === "cleared"; }

  private _getTimeRemaining(lastRotated: string, intervalHours: number): string {
    const expiresAt = new Date(new Date(lastRotated).getTime() + intervalHours * 3_600_000);
    const diffMs = expiresAt.getTime() - this.currentTime.getTime();
    if (diffMs <= 0) return this.t("expired");
    const h = Math.floor(diffMs / 3_600_000);
    const m = Math.floor((diffMs % 3_600_000) / 60_000);
    return `${h}h ${m}m`;
  }

  private _formatDateForInput(dateStr?: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  private _formatDateOnlyForInput(dateStr?: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  private _getScheduleState(): string | null {
    const sd = this.slotData;
    if (!sd.enabled) return null;
    if (!sd.valid_from && !sd.valid_to) return null;

    const now = this.currentTime.getTime();
    const vf = sd.valid_from ? new Date(sd.valid_from).getTime() : 0;
    const vt = sd.valid_to ? new Date(sd.valid_to).getTime() : Infinity;

    const formatDiff = (diffMs: number) => {
      const d = Math.floor(diffMs / 86400000);
      const h = Math.floor((diffMs % 86400000) / 3600000);
      const m = Math.floor((diffMs % 3600000) / 60000);
      return d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`;
    };

    if (vf && now < vf) {
      return `${this.t("enables_in")}: ${formatDiff(vf - now)}`;
    }
    if (sd.recurring_days && sd.recurring_days.length > 0) {
      return this.t("recurring_schedule");
    }
    if (vt && now < vt) {
      return `${this.t("disables_in")}: ${formatDiff(vt - now)}`;
    }
    return this.t("expired");
  }

  override render() {
    const sd = this.slotData;
    const timeLeft = sd.auto_rotate && sd.last_rotated ? this._getTimeRemaining(sd.last_rotated, sd.rotate_interval_hours ?? 24) : null;
    const expired = timeLeft === this.t("expired");
    const scheduleState = !sd.auto_rotate ? this._getScheduleState() : null;

    return html`
      <!-- Row 1: Name, Code, Type -->
      <div class="form-row">
        <div class="input-group">
          <label>${this.t("name")}</label>
          <input type="text" id="name" .value="${sd.name}" autocomplete="off" />
        </div>
        <div class="input-group">
          <label>${this.t("pin_code")}${sd.auto_rotate ? " (Auto)" : ""}</label>
          <div class="code-wrapper">
            <input type="${this._codeVisible ? "text" : "password"}" id="code" .value="${sd.code}" ?disabled="${sd.auto_rotate}" autocomplete="new-password" />
            <button class="btn-icon" @click=${() => this._codeVisible = !this._codeVisible} title="Toggle visibility">
              ${this._codeVisible ? EYE_OFF_ICON : EYE_ICON}
            </button>
          </div>
        </div>
        ${sd.auto_rotate ? html`
          <div class="input-group">
            <label>${this.t("rotate_interval")}</label>
            <input type="number" id="interval" .value="${sd.rotate_interval_hours ?? 24}" min="1" />
          </div>
        ` : html`
          <div class="input-group">
            <label>${this.t("user_type")}</label>
            <select id="usertype" .value="${sd.user_type ?? "unrestricted"}" @change=${this._handleUserTypeChange}>
              <option value="unrestricted">${this.t("user_type_unrestricted")}</option>
              <option value="year_day_schedule">${this.t("user_type_year_day_schedule")}</option>
              <option value="week_day_schedule">${this.t("user_type_week_day_schedule")}</option>
              <option value="non_access">${this.t("user_type_non_access")}</option>
            </select>
          </div>
        `}
      </div>

      ${sd.auto_rotate && timeLeft && sd.enabled ? html`
        <div class="rotate-info">
          <span class="dot ${expired ? "dot-red" : "dot-green"}"></span>
          ${this.t("expires_in")}: <strong>${timeLeft}</strong>
        </div>
      ` : ""}

      <!-- Row 2: Valid From, Valid To (only for schedule types) -->
      ${!sd.auto_rotate && (sd.user_type === "year_day_schedule" || sd.user_type === "week_day_schedule") ? html`
        <div class="form-row">
          <div class="input-group">
            <label>${this.t("valid_from")}</label>
            ${sd.user_type === "week_day_schedule" 
              ? html`<input type="date" id="valid_from" .value="${this._formatDateOnlyForInput(sd.valid_from)}" />`
              : html`<input type="datetime-local" id="valid_from" .value="${this._formatDateForInput(sd.valid_from)}" />`
            }
          </div>
          <div class="input-group">
            <label>${this.t("valid_to")}</label>
            ${sd.user_type === "week_day_schedule" 
              ? html`<input type="date" id="valid_to" .value="${this._formatDateOnlyForInput(sd.valid_to)}" />`
              : html`<input type="datetime-local" id="valid_to" .value="${this._formatDateForInput(sd.valid_to)}" />`
            }
          </div>
        </div>
      ` : ""}

      <!-- Row 3: Recurring days (only for week_day_schedule) -->
      ${!sd.auto_rotate && sd.user_type === "week_day_schedule" ? html`
        <div class="input-group">
          <label>${this.t("recurring_schedule")}</label>
          <div class="days-wrap">
            ${[0, 1, 2, 3, 4, 5, 6].map(d => html`
              <div 
                class="day-btn ${(sd.recurring_days || []).includes(d) ? "selected" : ""}"
                @click=${() => this._toggleRecurringDay(d)}
              >
                ${this.t(["mon", "tue", "wed", "thu", "fri", "sat", "sun"][d])}
              </div>
            `)}
          </div>
        </div>

        <!-- Row 4: Start time, End time -->
        <div class="form-row">
          <div class="input-group">
            <label>${this.t("start_time")}</label>
            <input type="time" id="recurring_start" .value="${sd.recurring_start_time || ""}" />
          </div>
          <div class="input-group">
            <label>${this.t("end_time")}</label>
            <input type="time" id="recurring_end" .value="${sd.recurring_end_time || ""}" />
          </div>
        </div>
      ` : ""}
      
      ${scheduleState ? html`
        <div class="rotate-info">
          <span class="dot ${scheduleState === this.t("expired") ? "dot-red" : "dot-green"}"></span>
          ${scheduleState}
          ${sd.pin_synced_to_lock 
            ? html` | <span style="color: #4caf50; font-size: 0.9em; font-weight: 500;">${this.t("status_synced")}</span>` 
            : html` | <span style="color: #ff9800; font-size: 0.9em; font-weight: 500;">${this.t("status_pending")}</span>`}
        </div>
      ` : ""}

      <!-- Row 5: Toggles -->
      <div class="toggles-row">
        <label class="slot-toggle">
          <ha-switch id="enabled" .checked="${sd.enabled}"></ha-switch>
          ${this.t("enabled")}
        </label>
        <label class="slot-toggle">
          <ha-switch id="autorotate" .checked="${sd.auto_rotate}" @change=${this._handleAutoRotateChange}></ha-switch>
          ${this.t("auto_rotate")}
        </label>
        <div class="toggle-divider"></div>
        <label class="slot-toggle">
          <ha-switch id="fingerprint" .checked="${sd.has_fingerprint}"></ha-switch>
          ${this.t("fingerprint")}
        </label>
        <label class="slot-toggle">
          <ha-switch id="rfid" .checked="${sd.has_rfid}"></ha-switch>
          ${this.t("rfid")}
        </label>
      </div>

      <!-- Row 6: Save, Clear -->
      <div class="actions-row">
        <button class="btn btn-save" @click=${this._handleSave}>
          ${this._isSaving ? this.t("saving") : this._isSaved ? this.t("saved") : this.t("save")}
        </button>
        <button class="btn btn-clear" @click=${this._handleClear}>
          ${this._isClearing ? this.t("clearing") : this._isCleared ? this.t("cleared") : this.t("clear")}
        </button>
      </div>
    `;
  }

  private t(key: string): string {
    const lang = this.hass?.language || "en";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS["en"];
    return dict[key] || TRANSLATIONS["en"][key] || key;
  }

  private _handleAutoRotateChange(e: Event) {
    this.dispatchEvent(new CustomEvent("update-slot-data", {
      detail: { slot: this.slotStr, updates: { auto_rotate: (e.target as any).checked } },
      bubbles: true, composed: true,
    }));
  }

  private _handleUserTypeChange(e: Event) {
    this.dispatchEvent(new CustomEvent("update-slot-data", {
      detail: { slot: this.slotStr, updates: { user_type: (e.target as any).value } },
      bubbles: true, composed: true,
    }));
  }

  private _toggleRecurringDay(day: number) {
    const days = [...(this.slotData.recurring_days || [])];
    const idx = days.indexOf(day);
    if (idx !== -1) {
      days.splice(idx, 1);
    } else {
      days.push(day);
    }
    this.dispatchEvent(new CustomEvent("update-slot-data", {
      detail: { slot: this.slotStr, updates: { recurring_days: days } },
      bubbles: true, composed: true,
    }));
  }

  private _handleSave() {
    const q = <T extends HTMLElement>(id: string) => this.shadowRoot!.querySelector<T>(`#${id}`);
    const vfInput = q<HTMLInputElement>("valid_from");
    const vtInput = q<HTMLInputElement>("valid_to");
    
    let vf = null;
    if (vfInput?.value) {
      vf = new Date(vfInput.value.includes('T') ? vfInput.value : `${vfInput.value}T00:00:00`).toISOString();
    }
    let vt = null;
    if (vtInput?.value) {
      vt = new Date(vtInput.value.includes('T') ? vtInput.value : `${vtInput.value}T23:59:59`).toISOString();
    }

    this.dispatchEvent(new CustomEvent("save-slot", {
      detail: {
        slot: this.slotStr,
        name: q<HTMLInputElement>("name")?.value || "",
        code: q<HTMLInputElement>("code")?.value || "",
        enabled: q<any>("enabled")?.checked ?? false,
        userType: q<HTMLSelectElement>("usertype")?.value ?? "unrestricted",
        hasFingerprint: q<any>("fingerprint")?.checked ?? false,
        hasRfid: q<any>("rfid")?.checked ?? false,
        autoRotate: q<any>("autorotate")?.checked ?? false,
        rotateIntervalHours: parseInt(q<HTMLInputElement>("interval")?.value ?? "24", 10),
        validFrom: vf,
        validTo: vt,
        recurringDays: this.slotData.recurring_days || [],
        recurringStartTime: q<HTMLInputElement>("recurring_start")?.value || null,
        recurringEndTime: q<HTMLInputElement>("recurring_end")?.value || null,
      },
      bubbles: true, composed: true,
    }));
  }

  private _handleClear() {
    this.dispatchEvent(new CustomEvent("clear-slot", {
      detail: { slot: this.slotStr },
      bubbles: true, composed: true,
    }));
  }
}
