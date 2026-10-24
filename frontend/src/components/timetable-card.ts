import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import { type Slot, type ChannelConfig, type LabEntity, PRIMARY_CHANNEL_ID, MAX_CUSTOM_CHANNELS } from '../lib/types'
import { sortChannelIds } from '../lib/channel-helpers'
import { formatSlotTime, isSlotActiveAt, sceneDisplayName, localDateString } from '../lib/utils'
import { DialogController } from '../lib/dialog-controller'
import { LiveClockController } from '../lib/live-clock-controller'
import { cardDotStyles } from '../lib/shared-styles'
import { TwilightLocalizeMixin } from '../lib/i18n'
import './dialogs'
import './sun-path-card'

@customElement('twilight-timetable-card')
export class TwilightTimetableCard extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: Array }) slots: Slot[] = []
  @property({ type: Boolean }) noHeader = false
  @property({ type: Array }) entities: LabEntity[] = []
  @property({ type: Boolean }) loading = false
  @property({ attribute: false }) channels: Record<string, ChannelConfig> = {}
  @property({ type: String }) selectedChannelId: string = PRIMARY_CHANNEL_ID
  @property({ type: Boolean }) templateMode = false
  @property({ type: String }) date: string = localDateString()
  @property({ attribute: false }) channelSlotsMap: Record<string, Slot[]> = {}
  @property({ attribute: false }) activeSlotId?: string | null

  @state() private _menuOpen = false

  private _dialog = new DialogController(this)
  // Reactive clock so active-slot highlighting stays live (ticks every 15s)
  // instead of only refreshing when some other render happens to fire.
  private _clock = new LiveClockController(this)

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('click', this._handleWindowClick)
  }

  disconnectedCallback() {
    window.removeEventListener('click', this._handleWindowClick)
    super.disconnectedCallback()
  }

  private _handleWindowClick = (e: MouseEvent) => {
    if (!this._menuOpen) return
    const path = e.composedPath()
    const isKebab = path.some(el => el instanceof HTMLElement && el.classList.contains('kebab-container'))
    if (!isKebab) {
      this._menuOpen = false
    }
  }

  private _toggleMenu(e: Event) {
    e.stopPropagation()
    this._menuOpen = !this._menuOpen
  }

  private _orderedChannelIds(): string[] {
    const ids = Object.keys(this.channels)
    if (this.templateMode) {
      const customIds = ids.filter(id => id !== PRIMARY_CHANNEL_ID).sort()
      return [PRIMARY_CHANNEL_ID, ...customIds]
    }
    return sortChannelIds(this.channels)
  }

  private _selectChannel(channelId: string) {
    this._menuOpen = false
    this.dispatchEvent(new CustomEvent('channel-selected', {
      detail: { channelId }, bubbles: true, composed: true
    }))
  }

  private async _addChannel() {
    this._menuOpen = false
    const name = await this._dialog.showPrompt(this.t('timetable_card.new_channel_title'), '', this.t('timetable_card.new_channel_name_placeholder'))
    if (name === null || name.trim() === '') return
    this.dispatchEvent(new CustomEvent('channel-added', {
      detail: { name: name.trim() }, bubbles: true, composed: true
    }))
  }

  private async _renameChannel() {
    this._menuOpen = false
    const current = this.channels[this.selectedChannelId]?.name ?? ''
    const name = await this._dialog.showPrompt(this.t('timetable_card.rename_channel_title'), current, this.t('timetable_card.rename_channel_name_placeholder'))
    if (name === null || name.trim() === '') return
    this.dispatchEvent(new CustomEvent('channel-renamed', {
      detail: { channelId: this.selectedChannelId, name: name.trim() }, bubbles: true, composed: true
    }))
  }

  private async _deleteChannel() {
    this._menuOpen = false
    if (this.selectedChannelId === PRIMARY_CHANNEL_ID) return
    const name = this.channels[this.selectedChannelId]?.name ?? this.selectedChannelId
    const ok = await this._dialog.showConfirm(this.t('timetable_card.delete_channel'), this.t('timetable_card.delete_channel_confirm', { name }))
    if (!ok) return
    this.dispatchEvent(new CustomEvent('channel-deleted', {
      detail: { channelId: this.selectedChannelId }, bubbles: true, composed: true
    }))
  }

  private _toggleChannelEnabled() {
    this._menuOpen = false
    if (this.selectedChannelId === PRIMARY_CHANNEL_ID) return
    const ch = this.channels[this.selectedChannelId]
    if (!ch) return
    this.dispatchEvent(new CustomEvent('channel-enabled-toggled', {
      detail: { channelId: this.selectedChannelId, enabled: !ch.enabled }, bubbles: true, composed: true
    }))
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

    .slot-card {
      box-sizing: border-box;
      background: transparent;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .slot-card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px 0;
    }

    .slot-card-title {
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

    /* ── Channel Tab Bar ── */
    .channel-tabs {
      display: flex;
      gap: 0;
      padding: 8px 20px 0;
      border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .channel-tabs::-webkit-scrollbar { display: none; }

    .channel-tab {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 600;
      color: var(--secondary-text-color);
      border-bottom: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .channel-tab:hover {
      color: var(--primary-text-color);
    }
    .channel-tab.active {
      color: var(--accent-color, #e91e8c);
      border-bottom-color: var(--accent-color, #e91e8c);
    }
    .channel-tab.disabled {
      text-decoration: line-through;
      opacity: 0.5;
    }

    .slot-summary {
      padding: 12px 0;
      /* Reserve room for the full 10-slot list so the card height stays constant
         across channels (Primary always has 10, custom channels at most 10).
         min-height targets the content area; padding (12px top + 12px bottom) is added on top. */
      --slot-row-h: 32px;
      min-height: calc(10 * var(--slot-row-h));
    }

    .slot-summary-row {
      display: grid;
      grid-template-columns: 10px 120px 1fr auto;
      align-items: center;
      gap: 12px;
      padding: 0 20px;
      height: var(--slot-row-h);
      box-sizing: border-box;
      transition: background 0.15s;
    }

    .slot-summary-row:hover {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    }

    .slot-summary-row.active {
      font-weight: 500;
      background: color-mix(in srgb, var(--primary-text-color) 3%, transparent);
    }

    .slot-color-dot {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      flex-shrink: 0;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 20%, transparent);
    }

    .slot-summary-label {
      font-size: 13px;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .slot-summary-scene {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .slot-summary-time {
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      font-family: monospace;
      white-space: nowrap;
    }

    @media (max-width: 480px) {
      .slot-summary-row {
        grid-template-columns: 10px 90px 1fr auto;
        gap: 8px;
        padding: 0 12px;
      }
      .slot-summary-label {
        font-size: 11px;
      }
      .slot-summary-scene {
        font-size: 10px;
      }
      .slot-summary-time {
        font-size: 11px;
      }
    }

    .entity-list-empty {
      padding: 12px 20px;
      font-size: 13px;
      color: var(--secondary-text-color);
      font-style: italic;
    }

    .kebab-container {
      position: relative;
      display: inline-block;
    }

    .dropdown-menu {
      position: absolute;
      right: 0;
      top: 100%;
      background: var(--paper-card-background-color, #1c1c1c);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      z-index: 100;
      min-width: 180px;
      display: flex;
      flex-direction: column;
      padding: 4px 0;
      margin-top: 4px;
    }

    .dropdown-item {
      background: transparent;
      border: none;
      color: var(--primary-text-color);
      padding: 10px 16px;
      text-align: left;
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: background 0.15s;
      white-space: nowrap;
    }

    .dropdown-item:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
    }

    .dropdown-item:disabled {
      color: var(--secondary-text-color);
      opacity: 0.45;
      cursor: not-allowed;
    }

    .dropdown-item.danger {
      color: var(--error-color, #db4437);
    }
    .dropdown-item.danger:hover:not(:disabled) {
      background: rgba(219, 68, 55, 0.15);
    }
  `]

  private _fireEditRequested() {
    this.dispatchEvent(new CustomEvent('edit-requested', {
      bubbles: true,
      composed: true
    }))
  }



  render() {
    this._clock.setHass(this.hass)
    const liveMins = this._clock.liveMins

    const activeIdx = !this.templateMode
      ? (this.activeSlotId
          ? this.slots.findIndex(slot => slot.id === this.activeSlotId)
          : (this.activeSlotId === null ? -1 : this.slots.findIndex(slot => isSlotActiveAt(slot, liveMins))))
      : -1

    const displaySlots = activeIdx !== -1
      ? [...this.slots.slice(activeIdx), ...this.slots.slice(0, activeIdx)]
      : this.slots

    return html`
      <div class="slot-card">
        ${!this.noHeader ? html`
          <div class="slot-card-header">
            <span class="card-dot" style="--dot-color: #f97316;"></span>
            <span class="slot-card-title" role="heading" aria-level="2">${this.t('timetable_card.title')}</span>
            <div class="kebab-container">
              <button class="edit-btn" aria-label=${this.t('common.configure_x', { name: this.t('timetable_card.title') })} aria-haspopup="menu" aria-expanded=${this._menuOpen} @click=${this._toggleMenu}>⋮</button>
              ${this._menuOpen ? html`
                <div class="dropdown-menu">
                  ${(() => {
                    const isPrimarySelected = this.selectedChannelId === PRIMARY_CHANNEL_ID
                    const hasSelectedCustom = this.selectedChannelId && !isPrimarySelected && !!this.channels[this.selectedChannelId]
                    const customCount = Object.keys(this.channels).filter(id => id !== PRIMARY_CHANNEL_ID).length
                    const atLimit = customCount >= MAX_CUSTOM_CHANNELS
                    return html`
                      <button class="dropdown-item" @click=${() => { this._menuOpen = false; this._fireEditRequested(); }}>
                        📝 ${this.t('timetable_card.edit_slots')}
                      </button>
                      <button class="dropdown-item" ?disabled=${atLimit} @click=${this._addChannel}>
                        ➕ ${atLimit ? this.t('timetable_card.add_channel_max') : this.t('timetable_card.add_channel')}
                      </button>
                      ${hasSelectedCustom ? html`
                        <button class="dropdown-item" @click=${this._renameChannel}>
                          ✏️ ${this.t('timetable_card.rename_channel')}
                        </button>
                        <button class="dropdown-item" @click=${this._toggleChannelEnabled}>
                          ${this.channels[this.selectedChannelId]?.enabled === false ? this.t('timetable_card.enable_channel') : this.t('timetable_card.disable_channel')}
                        </button>
                        <button class="dropdown-item danger" @click=${this._deleteChannel}>
                          🗑️ ${this.t('timetable_card.delete_channel')}
                        </button>
                      ` : ''}
                    `
                  })()}
                </div>
              ` : ''}
            </div>
          </div>
          <div class="channel-tabs">
            ${this._orderedChannelIds().map(id => {
              const isPrimary = id === PRIMARY_CHANNEL_ID
              const ch = this.channels[id]
              const active = id === this.selectedChannelId
              const disabled = ch?.enabled === false
              return html`
                <button
                  class="channel-tab ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}"
                  @click=${() => this._selectChannel(id)}
                  title=${disabled ? this.t('timetable_card.disabled') : ''}
                >${isPrimary ? this.t('common.primary_channel') : (ch?.name || id)}</button>
              `
            })}
          </div>
        ` : ''}
        ${!this.templateMode && !this.loading ? html`
          <div style="padding-top: 12px;">
            <twilight-sun-path-card
              .hass=${this.hass}
              .date=${this.date}
              .clamped=${true}
              .showSlots=${true}
              .slots=${this.slots}
              .channels=${this.channels}
              .selectedChannelId=${this.selectedChannelId}
              .channelSlotsMap=${this.channelSlotsMap}
              .noHeader=${true}
              .noAxisLabels=${false}
              .noYAxis=${true}
              .noSolarNoonMidnight=${true}
              ?embedded=${true}
            ></twilight-sun-path-card>
          </div>
        ` : ''}
        <div class="slot-summary">
          ${this.loading
            ? html`<div class="entity-list-empty">${this.t('common.loading')}</div>`
            : displaySlots.length > 0
              ? displaySlots.map(slot => {
                  const active = activeIdx !== -1 && this.slots[activeIdx]?.id === slot.id
                  const timeDisplay = this.templateMode
                    ? (slot.startType === 'fixed'
                        ? (slot.fixedStartTime || '12:00')
                        : `${slot.startEvent || 'astral'}${slot.startOffset ? (slot.startOffset > 0 ? ` +${slot.startOffset}m` : ` ${slot.startOffset}m`) : ''}`)
                    : `${formatSlotTime(slot.from, this.hass?.locale)} → ${formatSlotTime(slot.to, this.hass?.locale)}`
                  return html`
                    <div class="slot-summary-row ${active ? 'active' : ''}" style="cursor: pointer;" @click=${() => this._fireEditRequested()}>
                      <div class="slot-color-dot" style="background:${slot.color}; box-shadow:${active ? `0 0 6px ${slot.color}` : 'none'}"></div>
                      <span class="slot-summary-label">${slot.label}</span>
                      <span class="slot-summary-scene">
                        ${slot.scene
                          ? sceneDisplayName(this.hass, slot.scene)
                          : '—'}
                      </span>
                      <span class="slot-summary-time">${timeDisplay}</span>
                    </div>
                  `
                })
              : html`<div class="entity-list-empty">${this.templateMode ? this.t('timetable_card.no_custom_channels_template') : this.t('timetable_card.no_slots_configured')}</div>`
          }
        </div>
      </div>

      <twilight-confirm-dialog
        .open=${this._dialog.confirmOpen}
        .dialogTitle=${this._dialog.confirmTitle}
        .message=${this._dialog.confirmMessage}
        @confirm=${this._dialog._onConfirm}
        @cancel=${this._dialog._onCancelConfirm}
      ></twilight-confirm-dialog>

      <twilight-prompt-dialog
        .open=${this._dialog.promptOpen}
        .dialogTitle=${this._dialog.promptTitle}
        .placeholder=${this._dialog.promptPlaceholder}
        .value=${this._dialog.promptValue}
        @submit=${this._dialog._onSubmitPrompt}
        @cancel=${this._dialog._onCancelPrompt}
      ></twilight-prompt-dialog>
    `
  }
}
