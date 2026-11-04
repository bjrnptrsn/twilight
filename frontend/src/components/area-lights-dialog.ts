import { html, css, nothing, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import type { ExtractedLightGroup } from '../lib/light-groups'
import { dialogChromeStyles } from '../lib/shared-styles'
import type { TranslationKey } from '../lib/i18n'
import { PortalDialog } from './dialogs'

const SCENE_TYPE_KEYS: Record<string, TranslationKey> = {
  plain_scene: 'area_lights_dialog.type_scene',
  hue_scene: 'area_lights_dialog.type_hue_scene',
  hue_smart_scene: 'area_lights_dialog.type_hue_scene',
  script: 'area_lights_dialog.type_script',
}

/** Shows what the engine read out of the slots' scenes: one slot per channel,
 *  the running one until another is picked. */
@customElement('twilight-area-lights-dialog')
export class TwilightAreaLightsDialog extends PortalDialog {
  @property({ type: Boolean }) open = false
  @property({ attribute: false }) groups: ExtractedLightGroup[] = []
  @property({ attribute: false }) activeSlots: Record<string, string> = {}

  // channel id -> slot picked by hand; a channel without an entry follows its active slot
  @state() private _pickedSlots: Record<string, string> = {}

  static styles = [
    dialogChromeStyles,
    css`
      :host {
        display: contents;
      }

      .hint {
        font-size: 13px;
        font-style: italic;
        color: var(--secondary-text-color);
      }

      /* --columns is the most that may sit side by side; a narrow window wraps earlier. */
      .channels {
        display: grid;
        grid-template-columns: repeat(
          auto-fit,
          minmax(min(100%, max(440px, calc((100% - (var(--columns) - 1) * 32px) / var(--columns)))), 1fr)
        );
        gap: 24px 32px;
        align-items: start;
      }

      .channel-name {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.9px;
        color: var(--secondary-text-color);
        padding-bottom: 6px;
      }

      select {
        width: 100%;
        margin-bottom: 10px;
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid var(--divider-color, color-mix(in srgb, var(--primary-text-color) 15%, transparent));
        border-radius: 4px;
        color: var(--primary-text-color);
        padding: 6px 10px;
        font-size: 13px;
        outline: none;
      }

      /* One grid for the scene and its lamps, so the columns line up across rows. */
      .lights {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto auto;
        align-items: center;
        gap: 6px 8px;
        font-size: 13px;
      }

      .row {
        display: contents;
      }

      .row.scene .row-name {
        font-weight: 600;
      }

      .scene-divider {
        grid-column: 1 / -1;
        height: 1px;
        background: color-mix(in srgb, var(--primary-text-color, #fff) 8%, transparent);
      }

      .row-name,
      .row-id {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .row-id {
        font-size: 11px;
        font-family: monospace;
        color: var(--secondary-text-color);
      }

      .badge {
        justify-self: start;
        font-size: 10px;
        font-weight: 600;
        padding: 1px 6px;
        border-radius: 4px;
        white-space: nowrap;
        color: var(--primary-text-color);
        background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      }

      .badge.scene {
        background: color-mix(in srgb, var(--info-color, #2196f3) 30%, transparent);
      }

      .badge.dynamic {
        background: color-mix(in srgb, #ab47bc 30%, transparent);
      }
    `
  ]

  protected willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('open') && this.open) {
      this._pickedSlots = {}
    }
  }

  private _closeDialog() {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }

  private get _channels(): ExtractedLightGroup[][] {
    const channels = new Map<string, ExtractedLightGroup[]>()
    for (const group of this.groups) {
      channels.set(group.channelId, [...(channels.get(group.channelId) ?? []), group])
    }
    return [...channels.values()]
  }

  private _shownGroup(groups: ExtractedLightGroup[]): ExtractedLightGroup {
    const channelId = groups[0].channelId
    const slotId = this._pickedSlots[channelId] ?? this.activeSlots[channelId]
    return groups.find(g => g.slotId === slotId) ?? groups[0]
  }

  private _renderChannel(groups: ExtractedLightGroup[]) {
    const group = this._shownGroup(groups)
    const typeKey = SCENE_TYPE_KEYS[group.sceneType]
    const activeSlot = this.activeSlots[group.channelId]
    return html`
      <div>
        <div class="channel-name">${group.channelName}</div>
        <select
          aria-label=${group.channelName}
          @change=${(e: Event) => {
            this._pickedSlots = { ...this._pickedSlots, [group.channelId]: (e.target as HTMLSelectElement).value }
          }}
        >
          ${groups.map(g => html`
            <option value=${g.slotId} ?selected=${g.slotId === group.slotId}>
              ${g.slotLabel}${g.slotId === activeSlot ? ` · ${this.t('area_lights_dialog.current_slot')}` : ''}
            </option>
          `)}
        </select>
        <div class="lights">
          <div class="row scene">
            <span class="row-name" title=${group.sceneName}>${group.sceneName}</span>
            <span class="row-id" title=${group.sceneEntityId}>${group.sceneEntityId}</span>
            ${typeKey ? html`<span class="badge scene">${this.t(typeKey)}</span>` : html`<span></span>`}
            ${group.supportsDynamic ? html`<span class="badge dynamic">${this.t('area_lights_dialog.dynamic')}</span>` : html`<span></span>`}
          </div>
          <div class="scene-divider"></div>
          ${group.rows.map(row => html`
            <div class="row">
              <span class="row-name" title=${row.name}>${row.name}</span>
              <span class="row-id" title=${row.entity_id}>${row.entity_id}</span>
              <span class="badge">${row.domain}</span>
              ${row.dynamic ? html`<span class="badge dynamic">${this.t('area_lights_dialog.dynamic')}</span>` : html`<span></span>`}
            </div>
          `)}
        </div>
        ${group.rows.length === 0 ? html`<div class="hint">${this.t('area_lights_dialog.no_lights_in_slot')}</div>` : ''}
      </div>
    `
  }

  render() {
    if (!this.open) return nothing

    const channels = this._channels
    // Two and four channels pair up instead of leaving one alone in a second row.
    const columns = channels.length === 2 || channels.length === 4 ? 2 : 3

    return html`
      <div class="overlay" @click=${(e: Event) => { if (e.target === e.currentTarget) this._closeDialog() }}>
        <div
          class="edit-panel"
          style="max-width: 1500px;"
          role="dialog"
          aria-modal="true"
          aria-labelledby=${this._titleId}
          @keydown=${this._onDialogKeydown}
        >
          <div class="panel-header">
            <span class="panel-header-title" id=${this._titleId} role="heading" aria-level="2">${this.t('area_lights_dialog.title')}</span>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._closeDialog}>✕</button>
          </div>

          <div class="panel-body">
            ${this.groups.length === 0
              ? html`<div class="hint">${this.t('area_lights_dialog.no_extraction')}</div>`
              : html`<div class="channels" style="--columns: ${columns};">${channels.map(groups => this._renderChannel(groups))}</div>`}
          </div>

          <div class="panel-footer">
            <button class="btn-save-dialog" @click=${this._closeDialog}>${this.t('area_lights_dialog.done')}</button>
          </div>
        </div>
      </div>
    `
  }
}
