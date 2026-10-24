import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import { type RunState, type LabEntity, type AttrEntry } from '../lib/types'
import { isDarkMode } from '../lib/theme-utils'
import { renderLightAttrCell } from '../lib/light-cells'
import { cardDotStyles } from '../lib/shared-styles'
import { TwilightLocalizeMixin } from '../lib/i18n'
import './area-lights-dialog'

interface TableRow {
  entity_id: string
  name: string
  actual_on: boolean | null
  on: AttrEntry | null
  brightness: AttrEntry | null
  color: AttrEntry | null
}

@customElement('twilight-area-lights-card')
export class TwilightAreaLightsCard extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: String }) activeSceneName = 'No Scene Active'
  @property({ type: Boolean }) noHeader = false
  @property({ attribute: false }) runState: RunState | null = null
  @property({ type: Array }) entities: (LabEntity & { isExtracted?: boolean; isManual?: boolean })[] = []
  @property({ type: Boolean }) manualOnly = false

  @state() private _isDark = false

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('hass')) {
      this._isDark = isDarkMode(this.hass, this)
    }
  }

  static styles = [
    cardDotStyles,
    css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      font-family: var(--font-family, inherit);
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
      overflow: clip;
    }

    .devices-card {
      box-sizing: border-box;
      background: transparent;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .devices-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 12px;
    }

    .devices-card-title {
      flex: 1;
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
    }

    .active-scene-wrap {
      display: flex;
      align-items: baseline;
      gap: 4px;
      font-size: 11px;
      font-weight: 500;
      max-width: 250px;
      white-space: nowrap;
      margin-right: 8px;
      line-height: 1;
    }

    .active-scene-label {
      color: var(--secondary-text-color);
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.5px;
    }

    .active-scene-value {
      color: var(--primary-text-color);
      font-size: 12px;
      font-weight: 700;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .edit-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.6;
      transition: opacity 0.15s, background 0.15s;
      font-size: 16px;
      line-height: 1;
    }
    .edit-btn:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      color: var(--primary-text-color);
      opacity: 1;
    }

    .entity-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--primary-text-color) 15%, transparent);
      flex-shrink: 0;
      box-shadow: 0 0 5px var(--dot-glow, transparent);
    }

    .table-container {
      padding: 0 20px 16px;
    }

    .lights-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      text-align: left;
    }
    .lights-table th {
      padding: 8px 16px;
      color: var(--secondary-text-color);
      font-weight: 700;
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.8px;
    }
    .lights-table td {
      padding: 10px 16px;
      vertical-align: middle;
    }
    .lights-table th:first-child,
    .lights-table td:first-child {
      padding-left: 0;
    }
    .lights-table th:last-child,
    .lights-table td:last-child {
      padding-right: 0;
    }

    .section-row td {
      padding: 14px 0 6px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--secondary-text-color);
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
      opacity: 0.8;
    }

    @media (max-width: 480px) {
      .table-container {
        padding: 0 8px;
      }
      .lights-table th, .lights-table td {
        padding: 8px 4px;
      }
      .lights-table-name {
        font-size: 11px;
      }
      .lights-table-id {
        font-size: 9px;
      }
      .mismatch-badge {
        font-size: 8px;
        padding: 1px 4px;
      }
    }

    .lights-table-entity {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .lights-table-name {
      font-weight: 600;
      font-size: 12px;
      color: var(--primary-text-color);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .lights-table-id {
      font-size: 10px;
      font-weight: 200;
      color: var(--secondary-text-color);
      font-family: monospace;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .mismatch-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
      display: inline-block;
      background: rgba(255, 152, 0, 0.08);
      border: 1px solid rgba(255, 152, 0, 0.3);
      color: #b25e00;
    }

    @media (prefers-color-scheme: dark) {
      .mismatch-badge:not(.light) {
        background: rgba(255, 152, 0, 0.22);
        border: 1px solid rgba(255, 152, 0, 0.7);
        color: var(--warning-color, #ff9800);
      }
    }

    .mismatch-badge.dark {
      background: rgba(255, 152, 0, 0.22);
      border: 1px solid rgba(255, 152, 0, 0.7);
      color: var(--warning-color, #ff9800);
    }

    .mismatch-badge.light {
      background: rgba(255, 152, 0, 0.08);
      border: 1px solid rgba(255, 152, 0, 0.3);
      color: #b25e00;
    }

    .manual-off-badge {
      font-size: 9px;
      font-weight: 700;
      padding: 1px 5px;
      border-radius: 4px;
      white-space: nowrap;
      display: inline-block;
      flex-shrink: 0;
      background: rgba(96, 125, 139, 0.1);
      border: 1px solid rgba(96, 125, 139, 0.35);
      color: #546e7a;
    }

    .manual-off-badge.dark {
      background: rgba(96, 125, 139, 0.22);
      border: 1px solid rgba(96, 125, 139, 0.7);
      color: var(--secondary-text-color, #b0bec5);
    }

    @media (prefers-color-scheme: dark) {
      .manual-off-badge:not(.light) {
        background: rgba(96, 125, 139, 0.22);
        border: 1px solid rgba(96, 125, 139, 0.7);
        color: var(--secondary-text-color, #b0bec5);
      }
    }

    .divider {
      height: 1px;
      background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
      margin: 8px 0;
    }
  `]

  private _toggleManualOnly(e: CustomEvent) {
    this.manualOnly = e.detail.manualOnly
    this.dispatchEvent(new CustomEvent('mode-changed', {
      detail: { manualOnly: this.manualOnly },
      bubbles: true,
      composed: true
    }))
  }

  private _onLightsChanged(e: CustomEvent) {
    this.entities = e.detail.entities
    this.dispatchEvent(new CustomEvent('lights-changed', {
      detail: { entities: this.entities },
      bubbles: true,
      composed: true
    }))
  }

  render() {
    const lightStates = this.runState?.light_states ?? {}
    const badge = this._isDark ? 'dark' : 'light'
    const manualOff = new Set(this.runState?.manual_off_entities ?? [])

    // Separate entities list into extracted & manual for rendering
    // Fallback: If no engine running (no runState.light_states), build table items directly from entities list
    const hasLiveState = Object.keys(lightStates).length > 0

    let sceneRows: TableRow[] = []
    let manualRows: TableRow[] = []

    if (hasLiveState) {
      // Group the active engine entities
      Object.keys(lightStates).forEach(entityId => {
        const stateEntry = lightStates[entityId]
        const matchingEntity = this.entities.find(e => e.entity_id === entityId)
        const isExtracted = matchingEntity ? !!matchingEntity.isExtracted : true // assume scene if not found
        const isManual = matchingEntity ? !!matchingEntity.isManual : false

        const rowItem = {
          entity_id: entityId,
          name: stateEntry.name || matchingEntity?.name || entityId,
          actual_on: stateEntry.actual_on,
          on: stateEntry.on,
          brightness: stateEntry.brightness,
          color: stateEntry.color
        }

        if (isExtracted) {
          sceneRows.push(rowItem)
        } else if (isManual) {
          manualRows.push(rowItem)
        } else {
          // If neither flag matches explicitly, default to scene
          sceneRows.push(rowItem)
        }
      })
    } else {
      // Fallback Draft Mode: map configured frontend entities
      this.entities.forEach(e => {
        const isManual = !!e.isManual
        const isExtracted = !!e.isExtracted

        // Skip non-checked entities if they're not extracted (we only want scene or manual list)
        if (!isManual && !isExtracted) return

        const rowItem = {
          entity_id: e.entity_id,
          name: e.name || e.entity_id,
          actual_on: null,
          on: null,
          brightness: null,
          color: null
        }

        if (isExtracted) {
          sceneRows.push(rowItem)
        } else {
          manualRows.push(rowItem)
        }
      })
    }

    const totalRows = sceneRows.length + manualRows.length

    return html`
      <div class="devices-card">
        ${!this.noHeader ? html`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #eab308;"></span>
            <span class="devices-card-title" role="heading" aria-level="2">${this.t('area_lights_card.title')}</span>
            <div class="active-scene-wrap">
              <span class="active-scene-label">${this.t('area_lights_card.active_scene')}</span>
              <span class="active-scene-value">${this.activeSceneName}</span>
            </div>
            <button class="edit-btn" @click=${() => { this.dispatchEvent(new CustomEvent('open-edit', { bubbles: true, composed: true })) }} title=${this.t('area_lights_card.configure_lights')}>⋮</button>
          </div>
        ` : ''}

        <div class="table-container">
          ${totalRows === 0
            ? html`<div style="padding: 12px 0; font-size: 13px; color: var(--secondary-text-color); font-style: italic;">${this.t('area_lights_card.no_lights_configured')}</div>`
            : html`
                <table class="lights-table">
                  <thead>
                    <tr>
                      <th style="width: 45%;">${this.t('area_lights_card.light_switch')}</th>
                      <th style="width: 15%; text-align: center;">${this.t('scene_lights_card.status')}</th>
                      <th style="width: 20%; text-align: center;">${this.t('scene_lights_card.brightness')}</th>
                      <th style="width: 20%; text-align: center;">${this.t('scene_lights_card.color')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sceneRows.length > 0 ? html`
                      <tr class="section-row">
                        <td colspan="4">${this.t('area_lights_card.scene_lights_extracted')}</td>
                      </tr>
                      ${sceneRows.map(row => this._renderTableRow(row, badge, manualOff))}
                    ` : ''}

                    ${manualRows.length > 0 ? html`
                      <tr class="section-row">
                        <td colspan="4">${this.t('area_lights_card.additional_entities_manual')}</td>
                      </tr>
                      ${manualRows.map(row => this._renderTableRow(row, badge, manualOff))}
                    ` : ''}
                  </tbody>
                </table>
              `
          }
        </div>
      </div>
    `
  }

  private _renderTableRow(row: TableRow, badge: string, manualOff: Set<string>) {
    const dotColor = row.actual_on
      ? 'var(--success-color, #4caf50)'
      : 'color-mix(in srgb, var(--primary-text-color) 15%, transparent)'

    return html`
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="entity-indicator"
              style="background:${dotColor}; margin:0; --dot-glow:${row.actual_on ? 'rgba(76,175,80,0.5)' : 'transparent'}"
              title="${row.entity_id}"></div>
            <div class="lights-table-entity">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="lights-table-name" title="${row.name}">${row.name}</span>
                ${manualOff.has(row.entity_id) ? html`<span class="manual-off-badge ${badge}">${this.t('area_lights_card.manual_off')}</span>` : ''}
              </div>
              <span class="lights-table-id" title="${row.entity_id}">${row.entity_id}</span>
            </div>
          </div>
        </td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${renderLightAttrCell(row.on, badge)}</td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${renderLightAttrCell(row.brightness, badge)}</td>
        <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${renderLightAttrCell(row.color, badge)}</td>
      </tr>
    `
  }
}
