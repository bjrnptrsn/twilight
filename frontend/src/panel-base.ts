import { LitElement, html } from 'lit'
import { property, state } from 'lit/decorators.js'
import './components/tab-bar'
import './components/dialogs'
import type { TabConfig, TabId } from './components/tab-bar'
import type { GlobalConfig, HomeAssistant } from './lib/types'
import { preloadHaComponents } from './lib/utils'
import { DialogController } from './lib/dialog-controller'
import { TwilightLocalizeMixin } from './lib/i18n'

export class TwilightPanelBase extends TwilightLocalizeMixin(LitElement) {
  connectedCallback() {
    super.connectedCallback()
    preloadHaComponents()
  }
  createRenderRoot() {
    return this
  }

  @property({ type: Boolean }) narrow = false
  @property({ type: Array }) tabs: TabConfig[] = []
  @property({ type: Object }) panel: { url_path?: string } | null = null

  @state() protected _activeTab: TabId = 'areas'
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @state() protected _globalConfigOverride: GlobalConfig | null = null

  private _dialog = new DialogController(this)

  // Tag name of the view element hosting a DraftController-backed draft for
  // each tab that can have one. A plain conditional render unmounts the
  // previously active view on a tab switch with no lifecycle hook of its own
  // to warn, so panel-base must ask before switching away from one of these.
  // The areas view is exempt: it stays mounted (keep-alive) across tab
  // switches, so its draft survives a switch without any guard.
  private static readonly DRAFT_VIEW_TAG: Partial<Record<TabId, string>> = {
    settings: 'twilight-settings-view',
  }

  /** True if the currently active tab's view has unsaved changes that a tab
   *  switch would silently discard. */
  private get _activeViewHasUnsavedChanges(): boolean {
    const tag = TwilightPanelBase.DRAFT_VIEW_TAG[this._activeTab]
    if (!tag) return false
    const view = this.querySelector(tag) as
      | (HTMLElement & { hasUnsavedChanges?: boolean })
      | null
    return view?.hasUnsavedChanges ?? false
  }

  private _onTabChanged = async (e: CustomEvent<TabId>) => {
    const nextTab = e.detail
    if (nextTab === this._activeTab) return
    if (this._activeViewHasUnsavedChanges) {
      const proceed = await this._dialog.showConfirm(
        this.t('area_detail.discard_changes'),
        this.t('area_detail.discard_changes_desc')
      )
      if (!proceed) return
    }
    this._activeTab = nextTab
  }

  render() {
    return html`
      <style>
        twilight-panel, twilight-dev-panel {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: var(--secondary-background-color);
          color: var(--primary-text-color);
          --font-family: var(--ha-font-family, var(--paper-font-body1_-_font-family, system-ui, sans-serif));
          font-family: var(--font-family);
          --tp-accent: var(--accent-color, #e91e8c);
          --tp-border: var(--divider-color, rgba(255,255,255,0.1));
        }

        twilight-panel *, twilight-dev-panel * { box-sizing: border-box; }

        .tp-header {
          background: var(--secondary-background-color);
          flex-shrink: 0;
          z-index: 10;
        }

        .tp-header-inner {
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 32px;
          height: 56px;
        }

        .tp-menu-btn-wrap {
          margin: 0 -20px;
        }

        .tp-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 500;
          white-space: nowrap;
          color: var(--primary-text-color);
        }

        .tp-title-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          object-fit: cover;
        }

        .tp-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
          padding: 2px 8px;
          border-radius: 12px;
          border: 1.5px solid #e04f32;
          color: #e04f32;
          background: rgba(224, 79, 50, 0.1);
          line-height: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          margin-left: 4px;
          margin-top: -2px;
          box-shadow: 0 0 6px rgba(224, 79, 50, 0.15);
        }

        .tp-badge-version {
          display: none;
        }

        .tp-tabs {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: flex-end;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tp-tabs::-webkit-scrollbar { display: none; }

        .tp-content {
          flex: 1;
          min-height: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .view-container {
          display: none;
          flex: 1;
          min-height: 0;
        }

        .view-container.active {
          display: flex;
          flex-direction: column;
          flex: 1;
          height: 100%;
          min-height: 0;
        }
      </style>

      <div class="tp-header">
        <div class="tp-header-inner">
          ${this.narrow ? html`<div class="tp-menu-btn-wrap"><ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button></div>` : html`
          <div class="tp-title">
            <img class="tp-title-icon" src="/twilight/logo.png" alt="Twilight">
            <span>Twilight</span>
            ${this.panel?.url_path === 'twilight_dev' ? html`<span class="tp-badge tp-badge-dev">dev</span>` : html`<span class="tp-badge tp-badge-version">${__TWILIGHT_VERSION__}</span>`}
          </div>`}
          <div class="tp-tabs">
            <twilight-tab-bar
              .hass=${this.hass}
              .activeTab=${this._activeTab}
              .tabs=${this.tabs}
              @tab-changed=${this._onTabChanged}
            ></twilight-tab-bar>
          </div>
        </div>
      </div>
      <div class="tp-content">
        ${this._renderViews()}
      </div>
      <twilight-confirm-dialog
        .hass=${this.hass}
        .open=${this._dialog.confirmOpen}
        .dialogTitle=${this._dialog.confirmTitle}
        .message=${this._dialog.confirmMessage}
        @confirm=${this._dialog._onConfirm}
        @cancel=${this._dialog._onCancelConfirm}
      ></twilight-confirm-dialog>
    `
  }

  protected _renderViews() {
    const active = this._activeTab
    return html`
      ${this._isTabAvailable('areas') ? html`
        <twilight-areas-view
          id="tabpanel-areas"
          role="tabpanel"
          aria-labelledby="tab-areas"
          class="view-container ${active === 'areas' ? 'active' : ''}"
          .active=${active === 'areas'}
          .hass=${this.hass}
          .globalConfigOverride=${this._globalConfigOverride}
        ></twilight-areas-view>
      ` : ''}
      ${active === 'analytics' && this._isTabAvailable('analytics') ? html`
        <twilight-analytics-view
          id="tabpanel-analytics"
          role="tabpanel"
          aria-labelledby="tab-analytics"
          class="view-container active"
          .hass=${this.hass}
        ></twilight-analytics-view>
      ` : ''}
      ${active === 'timeline' && this._isTabAvailable('timeline') ? html`
        <twilight-timeline-view
          id="tabpanel-timeline"
          role="tabpanel"
          aria-labelledby="tab-timeline"
          class="view-container active"
          .hass=${this.hass}
        ></twilight-timeline-view>
      ` : ''}
      ${active === 'settings' && this._isTabAvailable('settings') ? html`
        <twilight-settings-view
          id="tabpanel-settings"
          role="tabpanel"
          aria-labelledby="tab-settings"
          class="view-container active"
          .hass=${this.hass}
          @global-changed=${this._onGlobalChanged}
        ></twilight-settings-view>
      ` : ''}
      ${active === 'lab' && this._isTabAvailable('lab') ? html`
        <twilight-lab-view
          id="tabpanel-lab"
          role="tabpanel"
          aria-labelledby="tab-lab"
          class="view-container active"
          .hass=${this.hass}
        ></twilight-lab-view>
      ` : ''}
      ${active === 'lab-two' && this._isTabAvailable('lab-two') ? html`
        <twilight-lab-two-view
          id="tabpanel-lab-two"
          role="tabpanel"
          aria-labelledby="tab-lab-two"
          class="view-container active"
          .hass=${this.hass}
        ></twilight-lab-two-view>
      ` : ''}
    `
  }

  private _isTabAvailable(id: TabId): boolean {
    return this.tabs.some(t => t.id === id)
  }

  private _onGlobalChanged(e: CustomEvent) {
    this._globalConfigOverride = e.detail
  }
}
