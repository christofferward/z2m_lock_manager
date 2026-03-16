var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { TRANSLATIONS } from "./translations";
import { panelStyles } from "./styles";
import "./z2m_lock_slot";
let Z2MLockManagerPanel = class Z2MLockManagerPanel extends LitElement {
    constructor() {
        super(...arguments);
        this.locks = [];
        this.selectedLock = null;
        this.actionState = null;
        this.currentPage = 1;
        this.currentTime = new Date();
        this._timerInterval = null;
        this._hassSet = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this._timerInterval = window.setInterval(() => {
            this.currentTime = new Date();
        }, 60000);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._timerInterval !== null) {
            window.clearInterval(this._timerInterval);
        }
    }
    calculateTimeRemaining(lastRotated, intervalHours) {
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
    t(key) {
        const lang = this.hass?.language || "en";
        const dict = TRANSLATIONS[lang] || TRANSLATIONS["en"];
        return dict[key] || TRANSLATIONS["en"][key] || key;
    }
    updated(changedProperties) {
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
        }
        catch (err) {
            console.error("Failed to load locks", err);
        }
    }
    async setCode(slot, name, code, enabled, userType, hasFingerprint, hasRfid, autoRotate, rotateIntervalHours) {
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
        }
        catch (err) {
            console.error("Failed to set code", err);
        }
    }
    async clearCode(slot) {
        try {
            await this.hass.connection.sendMessagePromise({
                type: "z2m_lock_manager/clear_code",
                entity_id: this.selectedLock,
                slot: parseInt(slot, 10),
            });
            await this.loadLocks();
        }
        catch (err) {
            console.error("Failed to clear code", err);
        }
    }
    handleLockChange(e) {
        const select = e.target;
        this.selectedLock = select.value;
        this.currentPage = 1;
    }
    async handleSlotSave(e) {
        const detail = e.detail;
        this.actionState = { slot: detail.slot, type: "saving" };
        await this.setCode(detail.slot, detail.name, detail.code, detail.enabled, detail.userType, detail.hasFingerprint, detail.hasRfid, detail.autoRotate, detail.rotateIntervalHours);
        this.actionState = { slot: detail.slot, type: "saved" };
        setTimeout(() => {
            if (this.actionState?.slot === detail.slot && this.actionState?.type === "saved") {
                this.actionState = null;
            }
        }, 2000);
    }
    async handleSlotClear(e) {
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
    handleSlotUpdate(e) {
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
    static { this.styles = panelStyles; }
    render() {
        if (!this.hass || !this.locks.length) {
            return html `<div class="card">${this.t("loading")}</div>`;
        }
        const currentLockData = this.locks.find((l) => l.entity_id === this.selectedLock);
        return html `
      <div class="card">
        <div class="header">${this.t("title")}</div>

        <div class="lock-selector">
          <label>${this.t("select_lock")}</label>
          <select id="lock-select" @change=${this.handleLockChange}>
            ${this.locks.map((lock) => html `
                <option
                  value="${lock.entity_id}"
                  ?selected=${lock.entity_id === this.selectedLock}
                >
                  ${lock.name}
                </option>
              `)}
          </select>
        </div>

        <div class="slot-list">${this.renderSlots(currentLockData)}</div>
        ${this.renderPagination(currentLockData)}
      </div>
    `;
    }
    renderPagination(currentLockData) {
        if (!currentLockData)
            return html ``;
        const maxSlots = currentLockData.max_slots || 10;
        const totalPages = Math.ceil(maxSlots / 10);
        if (totalPages <= 1)
            return html ``;
        return html `
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
    renderSlots(currentLockData) {
        if (!currentLockData) {
            return html ``;
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
            slots.push(html `
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
};
__decorate([
    property({ attribute: false })
], Z2MLockManagerPanel.prototype, "hass", void 0);
__decorate([
    state()
], Z2MLockManagerPanel.prototype, "locks", void 0);
__decorate([
    state()
], Z2MLockManagerPanel.prototype, "selectedLock", void 0);
__decorate([
    state()
], Z2MLockManagerPanel.prototype, "actionState", void 0);
__decorate([
    state()
], Z2MLockManagerPanel.prototype, "currentPage", void 0);
__decorate([
    state()
], Z2MLockManagerPanel.prototype, "currentTime", void 0);
Z2MLockManagerPanel = __decorate([
    customElement("z2m-lock-manager-panel")
], Z2MLockManagerPanel);
export { Z2MLockManagerPanel };
//# sourceMappingURL=z2m_lock_manager_panel.js.map