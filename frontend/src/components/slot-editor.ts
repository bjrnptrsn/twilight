import { html, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import { type Slot, type LabEntity, SlotsChangedEvent, MAX_SLOTS_PER_CHANNEL, MIN_SLOT_DISTANCE_MINUTES, type PlaceholderDefaults } from '../lib/types'
import { minsToHHMM, preloadHaComponents } from '../lib/utils'
import { dialogChromeStyles } from '../lib/shared-styles'
import { type TranslationKey } from '../lib/i18n'
import { PortalDialog } from './dialogs'
import './dialogs'

const EVENT_LABEL_KEYS: Record<string, TranslationKey> = {
  astro_dawn:    'slot_editor.event_astro_dawn',
  nautical_dawn: 'slot_editor.event_nautical_dawn',
  civil_dawn:    'slot_editor.event_civil_dawn',
  gold_dawn:     'slot_editor.event_gold_dawn',
  day:           'slot_editor.event_day',
  gold_dusk:     'slot_editor.event_gold_dusk',
  civil_dusk:    'slot_editor.event_civil_dusk',
  nautical_dusk: 'slot_editor.event_nautical_dusk',
  astro_dusk:    'slot_editor.event_astro_dusk',
  night:         'slot_editor.event_night',
}

@customElement('twilight-slot-editor')
export class TwilightSlotEditor extends PortalDialog {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: Array }) slots: Slot[] = []
  @property({ type: Array }) entities: LabEntity[] = []
  @property({ type: Boolean }) open = false
  @property({ type: String }) highlightSlotId: string | null = null
  @property({ type: String }) areaId = ''
  @property({ type: String }) areaName = ''
  // Primary channel: 10 fixed astral slots — no add/delete, start type locked
  // to Sun Event. Custom channels are fully editable.
  @property({ type: Boolean }) isPrimaryChannel = true
  @property({ type: Boolean }) templateMode = false
  @property({ type: String }) channelName = ''
  @property({ type: Number }) transitionOnSeconds: number | null = null

  @property({ attribute: false }) placeholderDefaults: PlaceholderDefaults | null = null

  @state() private _draft: Slot[] | null = null
  @state() private _draftTransitionOnSeconds: number | null = null
  private _transitionDraftInitialized = false

  static styles = [
    dialogChromeStyles,
    css`
      /* Wider than the shared dialog default: this panel carries a full slot
         table incl. the Dynamic column, so it needs the extra room. */
      .edit-panel {
        max-width: 1400px;
      }

      .panel-body {
        padding: 16px 0;
        overflow-x: auto;
      }

    .slots-list {
      display: flex;
      flex-direction: column;
      padding: 4px 24px 16px;
    }

    .slots-notice {
      font-size: 11px;
      color: var(--secondary-text-color);
      padding: 0 16px 18px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .slots-header {
      display: grid;
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(100px, 1fr) minmax(220px, 2.5fr) minmax(150px, 0.9fr) 30px;
      gap: 12px;
      padding: 0 16px 8px;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--secondary-text-color);
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
    }
    .slots-header--no-time {
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(220px, 2.5fr) minmax(150px, 0.9fr) 30px;
    }

    .slot-edit-card {
      display: grid;
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(100px, 1fr) minmax(220px, 2.5fr) minmax(150px, 0.9fr) 30px;
      gap: 12px;
      align-items: center;
      padding: 4px 16px;
      background: transparent;
      border: none;
      border-bottom: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
      border-radius: 0;
      box-sizing: border-box;
      transition: background-color 0.2s;
      margin-bottom: 0;
    }
    .slot-edit-card--no-time {
      grid-template-columns: minmax(110px, 1.1fr) minmax(110px, 1fr) minmax(180px, 1.6fr) minmax(220px, 2.5fr) minmax(150px, 0.9fr) 30px;
    }

    .slot-edit-card.highlighted {
      border-left: 3px solid var(--accent-color, #e91e8c);
      background: color-mix(in srgb, var(--accent-color, #e91e8c) 6%, transparent);
      padding-left: 13px;
    }

    .slot-edit-card.invalid {
      background: color-mix(in srgb, var(--error-color, #db4437) 10%, transparent);
      box-shadow: inset 3px 0 0 var(--error-color, #db4437);
    }

    .slot-edit-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 20%, transparent);
    }

    .slot-edit-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--primary-text-color);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .slot-edit-time {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-family: monospace;
      white-space: nowrap;
    }

    .sensor-input {
      width: 100%;
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
      border-radius: 4px;
      color: var(--primary-text-color);
      padding: 6px 10px;
      font-size: 13px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.15s;
    }
    .sensor-input:focus {
      border-color: var(--accent-color, #e91e8c);
    }
    .sensor-input:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .panel-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent));
      display: flex;
      justify-content: flex-end;
      flex-shrink: 0;
    }

    .btn-done {
      background: var(--accent-color, #e91e8c);
      color: white;
      border: none;
      padding: 10px 32px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .btn-done:hover { opacity: 0.85; }
    .btn-done:disabled { opacity: 0.4; cursor: not-allowed; }

    .btn-add-slot {
      background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
      color: var(--primary-text-color);
      border: 1px dashed var(--ha-card-border-color, var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent)));
      padding: 12px 32px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.15s, border-color 0.15s;
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-sizing: border-box;
      width: 100%;
    }
    .btn-add-slot:hover:not(:disabled) {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      border-color: var(--accent-color, #e91e8c);
    }
    .btn-add-slot:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    ha-entity-picker {
      display: block;
      width: 100%;
    }

    .mobile-label {
      display: none;
    }

    @media (max-width: 768px) {
      .slots-header {
        display: none;
      }
      .slot-edit-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
        padding: 16px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid var(--ha-card-border-color, var(--divider-color, color-mix(in srgb, var(--primary-text-color) 5%, transparent)));
        border-bottom: 1px solid var(--ha-card-border-color, var(--divider-color, color-mix(in srgb, var(--primary-text-color) 5%, transparent)));
        margin-bottom: 12px;
      }
      .mobile-label {
        display: block;
        font-size: 10px;
        text-transform: uppercase;
        color: var(--secondary-text-color);
        font-weight: 700;
        margin-bottom: 4px;
      }
    }
  `
  ]

  /** A fixed_time string is valid as HH:MM, 00:00–23:59. */
  private _isValidHHMM(v: string | undefined): boolean {
    if (!v) return false
    const m = /^(\d{1,2}):(\d{2})$/.exec(v)
    if (!m) return false
    const h = Number(m[1]), mi = Number(m[2])
    return h >= 0 && h <= 23 && mi >= 0 && mi <= 59
  }

  /** Any fixed slot with an invalid time blocks saving. */
  private _hasInvalidSlot(): boolean {
    const slots = this._draft ?? this.slots
    return slots.some(s => s.startType === 'fixed' && !this._isValidHHMM(s.fixedStartTime))
  }

  /** Slot objects are flat (no nested arrays/objects, see the Slot interface
   *  in types.ts) — a sorted-keys JSON comparison is a cheap, order-independent
   *  structural equality check without pulling in a deep-equal dependency. */
  private _slotsEqual(a: Slot[], b: Slot[]): boolean {
    if (a.length !== b.length) return false
    const normalize = (s: Slot) =>
      JSON.stringify(s, Object.keys(s).sort() as (keyof Slot)[])
    return a.every((s, i) => normalize(s) === normalize(b[i]))
  }

  private _closeAndSave() {
    if (this._hasInvalidSlot()) return
    const transitionChanged = this._draftTransitionOnSeconds !== this.transitionOnSeconds
    // willUpdate() seeds _draft with a clone of `this.slots` as soon as the
    // editor opens, so `_draft !== null` alone is true even when nothing was
    // edited — that fired an unconditional SlotsChangedEvent (and area/save)
    // on every "Done" click. Compare content instead.
    const slotsChanged = this._draft !== null && !this._slotsEqual(this._draft, this.slots)
    const isDirty = slotsChanged || transitionChanged
    if (isDirty) {
      const draftSlots = this._draft ?? this.slots
      this.dispatchEvent(new SlotsChangedEvent(draftSlots, this._draftTransitionOnSeconds))
    }
    this._draft = null
    this._transitionDraftInitialized = false
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }

  private _closeDiscard() {
    this._draft = null
    this._transitionDraftInitialized = false
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }

  protected override _onEscape() {
    this._closeDiscard()
  }

  private _updateDraft(slots: Slot[]) {
    this._draft = slots
  }



  private _clampOffset(slotId: string, rawVal: number, draft: Slot[]): number {
    const maxOffset = this.placeholderDefaults?.max_offset_minutes ?? 180
    const effectiveMin = this.placeholderDefaults?.min_slot_distance_minutes ?? MIN_SLOT_DISTANCE_MINUTES
    let val = Math.max(-maxOffset, Math.min(maxOffset, rawVal))

    const ZONE_ORDER = [
      'astro_dawn',
      'nautical_dawn',
      'civil_dawn',
      'gold_dawn',
      'day',
      'gold_dusk',
      'civil_dusk',
      'nautical_dusk',
      'astro_dusk',
      'night',
    ]

    const targetSlot = draft.find(s => s.id === slotId)
    if (!targetSlot || (targetSlot.startType || 'fixed') !== 'astral') {
      return val
    }

    const astralSlots = draft
      .filter(s => (s.startType || 'fixed') === 'astral')
      .map(s => {
        const zone = s.startEvent || 'civil_dawn'
        const idx = ZONE_ORDER.indexOf(zone)
        return { slot: s, zoneIdx: idx !== -1 ? idx : 99 }
      })
      .sort((a, b) => a.zoneIdx - b.zoneIdx)

    const targetIdx = astralSlots.findIndex(item => item.slot.id === slotId)
    if (targetIdx !== -1) {
      // Rule: offset_A - offset_B <= EFFECTIVE_MIN
      // If editing target slot B (targetIdx > 0, prev = A): offset_B >= offset_A - EFFECTIVE_MIN
      if (targetIdx > 0) {
        const prevOffset = astralSlots[targetIdx - 1].slot.startOffset || 0
        if (val < prevOffset - effectiveMin) val = prevOffset - effectiveMin
      }
      // If editing target slot A (targetIdx < length - 1, next = B): offset_A <= offset_B + EFFECTIVE_MIN
      if (targetIdx < astralSlots.length - 1) {
        const nextOffset = astralSlots[targetIdx + 1].slot.startOffset || 0
        if (val > nextOffset + effectiveMin) val = nextOffset + effectiveMin
      }
    }

    return val
  }

  private _addCustomSlot() {
    const current = this._draft ?? this.slots
    if (current.length >= MAX_SLOTS_PER_CHANNEL) return
    const nextNum = current.filter(s => s.isCustom).length + 1
    const newSlot: Slot = {
      id: `draft_${Date.now()}_${nextNum}`,
      label: `Custom Slot ${nextNum}`,
      color: '#8e44ad',
      from: 720,
      to: 780,
      scene: null,
      isCustom: true,
      startType: 'fixed',
      fixedStartTime: '12:00'
    }
    this._updateDraft([...current, newSlot])
  }

  private _deleteSlot(id: string) {
    this._updateDraft((this._draft ?? this.slots).filter(s => s.id !== id))
  }

  private _setSlotScene(slotId: string, scene: string | null) {
    this._updateDraft((this._draft ?? this.slots).map(s => s.id === slotId ? { ...s, scene } : s))
  }

  willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('open')) {
      if (this.open) {
        if (this._draft === null) {
          this._draft = this.slots.map(s => ({ ...s }))
        }
        if (!this._transitionDraftInitialized) {
          this._draftTransitionOnSeconds = this.transitionOnSeconds
          this._transitionDraftInitialized = true
        }
        preloadHaComponents()
      } else {
        this._draft = null
        this._transitionDraftInitialized = false
      }
    }
  }

  render() {
    if (!this.open) return html``

    const draft = this._draft
    if (!draft) return html``

    const normalizeForSearch = (s: string) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const areaIdLower = normalizeForSearch((this.areaId || '').toLowerCase())
    const areaNameLower = normalizeForSearch((this.areaName || '').toLowerCase())
    const searchTerms = new Set<string>()
    if (areaIdLower) searchTerms.add(areaIdLower)
    if (areaNameLower) searchTerms.add(areaNameLower)

    const matchesArea = (entityId: string, name: string) => {
      const entityIdLower = normalizeForSearch(entityId.toLowerCase())
      const nameLower = normalizeForSearch((name || '').toLowerCase())
      for (const term of searchTerms) {
        if (entityIdLower.includes(term) || nameLower.includes(term)) {
          return true
        }
      }
      return false
    }

    const currentSceneIds = new Set(
      draft.map(s => s.scene).filter((id): id is string => !!id)
    )

    const useFilter = !!(this.areaId && this.entities && this.entities.length > 0)
    const areaSceneIds = new Set(
      useFilter
        ? this.entities
            .filter(e => {
              if (e.domain !== 'scene' && e.domain !== 'script') return false
              if (e.scene_type === 'HUE_SMART_SCENE') return false
              return e.in_area || currentSceneIds.has(e.entity_id) || matchesArea(e.entity_id, e.name)
            })
            .map(e => e.entity_id)
        : []
    )

    // Show slots in the backend-provided order (sorted by start). No rotation by
    // current time and no highlight-to-top reordering — the editor edits the
    // configuration and must display a stable, chronological order.
    const orderedSlots = draft

    return html`
      <div class="overlay" @click=${(e: Event) => { if (e.target === e.currentTarget) this._closeDiscard() }}>
        <div
          class="edit-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this._titleId}
          @keydown=${this._onDialogKeydown}
        >
          <div class="panel-header">
            <span class="card-dot" style="--dot-color: #f97316;"></span>
            <span class="panel-header-title" id=${this._titleId} role="heading" aria-level="2">
              ${this.t('slot_editor.title')}${this.channelName ? html` · <span style="color:var(--secondary-text-color);font-weight:500">${this.channelName}</span>` : ''}
            </span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._closeDiscard}>✕</button>
          </div>

          <div class="panel-body">
            <div class="slots-list">
              ${!(this.templateMode && this.isPrimaryChannel) ? html`
              <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; padding:12px 16px; background:color-mix(in srgb, var(--primary-text-color) 4%, transparent); border:1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 8%, transparent)); border-radius:12px; margin-bottom:12px;">
                <div>
                  <div style="font-size:13px; font-weight:600; color:var(--primary-text-color)">${this.t('slot_editor.transition_duration')}</div>
                  <div style="font-size:11px; color:var(--secondary-text-color)">${this.t('slot_editor.transition_duration_desc')}</div>
                </div>
                <div style="width:100px;">
                  <input
                    type="number"
                    min="0"
                    class="sensor-input"
                    .value=${this._draftTransitionOnSeconds !== null ? String(this._draftTransitionOnSeconds) : ''}
                    placeholder=${String(this.placeholderDefaults?.transition_on_seconds ?? 60)}
                    @input=${(e: Event) => {
                      const raw = (e.target as HTMLInputElement).value.trim()
                      if (raw === '') {
                        this._draftTransitionOnSeconds = null
                      } else {
                        const parsed = parseInt(raw, 10)
                        this._draftTransitionOnSeconds = isNaN(parsed) ? null : parsed
                      }
                    }}
                  />
                </div>
              </div>
              ` : ''}
              <div class="slots-notice">
                <span>⏱️</span>
                <span>${this.t('slot_editor.min_distance_notice', { min: this.placeholderDefaults?.min_slot_distance_minutes ?? MIN_SLOT_DISTANCE_MINUTES, max: this.placeholderDefaults?.max_offset_minutes ?? 180 })}</span>
              </div>
              <div class="slots-header ${this.templateMode ? 'slots-header--no-time' : ''}">
                <div>${this.t('slot_editor.col_slot')}</div>
                <div>${this.t('slot_editor.col_start_type')}</div>
                <div>${this.t('slot_editor.col_value_offset')}</div>
                ${this.templateMode ? '' : html`<div>${this.t('slot_editor.col_time')}</div>`}
                <div>${this.t('slot_editor.col_scene_script')}</div>
                <div>${this.t('slot_editor.col_dynamic')}</div>
                <div></div>
              </div>

              ${orderedSlots.map(slot => {
                const isHighlighted = slot.id === this.highlightSlotId
                const editable = !this.isPrimaryChannel
                const invalidTime = slot.startType === 'fixed' && !this._isValidHHMM(slot.fixedStartTime)
                return html`
                  <div class="slot-edit-card ${isHighlighted ? 'highlighted' : ''} ${invalidTime ? 'invalid' : ''} ${this.templateMode ? 'slot-edit-card--no-time' : ''}">
                    <!-- Col 1: Icon/Dot + Label/Input -->
                    <div style="display:flex; align-items:center; gap:8px; min-width: 0;">
                      <div class="slot-edit-dot" style="background:${slot.color}"></div>
                      <div style="flex: 1; min-width: 0;">
                        ${editable
                          ? html`
                            <input
                              type="text"
                              class="sensor-input"
                              .value=${slot.label}
                              @input=${(e: Event) => {
                                const val = (e.target as HTMLInputElement).value
                                this._updateDraft(draft.map(s => s.id === slot.id ? { ...s, label: val } : s))
                              }}
                              placeholder=${this.t('slot_editor.slot_name_placeholder')}
                            />
                          `
                          : html`<div class="slot-edit-label" style="font-size:13px; font-weight:600">${slot.label}</div>`
                        }
                      </div>
                    </div>

                    <!-- Col 2: Start Type -->
                    <div>
                      <span class="mobile-label">${this.t('slot_editor.col_start_type')}</span>
                      ${editable
                        ? html`
                          <select
                            class="sensor-input"
                            @change=${(e: Event) => {
                              const val = (e.target as HTMLSelectElement).value as 'astral' | 'fixed'
                              this._updateDraft(draft.map(s => s.id === slot.id ? {
                                ...s,
                                startType: val,
                                startEvent: val === 'astral' ? 'civil_dawn' : undefined,
                                fixedStartTime: val === 'fixed' ? '12:00' : undefined,
                                startOffset: val === 'astral' ? 0 : undefined
                              } : s))
                            }}
                          >
                            <option value="fixed" ?selected=${(slot.startType || 'fixed') === 'fixed'}>${this.t('slot_editor.fixed_time')}</option>
                            <option value="astral" ?selected=${slot.startType === 'astral'}>${this.t('slot_editor.sun_event')}</option>
                          </select>
                        `
                        : html`
                          <select class="sensor-input" disabled style="opacity:0.6">
                            <option>${this.t('slot_editor.sun_event')}</option>
                          </select>
                        `
                      }
                    </div>

                    <!-- Col 3: Value / Offset -->
                    <div>
                      <span class="mobile-label">${this.t('slot_editor.col_value_offset')}</span>
                      ${slot.startType === 'fixed'
                        ? html`
                          <input
                            type="time"
                            class="sensor-input"
                            .value=${slot.fixedStartTime || '12:00'}
                            @change=${(e: Event) => {
                              const val = (e.target as HTMLInputElement).value
                              this._updateDraft(draft.map(s => s.id === slot.id ? { ...s, fixedStartTime: val } : s))
                            }}
                          />
                        `
                        : html`
                          <div style="display:flex; gap:6px;">
                            ${editable
                              ? html`
                                <select
                                  class="sensor-input"
                                  style="flex:1"
                                  @change=${(e: Event) => {
                                    const val = (e.target as HTMLSelectElement).value
                                    this._updateDraft(draft.map(s => s.id === slot.id ? { ...s, startEvent: val } : s))
                                  }}
                                >
                                  ${Object.entries(EVENT_LABEL_KEYS).map(([value, key]) => html`
                                    <option value=${value} ?selected=${(slot.startEvent || 'civil_dawn') === value}>${this.t(key)}</option>
                                  `)}
                                </select>
                              `
                              : html`<input class="sensor-input" style="flex:1; opacity:0.6" disabled .value=${(slot.startEvent && EVENT_LABEL_KEYS[slot.startEvent] ? this.t(EVENT_LABEL_KEYS[slot.startEvent]) : slot.startEvent) || ''} />`
                            }
                            <input
                              type="number"
                              class="sensor-input"
                              style="width:64px;"
                              .value=${String(slot.startOffset || 0)}
                              @input=${(e: Event) => {
                                const inputEl = e.target as HTMLInputElement
                                const raw = Number(inputEl.value)
                                if (Number.isNaN(raw)) return
                                const clamped = this._clampOffset(slot.id, raw, draft)
                                if (clamped !== raw) {
                                  inputEl.value = String(clamped)
                                }
                                this._updateDraft(draft.map(s => s.id === slot.id ? { ...s, startOffset: clamped } : s))
                              }}
                              placeholder=${this.t('slot_editor.offset_placeholder')}
                            />
                          </div>
                        `
                      }
                    </div>

                    ${this.templateMode ? '' : html`
                      <!-- Col 4: Time -->
                      <div>
                        <span class="mobile-label">${this.t('slot_editor.col_time')}</span>
                        <span class="slot-edit-time" style="font-size: 13px; font-family: monospace; font-weight: 500;">
                          ${minsToHHMM(slot.from)} → ${minsToHHMM(slot.to)}
                        </span>
                      </div>
                    `}

                    <!-- Col 5: Scene / Script -->
                    <div>
                      <span class="mobile-label">${this.t('slot_editor.col_scene_script')}</span>
                      <ha-entity-picker
                        .hass=${this.hass}
                        .value=${slot.scene ?? ''}
                        .includeDomains=${['scene', 'script']}
                        .entityFilter=${(e: any) => {
                          const entry = this.entities?.find(ent => ent.entity_id === e.entity_id)
                          if (entry?.scene_type === 'HUE_SMART_SCENE') return false
                          // Keep the already-configured scene visible even if it is
                          // unknown to the backend list (e.g. a stale entity_id).
                          if (currentSceneIds.has(e.entity_id)) return true
                          // No classification available: only scene entities the backend
                          // never listed reach this branch — hide them rather than risk
                          // showing an unfiltered Smart Scene.
                          if (!entry) return e.entity_id?.startsWith('script.') ?? false
                          return useFilter ? areaSceneIds.has(e.entity_id) : true
                        }}
                        allow-custom-entity
                        @value-changed=${(e: CustomEvent) => {
                          const newVal = e.detail.value || null
                          if (newVal !== slot.scene) {
                            this._setSlotScene(slot.id, newVal)
                          }
                        }}
                      ></ha-entity-picker>
                    </div>

                    <!-- Col 6: Dynamic (Hue scenes with a palette only) + Respect Off State -->
                    <div>
                      ${(() => {
                        if (!slot.scene || !slot.scene.startsWith('scene.')) return ''
                        const ent = this.entities?.find(e => e.entity_id === slot.scene)
                        if (!ent?.supports_dynamic) return ''

                        return html`
                          <span class="mobile-label">${this.t('slot_editor.col_dynamic')}</span>
                          <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">
                            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: var(--secondary-text-color);">
                              <input
                                type="checkbox"
                                style="width: 16px; height: 16px; cursor: pointer;"
                                .checked=${!!slot.hue_activate_dynamic}
                                @change=${(e: Event) => {
                                  const checked = (e.target as HTMLInputElement).checked
                                  this._updateDraft(draft.map(s => s.id === slot.id ? { ...s, hue_activate_dynamic: checked } : s))
                                }}
                              />
                              On
                            </label>
                            <input
                              type="number"
                              class="sensor-input"
                              style="width: 64px;"
                              min="0"
                              max="100"
                              ?disabled=${!slot.hue_activate_dynamic}
                              placeholder=${ent.scene_speed != null ? String(ent.scene_speed) : 'Speed'}
                              .value=${slot.hue_dynamic_speed !== undefined && slot.hue_dynamic_speed !== null ? String(slot.hue_dynamic_speed) : ''}
                              @input=${(e: Event) => {
                                const raw = (e.target as HTMLInputElement).value.trim()
                                const speed = raw === '' ? null : Math.min(100, Math.max(0, parseInt(raw, 10) || 0))
                                this._updateDraft(draft.map(s => s.id === slot.id ? { ...s, hue_dynamic_speed: speed } : s))
                              }}
                              title=${ent.scene_speed != null
                                ? `Speed of dynamic palette (0-100) — scene default: ${ent.scene_speed}`
                                : 'Speed of dynamic palette (0-100)'}
                            />
                          </div>
                        `
                      })()}
                    </div>

                    <!-- Col 7: Delete action -->
                    <div style="display: flex; justify-content: flex-end;">
                      ${editable
                        ? html`
                          <button
                            class="panel-close"
                            style="color: var(--error-color, #db4437); font-size:16px; padding: 4px;"
                            @click=${() => this._deleteSlot(slot.id)}
                            title=${this.t('slot_editor.delete_title')}
                            aria-label=${this.t('slot_editor.delete_title')}
                          >
                            ✕
                          </button>
                        `
                        : ''
                      }
                    </div>
                  </div>
                `
              })}

              ${!this.isPrimaryChannel ? (
                draft.length >= MAX_SLOTS_PER_CHANNEL
                  ? html`<button class="btn-add-slot" disabled>${this.t('slot_editor.max_slots_reached', { max: MAX_SLOTS_PER_CHANNEL })}</button>`
                  : html`<button class="btn-add-slot" @click=${this._addCustomSlot}>${this.t('slot_editor.add_slot')}</button>`
              ) : ''}
            </div>
          </div>

          <div class="panel-footer">
            ${this._hasInvalidSlot() ? html`
              <span style="flex:1; color:var(--error-color, #db4437); font-size:13px; align-self:center;">
                ${this.t('slot_editor.fix_invalid_times')}
              </span>
            ` : ''}
            <button class="btn-done" ?disabled=${this._hasInvalidSlot()} @click=${this._closeAndSave}>${this.t('area_lights_dialog.done')}</button>
          </div>
        </div>
      </div>
    `
  }
}
