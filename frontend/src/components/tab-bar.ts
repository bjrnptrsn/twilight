import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import type { HomeAssistant } from '../lib/types'
import { TwilightLocalizeMixin, type TranslationKey } from '../lib/i18n'

export type TabId = 'areas' | 'analytics' | 'timeline' | 'settings' | 'lab' | 'lab-two'

export interface TabConfig {
  id: TabId
  label: string;
}

@customElement('twilight-tab-bar')
export class TabBar extends TwilightLocalizeMixin(LitElement) {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: String }) activeTab: TabId = 'analytics'
  @property({ type: Array }) tabs: TabConfig[] = []

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('role', 'tablist')
  }

  static styles = css`
    :host {
      display: flex;
      gap: 0;
      flex-shrink: 0;
      white-space: nowrap;
    }
    .tab-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      color: var(--secondary-text-color);
      border: none;
      border-bottom: 2px solid transparent;
      padding: 0 16px;
      height: 56px;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: color 0.2s, border-color 0.2s;
    }
    .tab-btn:hover {
      color: var(--primary-text-color);
    }
    .tab-btn.active {
      color: var(--primary-text-color);
      border-bottom-color: var(--accent-color);
    }
  `

  render() {
    return this.tabs.map(
      (t) => html`
        <button
          class="tab-btn ${t.id === this.activeTab ? 'active' : ''}"
          role="tab"
          id="tab-${t.id}"
          aria-selected=${t.id === this.activeTab ? 'true' : 'false'}
          aria-controls="tabpanel-${t.id}"
          tabindex=${t.id === this.activeTab ? '0' : '-1'}
          @click=${() => this._handleTabClick(t.id)}
          @keydown=${(e: KeyboardEvent) => this._onKeydown(e, t.id)}
        >
          <span class="tab-label">${this._label(t)}</span>
        </button>
      `
    )
  }

  private _label(tab: TabConfig): string {
    const key = `nav.${tab.id}` as TranslationKey
    const translated = this.t(key)
    return translated === key ? tab.label : translated
  }

  private _handleTabClick(id: TabId) {
    this.dispatchEvent(new CustomEvent('tab-changed', {
      detail: id,
      bubbles: true,
      composed: true
    }))
  }

  /** WAI-ARIA Tabs pattern: Left/Right (and Home/End) move both the roving
   * tabindex and the active tab; only the active tab button is ever a Tab
   * stop, arrow keys move between tabs within the tablist. */
  private _onKeydown(e: KeyboardEvent, currentId: TabId) {
    const idx = this.tabs.findIndex(t => t.id === currentId)
    if (idx === -1) return

    let nextIdx: number | null = null
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % this.tabs.length
    else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + this.tabs.length) % this.tabs.length
    else if (e.key === 'Home') nextIdx = 0
    else if (e.key === 'End') nextIdx = this.tabs.length - 1
    else return

    e.preventDefault()
    const nextTab = this.tabs[nextIdx]
    this._handleTabClick(nextTab.id)
    this.updateComplete.then(() => {
      this.renderRoot.querySelector<HTMLElement>(`#tab-${nextTab.id}`)?.focus()
    })
  }
}
