import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import { type RunState } from '../lib/types'
import { isDarkMode } from '../lib/theme-utils'
import { renderLightAttrCell } from '../lib/light-cells'
import { cardDotStyles } from '../lib/shared-styles'
import { TwilightLocalizeMixin } from '../lib/i18n'

@customElement('twilight-scene-lights-card')
export class TwilightSceneLightsCard extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: String }) activeSceneName = 'No Scene Active'
  @property({ type: Boolean }) noHeader = false
  @property({ attribute: false }) runState: RunState | null = null

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
    }

    .devices-card {
      border: var(--dev-border, none);
      border-radius: 2px;
      box-sizing: border-box;
      background: transparent;
      overflow: hidden;
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
      align-self: flex-end;
      margin-bottom: 0px;
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

    .entity-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success-color, #4caf50);
      flex-shrink: 0;
      box-shadow: 0 0 5px var(--dot-glow, transparent);
    }

    .table-container {
      padding: 0 20px;
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
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 15%, transparent);
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.5px;
    }
    .lights-table td {
      padding: 10px 16px;
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
      vertical-align: middle;
    }
    .lights-table tr:last-child td {
      border-bottom: none;
    }
    .lights-table th:first-child,
    .lights-table td:first-child {
      padding-left: 0;
    }
    .lights-table th:last-child,
    .lights-table td:last-child {
      padding-right: 0;
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
  `]

  // -------------------------------------------------------------------------
  // Render — pure presentation. Every value (labels, swatches, deviation flags,
  // name, dot state) comes ready-made from the backend's light_states map.
  // No hass.states access, no formatting, no comparison.
  // -------------------------------------------------------------------------

  render() {
    const lightStates = this.runState?.light_states ?? {}
    const entityIds = Object.keys(lightStates)
    const badge = this._isDark ? 'dark' : 'light'

    return html`
      <div class="devices-card">
        ${!this.noHeader ? html`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #eab308;"></span>
            <span class="devices-card-title" role="heading" aria-level="2">${this.t('scene_lights_card.scene_lights_check')}</span>
            <div class="active-scene-wrap">
              <span class="active-scene-label">${this.t('scene_lights_card.active_scene')}:</span>
              <span class="active-scene-value">${this.activeSceneName}</span>
            </div>
          </div>
        ` : ''}
        <div class="table-container">
          ${entityIds.length === 0
            ? html`<div style="padding: 12px 0; font-size: 13px; color: var(--secondary-text-color); font-style: italic;">${this.t('scene_lights_card.no_lights')}</div>`
            : html`
                <table class="lights-table">
                  <thead>
                    <tr>
                      <th style="width: 45%;">${this.t('scene_lights_card.light')}</th>
                      <th style="width: 15%; text-align: center;">${this.t('scene_lights_card.status')}</th>
                      <th style="width: 20%; text-align: center;">${this.t('scene_lights_card.brightness')}</th>
                      <th style="width: 20%; text-align: center;">${this.t('scene_lights_card.color')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${entityIds.map(entityId => {
                      const entry = lightStates[entityId]
                      const dotColor = entry.actual_on
                        ? 'var(--success-color, #4caf50)'
                        : 'color-mix(in srgb, var(--primary-text-color) 15%, transparent)'

                      return html`
                        <tr>
                          <td>
                            <div style="display: flex; align-items: center; gap: 8px;">
                              <div class="entity-indicator"
                                style="background:${dotColor}; margin:0; --dot-glow:${entry.actual_on ? 'rgba(76,175,80,0.5)' : 'transparent'}"
                                title="${entityId}"></div>
                              <div class="lights-table-entity">
                                <span class="lights-table-name" title="${entry.name}">${entry.name}</span>
                                <span class="lights-table-id" title="${entityId}">${entityId}</span>
                              </div>
                            </div>
                          </td>
                          <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${renderLightAttrCell(entry.on, badge)}</td>
                          <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${renderLightAttrCell(entry.brightness, badge)}</td>
                          <td style="text-align: center; font-weight: 500; vertical-align: top; padding-top: 10px;">${renderLightAttrCell(entry.color, badge)}</td>
                        </tr>
                      `
                    })}
                  </tbody>
                </table>
              `
          }
        </div>
      </div>
    `
  }
}
