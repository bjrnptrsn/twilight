import { css } from 'lit'

export const activityBadgeStyles = css`
  .activity-badge {
    font-size: 11px;
    font-weight: 600;
    border-radius: 12px;
    padding: 2px 10px;
    text-transform: capitalize;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    box-sizing: border-box;
  }
  .activity-badge.slot {
    background: rgba(25, 118, 210, 0.9);
    border: 1px solid rgba(25, 118, 210, 0.95);
    color: #fff;
  }
  .activity-badge.entity {
    background: rgba(142, 36, 170, 0.9);
    border: 1px solid rgba(142, 36, 170, 0.95);
    color: #fff;
  }
  .activity-badge.light {
    background: rgba(230, 160, 0, 0.9);
    border: 1px solid rgba(230, 160, 0, 0.95);
    color: #fff;
  }
  .activity-badge.none {
    background: rgba(96, 112, 120, 0.9);
    border: 1px solid rgba(96, 112, 120, 0.95);
    color: #fff;
  }
  .activity-badge.reset {
    background: rgba(211, 47, 47, 0.9);
    border: 1px solid rgba(211, 47, 47, 0.95);
    color: #fff;
  }
  .activity-badge.rule {
    background: rgba(230, 160, 0, 0.9);
    border: 1px solid rgba(230, 160, 0, 0.95);
    color: #fff;
    border-radius: 4px;
  }
  .activity-badge.simulation {
    background: rgba(0, 121, 107, 0.9);
    border: 1px solid rgba(0, 121, 107, 0.95);
    color: #fff;
  }
  .activity-badge.block {
    background: rgba(79, 70, 229, 0.9);
    border: 1px solid rgba(79, 70, 229, 0.95);
    color: #fff;
  }
  .activity-badge.turn_off {
    background: rgba(220, 38, 38, 0.9);
    border: 1px solid rgba(220, 38, 38, 0.95);
    color: #fff;
  }
`

export const cardDotStyles = css`
  .card-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--dot-color, var(--accent-color, #3b82f6));
    box-shadow: 0 0 6px var(--dot-color, var(--accent-color, #3b82f6));
    flex-shrink: 0;
    display: inline-block;
  }
`

export const hostResetStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: hidden;
    box-sizing: border-box;
    font-family: var(--font-family, inherit);
  }
`

export const viewHeaderStyles = css`
  .view-header-container {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    min-height: 64px;
    padding: 12px 24px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, var(--primary-text-color, #fff) 20%, transparent) transparent;
  }
  .view-header-container::-webkit-scrollbar {
    height: 4px;
  }
  .view-header-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .view-header-container::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--primary-text-color, #fff) 20%, transparent);
    border-radius: 4px;
  }
  .view-header-container::-webkit-scrollbar-thumb:hover {
    background: color-mix(in srgb, var(--primary-text-color, #fff) 40%, transparent);
  }
  .view-header-container > * {
    min-width: max-content;
  }
`

export const detailFooterStyles = css`
  .detail-footer {
    position: sticky;
    bottom: 0;
    background: rgba(255, 255, 255, 0.03);
    border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    z-index: 10;
    flex-shrink: 0;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  }
  .save-status {
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  .btn-cancel {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: var(--secondary-text-color);
    cursor: pointer;
    padding: 8px 20px;
    font-size: 14px;
    transition: background 0.15s, color 0.15s;
  }
  .btn-cancel:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--primary-text-color);
  }
  .btn-save {
    background: var(--tp-accent, var(--accent-color, #e91e8c));
    color: white;
    border: none;
    padding: 8px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .btn-save:hover {
    opacity: 0.85;
  }
  .btn-save:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const dialogChromeStyles = css`
  .overlay {
    position: fixed;
    inset: 0;
    background: var(--dialog-backdrop-color, rgba(0, 0, 0, 0.6));
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
  }
  .edit-panel, .modal-card {
    background: var(--primary-background-color, #14141f);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-radius: 16px;
    border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 12%, transparent));
    width: 95vw;
    max-width: 1150px;
    max-height: calc(100vh - 96px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: var(--ha-card-box-shadow, 0 24px 64px rgba(0, 0, 0, 0.5));
    box-sizing: border-box;
  }
  /* Content-driven width for table/list panels: grows with the widest row,
     never below min-width, never wider than the viewport allows. */
  .edit-panel.list-panel {
    width: fit-content;
    min-width: min(750px, 95vw);
    max-width: 95vw;
  }
  .panel-header, .modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    background: var(--secondary-background-color, #1c1a26);
    border-bottom: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
    flex-shrink: 0;
    box-sizing: border-box;
  }
  .panel-header-icon {
    font-size: 20px;
    opacity: 0.7;
  }
  .card-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--dot-color, var(--accent-color, #3b82f6));
    box-shadow: 0 0 6px var(--dot-color, var(--accent-color, #3b82f6));
    flex-shrink: 0;
    display: inline-block;
  }

  /* Unified Configuration Table Styles */
  .config-table {
    width: 100%;
    border-collapse: collapse;
  }
  .config-table th {
    text-align: left;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--secondary-text-color);
    padding: 6px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .config-table td {
    padding: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    vertical-align: middle;
    font-size: 13px;
  }
  .config-table tr:hover {
    background: rgba(255, 255, 255, 0.015);
  }
  .config-table tr.dragging {
    opacity: 0.4;
    background: rgba(255, 255, 255, 0.08);
  }
  .config-table .drag-handle {
    cursor: grab;
    user-select: none;
    color: var(--secondary-text-color);
    opacity: 0.4;
    font-size: 15px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    transition: opacity 0.15s, color 0.15s;
  }
  .config-table .drag-handle:hover {
    opacity: 1;
    color: var(--primary-text-color);
  }
  .panel-header-title, .modal-title {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-text-color);
    margin: 0;
  }
  .panel-close {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--secondary-text-color);
    font-size: 22px;
    line-height: 1;
    padding: 4px 8px;
    border-radius: 6px;
    box-sizing: border-box;
  }
  .panel-close:hover {
    background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    color: var(--primary-text-color);
  }
  .panel-body, .modal-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
  }
  .panel-footer, .modal-footer {
    padding: 16px 24px;
    background: var(--secondary-background-color, #1c1a26);
    border-top: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    flex-shrink: 0;
    box-sizing: border-box;
  }
  .btn-cancel-dialog {
    background: transparent;
    border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 12%, transparent));
    border-radius: 8px;
    color: var(--secondary-text-color);
    cursor: pointer;
    padding: 10px 24px;
    font-size: 13px;
    font-weight: 600;
    transition: background 0.15s, color 0.15s;
    box-sizing: border-box;
  }
  .btn-cancel-dialog:hover {
    background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    color: var(--primary-text-color);
  }
  .btn-save-dialog {
    background: var(--tp-accent, var(--accent-color, #e91e8c));
    color: white;
    border: none;
    padding: 10px 28px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
    box-sizing: border-box;
  }
  .btn-save-dialog:hover {
    opacity: 0.85;
  }
  .btn-save-dialog:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`
