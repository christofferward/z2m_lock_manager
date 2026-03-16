import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { LockSlot } from "./types";
import { TRANSLATIONS } from "./translations";
import { EYE_ICON, EYE_OFF_ICON } from "./icons";
import { slotStyles } from "./styles";

@customElement("z2m-lock-slot")
export class Z2MLockSlot extends LitElement {
  @property({ type: Object })
  public slotData!: LockSlot;

  @property({ type: String })
  public slotStr!: string;

  @property({ type: Object })
  public hass!: any;

  @property({ type: Object })
  public actionState: { slot: string; type: string } | null = null;

  @property({ type: Object })
  public currentTime!: Date;

  @state()
  private _codeVisible = false;

  static override styles = slotStyles;

  private t(key: string): string {
    const lang = this.hass?.language || "en";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS["en"];
    return dict[key] || TRANSLATIONS["en"][key] || key;
  }

  private calculateTimeRemaining(lastRotated: string, intervalHours: number): string {
    const rotatedAt = new Date(lastRotated);
    const expiresAt = new Date(rotatedAt.getTime() + intervalHours * 60 * 60 * 1000);
    const diffMs = expiresAt.getTime() - this.currentTime.getTime();

    if (diffMs <= 0) {
      return this.t("expired");
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}h ${diffMins}m`;
  }

  private toggleCodeVisibility() {
    this._codeVisible = !this._codeVisible;
  }

  private handleSave() {
    const nameInput = this.shadowRoot!.querySelector("#name") as HTMLInputElement;
    const codeInput = this.shadowRoot!.querySelector("#code") as HTMLInputElement;
    const enabledCheckbox = this.shadowRoot!.querySelector("#enabled") as HTMLInputElement;
    const userTypeSelect = this.shadowRoot!.querySelector("#usertype") as HTMLSelectElement;
    const fpCheckbox = this.shadowRoot!.querySelector("#fingerprint") as HTMLInputElement;
    const rfidCheckbox = this.shadowRoot!.querySelector("#rfid") as HTMLInputElement;
    const autoRotateCheckbox = this.shadowRoot!.querySelector("#autorotate") as HTMLInputElement;
    const intervalInput = this.shadowRoot!.querySelector("#interval") as HTMLInputElement;

    this.dispatchEvent(
      new CustomEvent("save-slot", {
        detail: {
          slot: this.slotStr,
          name: nameInput.value,
          code: codeInput.value,
          enabled: enabledCheckbox.checked,
          userType: userTypeSelect ? userTypeSelect.value : "unrestricted",
          hasFingerprint: fpCheckbox ? fpCheckbox.checked : false,
          hasRfid: rfidCheckbox ? rfidCheckbox.checked : false,
          autoRotate: autoRotateCheckbox ? autoRotateCheckbox.checked : false,
          rotateIntervalHours: intervalInput ? parseInt(intervalInput.value || "24", 10) : 24,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleClear() {
    this.dispatchEvent(
      new CustomEvent("clear-slot", {
        detail: { slot: this.slotStr },
        bubbles: true,
        composed: true,
      })
    );
  }

  // To easily update local state instead of requiring a full save just to show the interval box
  private handleAutoRotateChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.dispatchEvent(
      new CustomEvent("update-slot-data", {
        detail: {
          slot: this.slotStr,
          updates: { auto_rotate: target.checked },
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      <details class="slot-accordion">
        <summary>
          <span class="slot-summary-title">${this.t("slot")} ${this.slotStr}</span>
          <span class="slot-summary-name">${this.slotData.name || "—"}</span>
          <span class="slot-summary-badges">
            ${this.slotData.auto_rotate ? html`<span class="badge badge-guest">${this.t("auto_rotate")}</span>` : ""}
            ${
              this.slotData.enabled
                ? html`<span class="badge badge-enabled">${this.t("enabled")}</span>`
                : html`<span class="badge badge-disabled">${this.t("user_type_non_access")}</span>`
            }
          </span>
        </summary>

        <div class="slot-accordion-body">
          <label class="slot-toggle" style="font-weight: 500;">
            <input type="checkbox" id="enabled" ?checked="${this.slotData.enabled}" />
            ${this.t("enabled")}
          </label>

          <div class="slot-main-inputs">
            <div class="input-group">
              <label>${this.t("name")}</label>
              <input type="text" id="name" .value="${this.slotData.name}" />
            </div>

            <div class="input-group">
              <label>${this.t("pin_code")}${this.slotData.auto_rotate ? " (Auto)" : ""}</label>
              <div class="code-wrapper">
                <input
                  type="${this._codeVisible ? "text" : "password"}"
                  id="code"
                  .value="${this.slotData.code}"
                  ?disabled="${this.slotData.auto_rotate}"
                />
                <button
                  class="btn-toggle"
                  @click=${this.toggleCodeVisibility}
                  title="Toggle visibility"
                >
                  <span style="display:flex; align-items:center; justify-content:center;">
                    ${this._codeVisible ? EYE_OFF_ICON : EYE_ICON}
                  </span>
                </button>
              </div>
            </div>

            ${
              this.slotData.auto_rotate
                ? html`
                    <div class="input-group">
                      <label>${this.t("rotate_interval")}</label>
                      <input
                        type="number"
                        id="interval"
                        .value="${this.slotData.rotate_interval_hours || 24}"
                        min="1"
                      />
                      ${
                        this.slotData.last_rotated && this.slotData.enabled
                          ? html`
                              <div style="font-size: 12px; color: var(--secondary-text-color); margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                                <span
                                  style="display: inline-block; width: 6px; height: 6px; background-color: ${
                                    this.calculateTimeRemaining(
                                      this.slotData.last_rotated,
                                      this.slotData.rotate_interval_hours || 24
                                    ) === this.t("expired")
                                      ? "var(--error-color, #db4437)"
                                      : "var(--success-color, #43a047)"
                                  }; border-radius: 50%;"
                                ></span>
                                ${this.t("expires_in")}:
                                <strong>${this.calculateTimeRemaining(
                                  this.slotData.last_rotated,
                                  this.slotData.rotate_interval_hours || 24
                                )}</strong>
                              </div>
                            `
                          : ""
                      }
                    </div>
                  `
                : html`
                    <div class="input-group">
                      <label>${this.t("user_type")}</label>
                      <select
                        id="usertype"
                        .value="${this.slotData.user_type || "unrestricted"}"
                      >
                        <option value="unrestricted">${this.t("user_type_unrestricted")}</option>
                        <option value="non_access">${this.t("user_type_non_access")}</option>
                      </select>
                    </div>
                  `
            }
          </div>

          <div class="slot-footer">
            <div class="toggles-wrapper">
              <label class="slot-toggle">
                <input
                  type="checkbox"
                  id="autorotate"
                  ?checked="${this.slotData.auto_rotate}"
                  @change=${this.handleAutoRotateChange}
                />
                ${this.t("auto_rotate")}
              </label>

              <label class="slot-toggle">
                <input
                  type="checkbox"
                  id="fingerprint"
                  ?checked="${this.slotData.has_fingerprint}"
                />
                ${this.t("fingerprint")}
              </label>
              <label class="slot-toggle">
                <input
                  type="checkbox"
                  id="rfid"
                  ?checked="${this.slotData.has_rfid}"
                />
                ${this.t("rfid")}
              </label>
            </div>

            <div class="slot-actions">
              <button class="btn btn-save" @click=${this.handleSave}>
                ${
                  this.actionState?.slot === this.slotStr && this.actionState.type === "saving"
                    ? this.t("saving")
                    : this.actionState?.slot === this.slotStr && this.actionState.type === "saved"
                    ? this.t("saved")
                    : this.t("save")
                }
              </button>
              <button class="btn btn-clear" @click=${this.handleClear}>
                ${
                  this.actionState?.slot === this.slotStr && this.actionState.type === "clearing"
                    ? this.t("clearing")
                    : this.actionState?.slot === this.slotStr && this.actionState.type === "cleared"
                    ? this.t("cleared")
                    : this.t("clear")
                }
              </button>
            </div>
          </div>
        </div>
      </details>
    `;
  }
}
