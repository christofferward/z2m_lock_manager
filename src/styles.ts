import { css } from "lit";

export const panelStyles = css`
  :host {
    display: block;
    background-color: var(--primary-background-color);
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    min-height: 100vh;
  }


  /* Header */
  .header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    background-color: var(
      --app-header-background-color,
      var(--primary-background-color)
    );
    color: var(--app-header-text-color, var(--primary-text-color));
  }
  ha-menu-button {
    color: var(--app-header-text-color, var(--primary-text-color));
  }
  .title {
    font-size: 20px;
    font-weight: 500;
  }


  /* Content */
  .content {
    padding: 16px;
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }


  /* Tabs */
  .lock-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .lock-tab {
    padding: 8px 18px;
    border-radius: 20px;
    border: 1px solid var(--divider-color);
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition:
      background 0.15s,
      border-color 0.15s,
      color 0.15s;
  }
  .lock-tab:hover {
    background: var(--secondary-background-color);
  }
  .lock-tab.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: #fff;
  }


  .section-title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    margin-bottom: 12px;
  }


  .overview-card {
    background: var(--card-background-color);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(
      --ha-card-box-shadow,
      0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px rgba(0, 0, 0, 0.14),
      0 1px 3px rgba(0, 0, 0, 0.12)
    );
    padding: 16px 20px 20px;
  }


  /* Grid & Chips */
  .slot-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
  }
  @media (max-width: 500px) {
    .slot-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (min-width: 501px) and (max-width: 700px) {
    .slot-grid { grid-template-columns: repeat(4, 1fr); }
  }
  .slot-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 6px;
    height: 100px;
    box-sizing: border-box;
    border-radius: 12px;
    border: 2px solid transparent;
    background: var(--card-background-color);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.2),
      0 1px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    user-select: none;
    transition:
      transform 0.12s ease,
      box-shadow 0.12s ease,
      border-color 0.15s;
    text-align: center;
  }
  .slot-chip:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  }
  .slot-chip:active {
    transform: scale(0.97);
  }

  /* Selected highlight */
  .slot-chip.selected {
    border-color: var(--primary-color);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--primary-color) 30%, transparent),
      0 4px 14px rgba(0, 0, 0, 0.2);
  }

  /* State colours — active */
  .slot-chip.state-active {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, #43a047 20%, var(--card-background-color)),
      color-mix(in srgb, #2e7d32 10%, var(--card-background-color))
    );
  }
  .slot-chip.state-active .slot-chip-icon {
    color: #4caf50;
  }

  /* State colours — guest / auto-rotate */
  .slot-chip.state-guest {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, #039be5 20%, var(--card-background-color)),
      color-mix(in srgb, #0277bd 10%, var(--card-background-color))
    );
  }
  .slot-chip.state-guest .slot-chip-icon {
    color: #29b6f6;
  }

  /* State colours — disabled (inactive but configured) */
  .slot-chip.state-disabled {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, #e53935 15%, var(--card-background-color)),
      color-mix(in srgb, #c62828 8%, var(--card-background-color))
    );
  }
  .slot-chip.state-disabled .slot-chip-icon {
    color: #ef5350;
  }

  /* State colours — empty */
  .slot-chip.state-empty {
    background: color-mix(in srgb, white 12%, var(--card-background-color));
  }
  .slot-chip.state-empty .slot-chip-icon {
    color: var(--disabled-text-color, #9e9e9e);
  }
  .slot-chip.state-empty .slot-chip-number {
    color: var(--disabled-text-color, #9e9e9e);
  }
  .slot-chip.state-empty .slot-chip-name {
    color: var(--disabled-text-color, #9e9e9e);
  }

  .slot-chip-number {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .slot-chip-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }
  .slot-chip-name {
    font-size: 11px;
    font-weight: 600;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 82px;
  }


  /* Slot Details */
  .detail-card {
    background: var(--card-background-color);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(
      --ha-card-box-shadow,
      0 2px 1px -1px rgba(0, 0, 0, 0.2),
      0 1px 1px rgba(0, 0, 0, 0.14),
      0 1px 3px rgba(0, 0, 0, 0.12)
    );
    padding: 20px;
    animation: slideIn 0.15s ease;
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .detail-title {
    font-size: 16px;
    font-weight: 600;
  }
  .detail-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: var(--secondary-text-color);
    padding: 2px 6px;
    border-radius: 4px;
    line-height: 1;
  }
  .detail-close:hover {
    background: var(--secondary-background-color);
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
  }
  .detail-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--divider-color);
    margin-top: 4px;
  }
  .toggles-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    grid-column: 1 / -1;
  }
  .actions-row {
    display: flex;
    gap: 8px;
    grid-column: 1 / -1;
    justify-content: flex-start;
    margin-top: 4px;
  }


  .empty-state {
    text-align: center;
    padding: 40px;
    color: var(--secondary-text-color);
  }


  /* Pagination */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding-top: 14px;
    margin-top: 4px;
    border-top: 1px solid var(--divider-color);
  }
  .page-btn {
    padding: 0 14px;
    height: 32px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font-size: 16px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .page-btn:hover:not(:disabled) {
    background: var(--secondary-background-color);
  }
  .page-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
  .page-info {
    font-size: 13px;
    color: var(--secondary-text-color);
    min-width: 80px;
    text-align: center;
  }
`;

export const slotStyles = css`
  :host {
    display: contents;
  }


  /* Form elements */
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .input-group label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  input[type="text"],
  input[type="password"],
  input[type="number"],
  select {
    padding: 6px 8px;
    font-size: 14px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--secondary-background-color, var(--card-background-color));
    color: var(--primary-text-color);
    width: 100%;
    box-sizing: border-box;
    height: 36px;
    transition: border-color 0.15s;
  }
  input:focus,
  select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px
      color-mix(in srgb, var(--primary-color) 20%, transparent);
  }
  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  select {
    padding-right: 4px;
  }


  .code-wrapper {
    display: flex;
    gap: 4px;
    align-items: center;
  }
  .code-wrapper input {
    flex: 1;
  }
  .btn-icon {
    flex-shrink: 0;
    height: 36px;
    padding: 0 10px;
    background: var(--secondary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
  }
  .btn-icon:hover {
    background: var(--divider-color);
  }


  /* Toggles */
  .slot-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    cursor: pointer;
    font-size: 14px;
    color: var(--primary-text-color);
    user-select: none;
  }
  ha-switch {
    --switch-checked-button-color: var(--primary-color);
    --switch-checked-track-color: var(--primary-color);
  }
  ha-switch:not(:defined) {
    display: inline-block;
    width: 38px;
    height: 20px;
    background: #555;
    border-radius: 10px;
    position: relative;
  }
  ha-switch:not(:defined)::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
  }
  input[type="checkbox"] {
    accent-color: var(--primary-color);
    width: 15px;
    height: 15px;
    cursor: pointer;
  }

  .toggles-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    grid-column: 1 / -1;
  }

  .toggle-divider {
    width: 1px;
    height: 24px;
    background-color: var(--divider-color);
    margin: 0 4px;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    .toggle-divider {
      display: none;
    }
  }

  .actions-row {
    display: flex;
    gap: 12px;
    grid-column: 1 / -1;
    justify-content: flex-start;
    margin-top: 12px;
  }


  .rotate-info {
    font-size: 12px;
    color: var(--secondary-text-color);
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 3px;
  }
  .dot {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dot-green {
    background: var(--success-color, #43a047);
  }
  .dot-red {
    background: var(--error-color, #e53935);
  }


  /* Buttons */
  .btn {
    padding: 0 24px;
    height: 36px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    transition:
      opacity 0.15s,
      filter 0.15s;
    white-space: nowrap;
    width: auto;
    min-width: 100px;
  }
  .btn:hover {
    filter: brightness(1.08);
  }
  .btn:active {
    opacity: 0.85;
  }
  .btn-save {
    background: var(--primary-color);
    color: #fff;
  }
  .btn-clear {
    background: var(--error-color, #e53935);
    color: #fff;
  }
`;
