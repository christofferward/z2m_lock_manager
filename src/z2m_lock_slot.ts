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

  override render() {
    const sd = this.slotData;
    const timeLeft = sd.auto_rotate && sd.last_rotated ? this._getTimeRemaining(sd.last_rotated, sd.rotate_interval_hours ?? 24) : null;
    const expired = timeLeft === this.t("expired");

    return html`
      <div class="input-group">
        <label>${this.t("name")}</label>
        <input type="text" id="name" .value="${sd.name}" />
      </div>

      <div class="input-group">
        <label>${this.t("pin_code")}${sd.auto_rotate ? " (Auto)" : ""}</label>
        <div class="code-wrapper">
          <input type="${this._codeVisible ? "text" : "password"}" id="code" .value="${sd.code}" ?disabled="${sd.auto_rotate}" />
          <button class="btn-icon" @click=${() => this._codeVisible = !this._codeVisible} title="Toggle visibility">
            ${this._codeVisible ? EYE_OFF_ICON : EYE_ICON}
          </button>
        </div>
      </div>

      ${sd.auto_rotate ? html`
        <div class="input-group">
          <label>${this.t("rotate_interval")}</label>
          <input type="number" id="interval" .value="${sd.rotate_interval_hours ?? 24}" min="1" />
          ${timeLeft && sd.enabled ? html`
            <div class="rotate-info">
              <span class="dot ${expired ? "dot-red" : "dot-green"}"></span>
              ${this.t("expires_in")}: <strong>${timeLeft}</strong>
            </div>` : ""}
        </div>
      ` : html`
        <div class="input-group">
          <label>${this.t("user_type")}</label>
          <select id="usertype" .value="${sd.user_type ?? "unrestricted"}">
            <option value="unrestricted">${this.t("user_type_unrestricted")}</option>
            <option value="non_access">${this.t("user_type_non_access")}</option>
          </select>
        </div>
      `}

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

  private _handleSave() {
    const q = <T extends HTMLElement>(id: string) => this.shadowRoot!.querySelector<T>(`#${id}`)!;
    this.dispatchEvent(new CustomEvent("save-slot", {
      detail: {
        slot: this.slotStr,
        name: q<HTMLInputElement>("name").value,
        code: q<HTMLInputElement>("code").value,
        enabled: q<any>("enabled").checked,
        userType: q<HTMLSelectElement>("usertype")?.value ?? "unrestricted",
        hasFingerprint: q<any>("fingerprint")?.checked ?? false,
        hasRfid: q<any>("rfid")?.checked ?? false,
        autoRotate: q<any>("autorotate")?.checked ?? false,
        rotateIntervalHours: parseInt(q<HTMLInputElement>("interval")?.value ?? "24", 10),
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
