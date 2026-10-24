import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { type HomeAssistant, type InputConfig, type RunState, type ActivityConfig, type RuleConfig, type PlaceholderDefaults } from '../lib/types'
import * as api from '../lib/api'
import { activityBadgeStyles, cardDotStyles } from '../lib/shared-styles'
import { getResolvedMotionInfo, getDisablerText, getEntityDisplay, formatMotionInfo, getInputDisplayName, getInputTypeLabel } from '../lib/input-helpers'
import { getActivityActionType } from '../lib/activity-helpers'
import { TwilightLocalizeMixin } from '../lib/i18n'
import { DialogController } from '../lib/dialog-controller'
import './inputs-dialog'
import './dialogs'

@customElement('twilight-inputs-card')
export class TwilightInputsCard extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ attribute: false }) config: InputConfig[] = []
  @property({ type: Array }) activities: string[] = []
  @property({ attribute: false }) activitiesConfig: ActivityConfig[] = []
  @property({ attribute: false }) rulesConfig: RuleConfig[] = []
  @property({ type: Boolean }) noHeader = false
  @property({ attribute: false }) placeholderDefaults: PlaceholderDefaults | null = null
  @property({ attribute: false }) runState: RunState | null = null
  @property({ type: Boolean }) templateMode = false
  @property({ type: String }) areaId: string | null = null
  @property({ type: Boolean }) editOpen = false

  private _dialog = new DialogController(this)

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
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
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

      .entity-list {
        padding: 0 0 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .entity-row {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 20px;
      }

      .type-badge {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: 4px;
        color: #fff;
        min-width: 48px;
        text-align: center;
        letter-spacing: 0.3px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        height: 18px;
      }
      .type-badge.binary {
        background: rgba(63, 81, 181, 0.85);
        border: 1px solid rgba(63, 81, 181, 0.9);
      }
      .type-badge.event {
        background: rgba(156, 39, 176, 0.85);
        border: 1px solid rgba(156, 39, 176, 0.9);
      }
      .type-badge.motion {
        background: rgba(56, 142, 60, 0.9);
        border: 1px solid rgba(56, 142, 60, 0.95);
      }
      .type-badge.timer {
        background: rgba(230, 130, 0, 0.9);
        border: 1px solid rgba(230, 130, 0, 0.95);
      }
      .type-badge.button {
        background: rgba(139, 92, 246, 0.85);
        border: 1px solid rgba(139, 92, 246, 0.9);
      }

      .manual-trigger-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.06);
        color: var(--primary-text-color);
        font-size: 13px;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s;
        position: relative;
      }

      .manual-trigger-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.3);
      }

      .manual-trigger-btn.active {
        background: rgba(139, 92, 246, 0.22);
        border-color: rgba(139, 92, 246, 0.6);
      }

      .manual-trigger-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .manual-trigger-icon {
        font-size: 11px;
        opacity: 0.7;
      }

      .manual-trigger-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: rgba(139, 92, 246, 0.9);
        display: inline-block;
        margin-left: 2px;
      }

      .entity-name-wrap {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }

      .entity-name {
        font-size: 13px;
        color: var(--primary-text-color);
        font-weight: 600;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .entity-id {
        font-size: 11px;
        color: var(--secondary-text-color);
        font-family: monospace;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 2px;
      }

      .active-indicator {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--success-color, #4caf50);
        box-shadow: 0 0 8px var(--success-color, #4caf50);
        flex-shrink: 0;
        margin-right: 8px;
      }

      .disabled-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(var(--rgb-card-background-color, 20, 20, 31), 0.25);
        backdrop-filter: blur(1px);
        -webkit-backdrop-filter: blur(1px);
        pointer-events: none;
        z-index: 2;
      }

      .disabler-badge {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        padding: 2px 6px;
        border-radius: 4px;
        min-width: 48px;
        text-align: center;
        letter-spacing: 0.3px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        height: 18px;
        white-space: nowrap;
      }

      .disabler-badge.no_entity {
        background: rgba(211, 47, 47, 0.9);
        border: 1px solid rgba(211, 47, 47, 0.95);
        color: #fff;
      }

      .disabler-badge.user {
        background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
        color: var(--secondary-text-color);
      }

      .disabler-badge.activity {
        background: rgba(194, 24, 91, 0.9);
        border: 1px solid rgba(194, 24, 91, 0.95);
        color: #fff;
      }

      .disabler-badge.rule {
        background: rgba(123, 31, 162, 0.9);
        border: 1px solid rgba(123, 31, 162, 0.95);
        color: #fff;
      }

      .entity-row.disabled .type-badge,
      .entity-row.disabled .entity-name-wrap,
      .entity-row.disabled .activity-badge {
        opacity: 0.45;
      }

      .divider {
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
        margin: 4px 20px;
      }

      .empty-state {
        padding: 24px;
        text-align: center;
        color: var(--secondary-text-color);
        font-style: italic;
        font-size: 13px;
      }
    `
  ]

  private _openEdit() {
    this.dispatchEvent(new CustomEvent('open-edit', { bubbles: true, composed: true }))
  }



  private async _triggerButton(input: InputConfig, active?: boolean) {
    if (!this.hass || this.editOpen) return
    const areaId = this.areaId
    if (!areaId) return
    const params: { area_id: string; input_id: string; active?: boolean } = {
      area_id: areaId,
      input_id: input.id,
    }
    if (input.button_mode === 'toggle' && active !== undefined) {
      params.active = active
    }
    try {
      await api.triggerInput(this.hass, params)
    } catch (e) {
      console.error('[twilight] trigger_input failed', e)
      await this._dialog.showAlert(
        this.t('inputs_card.trigger_failed'),
        this.t('inputs_card.trigger_failed_desc', { error: (e as Error).message || String(e) })
      )
    }
  }

  private _renderManualTriggers() {
    const buttons = this.config.filter(i => i.type === 'button')
    if (buttons.length === 0) return html``

    return html`
      <div style="padding: 10px 12px 4px; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--secondary-text-color); margin-bottom: 8px;">${this.t('inputs_card.manual_triggers')}</div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; padding-bottom: 10px;">
          ${buttons.map(input => {
            const liveInput = this.runState?.inputs?.[input.id]
            const isActive = liveInput?.active || false
            const disablers = liveInput?.disabled_by?.filter((d: string) => d !== 'no_entity') || []
            const isDisabled = disablers.length > 0 || this.editOpen

            const displayName = input.label || input.name || input.id
            if (input.button_mode === 'toggle') {
              return html`
                <button
                  class="manual-trigger-btn ${isActive ? 'active' : ''}"
                  ?disabled=${isDisabled}
                  title="${isDisabled ? this.t('common.disabled') : (isActive ? this.t('inputs_card.click_to_deactivate') : this.t('inputs_card.click_to_activate'))}"
                  @click=${() => this._triggerButton(input, !isActive)}
                >
                  <span class="manual-trigger-icon">⏻</span>
                  ${displayName}
                  ${isActive ? html`<span class="manual-trigger-dot"></span>` : ''}
                </button>
              `
            }
            return html`
              <button
                class="manual-trigger-btn"
                ?disabled=${isDisabled}
                title="${isDisabled ? this.t('common.disabled') : this.t('inputs_card.trigger_button', { name: displayName })}"
                @click=${() => this._triggerButton(input)}
              >
                <span class="manual-trigger-icon">▶</span>
                ${displayName}
              </button>
            `
          })}
        </div>
      </div>
    `
  }

  private _getEntityDisplay(input: InputConfig) {
    return getEntityDisplay(input, this.hass ?? undefined)
  }

  private _getActivityActionType(activityId: string | null | undefined): string {
    if (!activityId) return 'none'
    return getActivityActionType(activityId, this.activitiesConfig) ?? 'none'
  }

  private _getActivityName(activityId: string | null | undefined): string {
    if (!activityId) return ''
    const found = (this.activitiesConfig || []).find(a => a.id === activityId)
    return found?.name || found?.id || activityId
  }

  private _getRuleName(ruleId: string): string {
    const rule = (this.rulesConfig || []).find(r => r.id === ruleId)
    return rule?.name || ruleId
  }

  render() {
    return html`
      <div class="devices-card">
        ${!this.noHeader ? html`
          <div class="devices-card-header">
            <span class="card-dot" style="--dot-color: #10b981;"></span>
            <span class="devices-card-title" role="heading" aria-level="2">${this.t('inputs_card.title')}</span>
            <button class="edit-btn" aria-label=${this.t('common.configure_x', { name: this.t('inputs_card.title') })} @click=${this._openEdit}>⋮</button>
          </div>
        ` : ''}

        ${this._renderManualTriggers()}

        <div class="entity-list">
          ${this.config.map((input, index) => {
            const liveInput = this.runState?.inputs?.[input.id]
            const rawDisabledBy = liveInput?.disabled_by || []
            const disabledBy = (this.templateMode || input.type === 'button')
              ? rawDisabledBy.filter(d => d !== 'no_entity')
              : rawDisabledBy
            const isDisabled = disabledBy.length > 0
            const isActive = liveInput?.active || false

            let badgeClass = 'user'
            if (disabledBy.includes('no_entity')) {
              badgeClass = 'no_entity'
            } else if (disabledBy.some(d => d.startsWith('activity:'))) {
              badgeClass = 'activity'
            } else if (disabledBy.some(d => d.startsWith('rule:'))) {
              badgeClass = 'rule'
            }

            let nameHtml = html`—`
            let subHtml = html`—`

            if (this.templateMode) {
              const displayLabel = getInputDisplayName(input, this.hass)
              nameHtml = html`<span class="entity-name">${displayLabel}</span>`
              if (input.type === 'motion') {
                const p = getResolvedMotionInfo(input, this.placeholderDefaults)
                const infoStr = formatMotionInfo(p, this.hass?.locale?.language)
                subHtml = html`<span class="entity-id" style="margin-top: 2px; font-family: inherit;">${infoStr}</span>`
              } else if (input.type === 'timer') {
                subHtml = html`<span class="entity-id">${this.t('inputs_card.trigger_time', { time: input.trigger_time ?? '00:00:00' })}</span>`
              } else if (input.type === 'event') {
                if (input.event_type) {
                  subHtml = html`<span class="entity-id">${this.t('inputs_card.event_type', { type: input.event_type })}</span>`
                }
              } else if (input.type === 'button') {
                subHtml = html`<span class="entity-id">${this.t('inputs_card.mode', { mode: input.button_mode ?? 'click' })}</span>`
              }
            } else {
              if (input.type === 'motion') {
                const { friendlyName, subText } = this._getEntityDisplay(input)
                nameHtml = html`<span class="entity-name">${input.name || friendlyName}</span>`
                const p = getResolvedMotionInfo(input, this.placeholderDefaults)
                const infoStr = formatMotionInfo(p, this.hass?.locale?.language)
                subHtml = html`
                  <span class="entity-id" style="font-family: monospace;">${input.name ? `${friendlyName} (${subText})` : subText}</span>
                  <span class="entity-id" style="margin-top: 2px; font-family: inherit;">${infoStr}</span>
                `
              } else if (input.type === 'timer') {
                nameHtml = html`<span class="entity-name">${input.name || this.t('inputs_card.daily_timer')}</span>`
                subHtml = html`
                  <span class="entity-id">${this.t('inputs_card.trigger_time', { time: input.trigger_time ?? '00:00:00' })}</span>
                `
              } else if (input.type === 'button') {
                nameHtml = html`<span class="entity-name">${input.name || input.label || this.t('inputs_card.button')}</span>`
                subHtml = html`<span class="entity-id">${this.t('inputs_card.mode', { mode: input.button_mode ?? 'click' })}${input.create_entity ? html` <ha-icon icon="mdi:home-assistant" style="--mdc-icon-size: 12px; vertical-align: middle;"></ha-icon>` : ''}</span>`
              } else {
                const { friendlyName, subText } = this._getEntityDisplay(input)
                nameHtml = html`<span class="entity-name">${input.name || friendlyName}</span>`
                let extra = ''
                if (input.type === 'event' && input.event_type) {
                  extra = ` [event: ${input.event_type}]`
                }
                subHtml = html`
                  <span class="entity-id">${input.name ? `${friendlyName} (${subText})` : subText}${extra}</span>
                `
              }
            }

            return html`
              <div class="entity-row ${isDisabled ? 'disabled' : ''}">
                <span class="type-badge ${input.type}">${getInputTypeLabel(input, this.hass)}</span>
                <div class="entity-name-wrap">
                  ${nameHtml}
                  ${subHtml}
                </div>
                ${isActive ? html`<span class="active-indicator" title=${this.t('inputs_card.sensor_active')}></span>` : ''}
                ${input.rule ? html`
                  <span class="activity-badge rule" title=${this.t('inputs_card.targets_rule')}>${this._getRuleName(input.rule)}</span>
                ` : input.activity ? html`
                  <span class="activity-badge ${this._getActivityActionType(input.activity)}">${this._getActivityName(input.activity)}</span>
                ` : html`
                  <span class="activity-badge none">${this.t('common.none')}</span>
                `}
                ${isDisabled ? html`
                  <div class="disabled-overlay">
                    <span class="disabler-badge ${badgeClass}">
                      ${getDisablerText(disabledBy, this.rulesConfig, this.activitiesConfig, this.hass?.locale?.language)}
                    </span>
                  </div>
                ` : ''}
              </div>
              ${index < this.config.length - 1 ? html`<div class="divider"></div>` : ''}
            `
          })}
          ${this.config.length === 0 ? html`
            <div class="empty-state">${this.t('inputs_card.empty_state')}</div>
          ` : ''}
        </div>
      </div>

      <twilight-alert-dialog
        .open=${this._dialog.alertOpen}
        .dialogTitle=${this._dialog.alertTitle}
        .message=${this._dialog.alertMessage}
        @close=${this._dialog._onCloseAlert}
      ></twilight-alert-dialog>
    `
  }
}
