import { css } from "lit";
export const panelStyles = css `
  :host {
    display: block;
    padding: 16px;
    background-color: var(--primary-background-color);
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  .card {
    background: var(--card-background-color, #fff);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(
      --ha-card-box-shadow,
      0px 2px 1px -1px rgba(0, 0, 0, 0.2),
      0px 1px 1px 0px rgba(0, 0, 0, 0.14),
      0px 1px 3px 0px rgba(0, 0, 0, 0.12)
    );
    padding: 16px;
    max-width: 900px;
    margin: 0 auto;
  }
  .header {
    font-size: 24px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--divider-color);
    padding-bottom: 8px;
  }
  .lock-selector {
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .lock-selector select {
    padding: 10px 12px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid var(--divider-color);
    background-color: var(--card-background-color);
    color: var(--primary-text-color);
    width: 100%;
    max-width: 400px;
    min-height: 44px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .slot-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    padding: 12px 0 4px;
  }
  .pagination button {
    padding: 6px 14px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background-color: var(--card-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
  }
  .pagination button:hover:not(:disabled) {
    background-color: var(--divider-color);
  }
  .pagination button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .pagination .page-info {
    font-size: 13px;
    color: var(--secondary-text-color);
  }
`;
export const slotStyles = css `
  :host { display: block; }
  .slot-accordion {
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    background-color: var(--secondary-background-color, transparent);
    overflow: hidden;
  }
  .slot-accordion summary {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    cursor: pointer;
    list-style: none;
    user-select: none;
    font-size: 14px;
  }
  .slot-accordion summary::-webkit-details-marker {
    display: none;
  }
  .slot-accordion summary::before {
    content: "▸";
    font-size: 14px;
    color: var(--secondary-text-color);
    transition: transform 0.15s ease;
    flex-shrink: 0;
  }
  .slot-accordion[open] summary::before {
    transform: rotate(90deg);
  }
  .slot-accordion summary:hover {
    background-color: var(--divider-color);
  }
  .slot-summary-title {
    font-weight: 500;
    color: var(--primary-color);
    min-width: 52px;
  }
  .slot-summary-name {
    color: var(--primary-text-color);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .slot-summary-badges {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-shrink: 0;
  }
  .badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 500;
    white-space: nowrap;
  }
  .badge-enabled {
    background-color: rgba(67, 160, 71, 0.15);
    color: var(--success-color, #43a047);
  }
  .badge-disabled {
    background-color: rgba(158, 158, 158, 0.15);
    color: var(--secondary-text-color);
  }
  .badge-guest {
    background-color: rgba(3, 169, 244, 0.15);
    color: var(--primary-color, #03a9f4);
  }
  .slot-accordion-body {
    padding: 10px 16px 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .slot-main-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    align-items: flex-start;
  }
  .slot-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 4px;
  }
  .toggles-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }
  .slot-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: normal;
    font-size: 13px;
  }
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .input-group label {
    font-size: 12px;
    color: var(--secondary-text-color);
    font-weight: 500;
    text-transform: uppercase;
  }
  input[type="text"],
  input[type="password"],
  input[type="number"],
  select {
    padding: 4px 6px;
    font-size: 13px;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    background-color: var(--card-background-color);
    color: var(--primary-text-color);
    width: 100%;
    box-sizing: border-box;
    height: 32px;
  }
  select {
    padding-right: 2px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  input:focus,
  select:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: -1px;
  }
  .code-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .code-wrapper input {
    flex: 1;
  }
  .btn-toggle {
    background: var(--secondary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    cursor: pointer;
    padding: 0 10px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
  }
  .btn-toggle:hover {
    background: var(--divider-color);
  }
  .slot-actions {
    display: flex;
    gap: 8px;
    margin: 0;
    justify-content: flex-end;
  }
  .btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    color: white;
    height: 32px;
    font-size: 13px;
  }
  .btn-save {
    background-color: var(--primary-color);
    margin-right: 8px;
  }
  .btn-clear {
    background-color: var(--error-color, #db4437);
  }
`;
//# sourceMappingURL=styles.js.map