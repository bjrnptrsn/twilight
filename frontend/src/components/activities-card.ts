import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { type ActivityConfig, type InputConfig, type HomeAssistant, type PlaceholderDefaults, type ChannelConfig } from '../lib/types'
import { activityBadgeStyles, cardDotStyles } from '../lib/shared-styles'
import {
  getFallbackActivityInfo,
  formatDuration,
  formatActionCell,
  formatReleaseCell,
  getActivityActionType
} from '../lib/activity-helpers'
import { getInputDisplayName } from '../lib/input-helpers'
import { TwilightLocalizeMixin } from '../lib/i18n'
import './activities-dialog'

@customElement('twilight-activities-card')
export class TwilightActivitiesCard extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ attribute: false }) config: ActivityConfig[] = []
  @property({ attribute: false }) inputs: InputConfig[] = []
  @property({ type: Boolean }) noHeader = false
  @property({ attribute: false }) placeholderDefaults: PlaceholderDefaults | null = null
  @property({ type: Boolean }) templateMode = false
  @property({ attribute: false }) channels: Record<string, ChannelConfig> = {}
  @property({ attribute: false }) heatmapProfiles: { id: string; name: string }[] = []

  static styles = [
    activityBadgeStyles,
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
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
        flex: 1;
      }

      .edit-btn {
        background: none;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 16px;
        padding: 4px 8px;
        border-radius: 4px;
        transition: color 0.15s, background 0.15s;
      }
      .edit-btn:hover {
        color: var(--primary-text-color);
        background: rgba(255, 255, 255, 0.05);
      }

      .entity-list {
        display: flex;
        flex-direction: column;
        padding: 0 0 12px 0;
      }

      .activity-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 20px;
      }

      .activity-desc {
        font-size: 13px;
        color: var(--primary-text-color);
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .divider {
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
        margin: 4px 20px;
      }
    `
  ]

  private _openEdit() {
    this.dispatchEvent(new CustomEvent('open-edit', { bubbles: true, composed: true }))
  }

  render() {
    return html`
      <div class="devices-card">
        ${!this.noHeader ? html`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #a855f7;"></span>
            <span class="devices-card-title" role="heading" aria-level="2">${this.t('activities_card.title')}</span>
            <button class="edit-btn" aria-label=${this.t('common.configure_x', { name: this.t('activities_card.title') })} @click=${this._openEdit}>⋮</button>
          </div>
        ` : ''}

        <div class="entity-list">
          ${this.config.map((act, index) => {
            const fallbacks = getFallbackActivityInfo(this.placeholderDefaults)
            const isReset = act.action?.type === 'reset'

            const lang = this.hass?.locale?.language
            const actionText = formatActionCell(act.action, lang)
            const autoExpireText = act.auto_expire_enabled === false
              ? this.t('common.none')
              : formatDuration(act.auto_expire, fallbacks.auto_expire, lang)
            const releaseText = isReset ? '—' : formatReleaseCell(act.release_action, lang)
            const suppressesText = act.suppress_inputs?.length
              ? act.suppress_inputs.map(id => {
                  const found = this.inputs.find(i => i.id === id)
                  return found ? getInputDisplayName(found, this.hass) : id
                }).join(', ')
              : this.t('common.none')
            const triggeringInputs = (this.inputs || []).filter(i => i.activity === act.id)
            const triggerText = triggeringInputs.length > 0
              ? triggeringInputs.map(i => getInputDisplayName(i, this.hass)).join(', ')
              : this.t('common.none')

            const detailText = isReset
              ? `${this.t('activities_card.triggers')}: ${triggerText} · ${this.t('activities_card.action')}: ${actionText}`
              : `${this.t('activities_card.triggers')}: ${triggerText} · ${this.t('activities_card.action')}: ${actionText} · ${this.t('activities_card.auto_expire')}: ${autoExpireText} · ${this.t('activities_card.release')}: ${releaseText} · ${this.t('activities_card.suppresses')}: ${suppressesText}`

            return html`
              <div class="activity-row">
                <span class="activity-badge ${getActivityActionType(act.id, this.config) ?? 'none'}">${act.name || act.id}</span>
                <div class="activity-desc">
                  <div style="font-weight: 600;">${act.name || act.id}</div>
                  <div style="font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;">
                    ${detailText}
                  </div>
                </div>
              </div>
              ${index < this.config.length - 1 ? html`<div class="divider"></div>` : ''}
            `
          })}
          ${this.config.length === 0 ? html`
            <div style="padding:20px; text-align:center; color: var(--secondary-text-color); font-style:italic;">
              ${this.t('activities_card.no_activities')}
            </div>
          ` : ''}
        </div>
      </div>
    `
  }
}
