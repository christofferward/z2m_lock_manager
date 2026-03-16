import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { LockData } from "./types";
import { TRANSLATIONS } from "./translations";
import { panelStyles } from "./styles";
import "./z2m_lock_slot";

@customElement("z2m-lock-manager-panel")
export class Z2MLockManagerPanel extends LitElement {
  @property({ attribute: false })
  public hass!: any;

  @state()
  private locks: LockData[] = [];

  @state()
  private selectedLock: string | null = null;

  @state()
  private actionState: {
    slot: string;
    type: "saving" | "saved" | "clearing" | "cleared";
  } | null = null;

  @state()
  private currentPage: number = 1;

  @state()
  private currentTime: Date = new Date();

  private _timerInterval: number | null = null;

  private _hassSet = false;

  override connectedCallback() {
    super.connectedCallback();
    this._timerInterval = window.setInterval(() => {
      this.currentTime = new Date();
    }, 60000);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timerInterval !== null) {
      window.clearInterval(this._timerInterval);
    }
  }

  private calculateTimeRemaining(
    lastRotated: string,
    intervalHours: number,
  ): string {
    const rotatedAt = new Date(lastRotated);
    const expiresAt = new Date(
      rotatedAt.getTime() + intervalHours * 60 * 60 * 1000,
    );
    const diffMs = expiresAt.getTime() - this.currentTime.getTime();

    if (diffMs <= 0) {
      return this.t("expired");
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${diffHours}h ${diffMins}m`;
  }

  private t(key: string): string {
    const lang = this.hass?.language || "en";
    const dict = TRANSLATIONS[lang] || TRANSLATIONS["en"];
    return dict[key] || TRANSLATIONS["en"][key] || key;
  }

  protected override updated(
    changedProperties: Map<string | number | symbol, unknown>,
  ) {
    if (changedProperties.has("hass") && this.hass && !this._hassSet) {
      this._hassSet = true;
      this.loadLocks();
    }
  }

  async loadLocks() {
    try {
      this.locks = await this.hass.connection.sendMessagePromise({
        type: "z2m_lock_manager/get_locks",
      });
      if (this.locks.length > 0 && !this.selectedLock) {
        this.selectedLock = this.locks[0].entity_id;
      }
    } catch (err) {
      console.error("Failed to load locks", err);
    }
  }

  async setCode(
    slot: string,
    name: string,
    code: string,
    enabled: boolean,
    userType: string,
    hasFingerprint: boolean,
    hasRfid: boolean,
    autoRotate: boolean,
    rotateIntervalHours: number,
  ) {
    try {
      await this.hass.connection.sendMessagePromise({
        type: "z2m_lock_manager/set_code",
        entity_id: this.selectedLock,
        slot: parseInt(slot, 10),
        name: name,
        code: code,
        enabled: enabled,
        user_type: userType,
        has_fingerprint: hasFingerprint,
        has_rfid: hasRfid,
        auto_rotate: autoRotate,
        rotate_interval_hours: rotateIntervalHours,
      });
      await this.loadLocks();
    } catch (err) {
      console.error("Failed to set code", err);
    }
  }

  async clearCode(slot: string) {
    try {
      await this.hass.connection.sendMessagePromise({
        type: "z2m_lock_manager/clear_code",
        entity_id: this.selectedLock,
        slot: parseInt(slot, 10),
      });
      await this.loadLocks();
    } catch (err) {
      console.error("Failed to clear code", err);
    }
  }

  private handleLockChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.selectedLock = select.value;
    this.currentPage = 1;
  }

  private async handleSlotSave(e: CustomEvent) {
    const detail = e.detail;
    this.actionState = { slot: detail.slot, type: "saving" };

    await this.setCode(
      detail.slot,
      detail.name,
      detail.code,
      detail.enabled,
      detail.userType,
      detail.hasFingerprint,
      detail.hasRfid,
      detail.autoRotate,
      detail.rotateIntervalHours
    );

    this.actionState = { slot: detail.slot, type: "saved" };
    setTimeout(() => {
      if (this.actionState?.slot === detail.slot && this.actionState?.type === "saved") {
        this.actionState = null;
      }
    }, 2000);
  }

  private async handleSlotClear(e: CustomEvent) {
    const detail = e.detail;
    this.actionState = { slot: detail.slot, type: "clearing" };

    await this.clearCode(detail.slot);

    this.actionState = { slot: detail.slot, type: "cleared" };
    setTimeout(() => {
      if (this.actionState?.slot === detail.slot && this.actionState?.type === "cleared") {
        this.actionState = null;
      }
    }, 2000);
  }

  private handleSlotUpdate(e: CustomEvent) {
    const detail = e.detail;
    const lockIdx = this.locks.findIndex((l) => l.entity_id === this.selectedLock);
    if (lockIdx > -1) {
      if (!this.locks[lockIdx].slots[detail.slot]) {
        this.locks[lockIdx].slots[detail.slot] = {
          name: "",
          code: "",
          enabled: false,
          user_type: "unrestricted",
          auto_rotate: false,
          rotate_interval_hours: 24,
        };
      }
      this.locks[lockIdx].slots[detail.slot] = {
        ...this.locks[lockIdx].slots[detail.slot],
        ...detail.updates
      };
      this.requestUpdate();
    }
  }

  static override styles = panelStyles;

  override render() {
    if (!this.hass || !this.locks.length) {
      return html`<div class="card">${this.t("loading")}</div>`;
    }

    const currentLockData = this.locks.find(
      (l) => l.entity_id === this.selectedLock,
    );

    return html`
      <div class="card">
        <div class="header">${this.t("title")}</div>

        <div class="lock-selector">
          <label>${this.t("select_lock")}</label>
          <select id="lock-select" @change=${this.handleLockChange}>
            ${this.locks.map(
              (lock) => html`
                <option
                  value="${lock.entity_id}"
                  ?selected=${lock.entity_id === this.selectedLock}
                >
                  ${lock.name}
                </option>
              `,
            )}
          </select>
        </div>

        <div class="slot-list">${this.renderSlots(currentLockData)}</div>
        ${this.renderPagination(currentLockData)}
      </div>
    `;
  }

  private renderPagination(currentLockData: LockData | undefined) {
    if (!currentLockData) return html``;
    const maxSlots = currentLockData.max_slots || 10;
    const totalPages = Math.ceil(maxSlots / 10);
    if (totalPages <= 1) return html``;

    return html`
      <div class="pagination">
        <button
          ?disabled=${this.currentPage <= 1}
          @click=${() => {
            this.currentPage--;
          }}
        >
          ← ${this.t("prev_page")}
        </button>
        <span class="page-info">${this.currentPage} / ${totalPages}</span>
        <button
          ?disabled=${this.currentPage >= totalPages}
          @click=${() => {
            this.currentPage++;
          }}
        >
          ${this.t("next_page")} →
        </button>
      </div>
    `;
  }

  private renderSlots(currentLockData: LockData | undefined) {
    if (!currentLockData) {
      return html``;
    }

    const slots = [];
    const maxSlots = currentLockData.max_slots || 10;
    const pageSize = 10;
    const start = (this.currentPage - 1) * pageSize + 1;
    const end = Math.min(this.currentPage * pageSize, maxSlots);
    for (let i = start; i <= end; i++) {
      const slotStr = i.toString();
      const slotData = currentLockData.slots[slotStr] || {
        name: "",
        code: "",
        enabled: false,
        user_type: "unrestricted",
        auto_rotate: false,
        rotate_interval_hours: 24,
      };

      slots.push(html`
        <z2m-lock-slot
          .slotData=${slotData}
          .slotStr=${slotStr}
          .hass=${this.hass}
          .currentTime=${this.currentTime}
          .actionState=${this.actionState}
          @save-slot=${this.handleSlotSave}
          @clear-slot=${this.handleSlotClear}
          @update-slot-data=${this.handleSlotUpdate}
        ></z2m-lock-slot>
      `);
    }
    return slots;
  }
}
