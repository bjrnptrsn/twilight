import { html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { PortalDialog } from './dialogs'
import { dialogChromeStyles } from '../lib/shared-styles'
import { DialogController } from '../lib/dialog-controller'
import { globalExport, globalImport, globalDefaults, globalGet, globalSave } from '../lib/api'
import './reset-dialog'
import { type ResetTreeNode } from './reset-dialog'
import { getInputDisplayName } from '../lib/input-helpers'
import { getSensorDisplayName } from '../lib/sensor-helpers'
import type { HomeAssistant, BackupPayload, GlobalConfig, InputConfig, ActivityConfig, ChannelConfig, RuleConfig, SensorConfig } from '../lib/types'

@customElement('twilight-backup-restore-dialog')
export class TwilightBackupRestoreDialog extends PortalDialog {
  @property({ attribute: false }) hass: HomeAssistant | null = null
  @property({ type: Boolean }) open = false
  @property({ type: Boolean }) isDraftDirty = false

  @state() private _loading = false
  @state() private _error = ''
  @state() private _resetDialogOpen = false
  @state() private _resetNodes: ResetTreeNode[] = []
  @state() private _resetDefaults: GlobalConfig | null = null
  @state() private _resetCurrent: GlobalConfig | null = null

  private dialog = new DialogController(this)

  static styles = [
    dialogChromeStyles,
    css`
      .modal-card {
        max-width: 520px;
      }
      .actions-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 12px;
      }
      .action-card {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
        cursor: pointer;
        transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
      }
      .action-card:hover:not(.disabled) {
        background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
        border-color: color-mix(in srgb, var(--tp-accent, #e91e8c) 50%, transparent);
        transform: translateY(-1px);
      }
      .action-card.disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
      .action-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: color-mix(in srgb, var(--tp-accent, #e91e8c) 14%, transparent);
        color: var(--tp-accent, #e91e8c);
        border: 1px solid color-mix(in srgb, var(--tp-accent, #e91e8c) 25%, transparent);
        flex-shrink: 0;
      }
      .action-icon.restore {
        background: color-mix(in srgb, var(--warning-color, #ff9800) 14%, transparent);
        color: var(--warning-color, #ff9800);
        border-color: color-mix(in srgb, var(--warning-color, #ff9800) 25%, transparent);
      }
      .action-icon.danger {
        background: color-mix(in srgb, var(--error-color, #f44336) 14%, transparent);
        color: var(--error-color, #f44336);
        border-color: color-mix(in srgb, var(--error-color, #f44336) 25%, transparent);
      }
      .action-card.danger:hover:not(.disabled) {
        border-color: color-mix(in srgb, var(--error-color, #f44336) 50%, transparent);
      }
      .action-content {
        flex: 1;
      }
      .action-title {
        margin: 0 0 4px 0;
        font-size: 15px;
        font-weight: 600;
        color: var(--primary-text-color);
      }
      .action-desc {
        margin: 0;
        font-size: 13px;
        line-height: 1.4;
        color: var(--secondary-text-color);
      }
      .warning-banner {
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        background: rgba(255, 152, 0, 0.12);
        border: 1px solid rgba(255, 152, 0, 0.3);
        color: var(--warning-color, #ff9800);
        font-size: 13px;
      }
      .error-banner {
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 8px;
        background: rgba(244, 67, 54, 0.12);
        border: 1px solid rgba(244, 67, 54, 0.3);
        color: var(--error-color, #f44336);
        font-size: 13px;
      }
      input[type='file'] {
        display: none;
      }
    `
  ]

  private _onClose = () => {
    this._error = ''
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
  }

  private async _onDownloadBackup() {
    if (this._loading || !this.hass) return
    try {
      this._loading = true
      this._error = ''
      const data = await globalExport(this.hass)

      const d = new Date()
      const filename = `twilight-backup-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.json`

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err: unknown) {
      this._error = err instanceof Error ? err.message : this.t('backup_restore.err_export')
    } finally {
      this._loading = false
    }
  }

  private _onTriggerFileInput = () => {
    if (this._loading) return
    if (this.isDraftDirty) {
      this.dialog.showAlert(this.t('backup_restore.unsaved_changes_title'), this.t('backup_restore.unsaved_restore_desc'))
      return
    }
    const fileInput = this.shadowRoot?.querySelector('#restoreFileInput') as HTMLInputElement | null
    fileInput?.click()
  }

  private async _onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file || !this.hass) return

    input.value = ''

    try {
      this._loading = true
      this._error = ''
      const text = await file.text()
      let payload: BackupPayload
      try {
        payload = JSON.parse(text)
      } catch {
        await this.dialog.showAlert(this.t('backup_restore.invalid_file_title'), this.t('backup_restore.invalid_json_desc'))
        return
      }

      if (!payload || typeof payload !== 'object' || !payload.areas || typeof payload.areas !== 'object') {
        await this.dialog.showAlert(this.t('backup_restore.invalid_file_title'), this.t('backup_restore.invalid_structure_desc'))
        return
      }

      const areaCount = Object.keys(payload.areas).length
      const confirmed = await this.dialog.showConfirm(
        this.t('backup_restore.restore_confirm_title'),
        this.t('backup_restore.restore_confirm_desc', { count: areaCount })
      )

      if (!confirmed) return

      await globalImport(this.hass, payload)
      await this.dialog.showAlert(this.t('backup_restore.restore_complete_title'), this.t('backup_restore.restore_complete_desc'))
      window.location.reload()
    } catch (err: unknown) {
      this._error = err instanceof Error ? err.message : this.t('backup_restore.err_restore')
    } finally {
      this._loading = false
    }
  }

  private async _onResetSettings() {
    if (this._loading || !this.hass) return
    if (this.isDraftDirty) {
      await this.dialog.showAlert(this.t('backup_restore.unsaved_changes_title'), this.t('backup_restore.unsaved_reset_desc'))
      return
    }

    try {
      this._loading = true
      this._error = ''
      const [defaults, current] = await Promise.all([
        globalDefaults(this.hass),
        globalGet(this.hass)
      ])
      this._resetDefaults = defaults
      this._resetCurrent = current

      const tpl = defaults.area_template || {}
      this._resetNodes = [
        {
          id: 'template_inputs',
          label: this.t('backup_restore.tpl_inputs'),
          children: (tpl.inputs || []).map((inp: InputConfig) => {
            const act = (tpl.activities || []).find((a: ActivityConfig) => a.id === inp.activity)
            return {
              id: `template_inputs:${inp.id}`,
              label: `${getInputDisplayName(inp, this.hass)} — ${act?.name || act?.id || inp.activity}`
            }
          })
        },
        {
          id: 'template_activities',
          label: this.t('backup_restore.tpl_activities'),
          children: (tpl.activities || []).map((act: ActivityConfig) => ({
            id: `template_activities:${act.id}`,
            label: act.name || act.id
          }))
        },
        {
          id: 'template_channels',
          label: this.t('backup_restore.tpl_channels'),
          children: Object.entries(tpl.custom_channels || {}).map(([id, chan]: [string, ChannelConfig]) => ({
            id: `template_channels:${id}`,
            label: chan.name || id
          }))
        },
        {
          id: 'template_sensors',
          label: this.t('backup_restore.tpl_sensors'),
          children: (tpl.sensors || []).map((sensor: SensorConfig) => ({
            id: `template_sensors:${sensor.id}`,
            label: getSensorDisplayName(sensor, this.hass)
          }))
        },
        {
          id: 'template_primary',
          label: this.t('backup_restore.tpl_primary')
        },
        {
          id: 'template_rules',
          label: this.t('backup_restore.tpl_rules'),
          children: (tpl.rules || []).map((rule: RuleConfig) => ({
            id: `template_rules:${rule.id}`,
            label: rule.name || rule.id
          }))
        }
      ]

      this._resetDialogOpen = true
    } catch (err: unknown) {
      this._error = err instanceof Error ? err.message : this.t('backup_restore.err_defaults')
    } finally {
      this._loading = false
    }
  }

  private async _executeResetSettings(e: CustomEvent<{ selectedIds: string[] }>) {
    if (!this.hass || !this._resetDefaults) return
    const selected = new Set(e.detail.selectedIds)
    const tpl = this._resetDefaults.area_template || {}
    const currentTpl = this._resetCurrent?.area_template || {}

    // Deselecting an individual item leaves it untouched (kept from the
    // current template) — matches the Area Reset dialog's semantics: opting
    // out means "don't touch mine", not "delete it". Selecting the whole
    // category, however, replaces it wholesale like Area Reset does: items
    // with no template counterpart (e.g. a custom channel you added
    // yourself) are removed, not just the template's own items overwritten.
    const inputs = selected.has('template_inputs')
      ? (tpl.inputs || []).map(i => structuredClone(i))
      : [...(currentTpl.inputs || [])]
    if (!selected.has('template_inputs')) {
      ;(tpl.inputs || []).forEach(defInp => {
        if (!selected.has(`template_inputs:${defInp.id}`)) return
        const idx = inputs.findIndex(i => i.id === defInp.id)
        if (idx >= 0) inputs[idx] = structuredClone(defInp)
        else inputs.push(structuredClone(defInp))
      })
    }

    const activities = selected.has('template_activities')
      ? (tpl.activities || []).map(a => structuredClone(a))
      : [...(currentTpl.activities || [])]
    if (!selected.has('template_activities')) {
      ;(tpl.activities || []).forEach(defAct => {
        if (!selected.has(`template_activities:${defAct.id}`)) return
        const idx = activities.findIndex(a => a.id === defAct.id)
        if (idx >= 0) activities[idx] = structuredClone(defAct)
        else activities.push(structuredClone(defAct))
      })
    }

    const customChannels = selected.has('template_channels')
      ? Object.fromEntries(Object.entries(tpl.custom_channels || {}).map(([id, chan]) => [id, structuredClone(chan)]))
      : { ...(currentTpl.custom_channels || {}) }
    if (!selected.has('template_channels')) {
      Object.entries(tpl.custom_channels || {}).forEach(([id, chan]) => {
        if (selected.has(`template_channels:${id}`)) customChannels[id] = structuredClone(chan)
      })
    }

    const sensors = selected.has('template_sensors')
      ? (tpl.sensors || []).map(s => structuredClone(s))
      : [...(currentTpl.sensors || [])]
    if (!selected.has('template_sensors')) {
      ;(tpl.sensors || []).forEach(defSensor => {
        if (!selected.has(`template_sensors:${defSensor.id}`)) return
        const idx = sensors.findIndex(s => s.id === defSensor.id)
        if (idx >= 0) sensors[idx] = structuredClone(defSensor)
        else sensors.push(structuredClone(defSensor))
      })
    }

    const rules = selected.has('template_rules')
      ? (tpl.rules || []).map(r => structuredClone(r))
      : [...(currentTpl.rules || [])]
    if (!selected.has('template_rules')) {
      ;(tpl.rules || []).forEach(defRule => {
        if (!selected.has(`template_rules:${defRule.id}`)) return
        const idx = rules.findIndex(r => r.id === defRule.id)
        if (idx >= 0) rules[idx] = structuredClone(defRule)
        else rules.push(structuredClone(defRule))
      })
    }

    const newTemplate: GlobalConfig['area_template'] = {
      primary_slots: selected.has('template_primary')
        ? structuredClone(tpl.primary_slots || {})
        : structuredClone(currentTpl.primary_slots || {}),
      inputs,
      activities,
      custom_channels: customChannels,
      sensors,
      rules
    }

    this._resetDialogOpen = false

    try {
      this._loading = true
      this._error = ''
      await globalSave(this.hass, { area_template: newTemplate })
      await this.dialog.showAlert(this.t('backup_restore.reset_complete_title'), this.t('backup_restore.reset_complete_desc'))
      window.location.reload()
    } catch (err: unknown) {
      this._error = err instanceof Error ? err.message : this.t('backup_restore.err_reset')
    } finally {
      this._loading = false
    }
  }

  private async _onFactoryReset() {
    if (this._loading || !this.hass) return
    if (this.isDraftDirty) {
      await this.dialog.showAlert(this.t('backup_restore.unsaved_changes_title'), this.t('backup_restore.unsaved_factory_desc'))
      return
    }

    const confirmed = await this.dialog.showConfirm(
      this.t('backup_restore.factory_confirm_title'),
      this.t('backup_restore.factory_confirm_desc')
    )

    if (!confirmed) return

    try {
      this._loading = true
      this._error = ''
      await globalImport(this.hass, {
        twilight_backup_version: 1,
        areas: {},
        global: {}
      })
      await this.dialog.showAlert(this.t('backup_restore.factory_complete_title'), this.t('backup_restore.factory_complete_desc'))
      window.location.reload()
    } catch (err: unknown) {
      this._error = err instanceof Error ? err.message : this.t('backup_restore.err_factory')
    } finally {
      this._loading = false
    }
  }

  render() {
    if (!this.open) return html``

    return html`
      <div class="overlay" @click=${this._onClose}>
        <div class="modal-card" @click=${(e: Event) => e.stopPropagation()}>
          <div class="modal-header">
            <h3 class="modal-title">${this.t('backup_restore.title')}</h3>
            <button class="panel-close" aria-label=${this.t('common.close_panel')} @click=${this._onClose}>✕</button>
          </div>

          <div class="modal-body">
            <p style="margin: 0 0 16px 0; font-size: 14px; color: var(--secondary-text-color); line-height: 1.4;">
              ${this.t('backup_restore.desc')}
            </p>

            ${this.isDraftDirty
              ? html`
                  <div class="warning-banner">
                    ${this.t('backup_restore.unsaved_warning')}
                  </div>
                `
              : ''}
            ${this._error ? html`<div class="error-banner">❌ ${this._error}</div>` : ''}

            <div class="actions-container">
              <div class="action-card ${this._loading ? 'disabled' : ''}" @click=${this._onDownloadBackup}>
                <div class="action-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title">${this.t('backup_restore.download_title')}</div>
                  <div class="action-desc">${this.t('backup_restore.download_desc')}</div>
                </div>
              </div>

              <div class="action-card ${this._loading || this.isDraftDirty ? 'disabled' : ''}" @click=${this._onTriggerFileInput}>
                <div class="action-icon restore">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title">${this.t('backup_restore.restore_title')}</div>
                  <div class="action-desc">${this.t('backup_restore.restore_desc')}</div>
                </div>
              </div>

              <div class="action-card ${this._loading || this.isDraftDirty ? 'disabled' : ''}" @click=${this._onResetSettings}>
                <div class="action-icon restore">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title">${this.t('backup_restore.reset_title')}</div>
                  <div class="action-desc">${this.t('backup_restore.reset_desc')}</div>
                </div>
              </div>

              <div class="action-card danger ${this._loading || this.isDraftDirty ? 'disabled' : ''}" @click=${this._onFactoryReset}>
                <div class="action-icon danger">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </div>
                <div class="action-content">
                  <div class="action-title" style="color: var(--error-color, #f44336);">${this.t('backup_restore.factory_title')}</div>
                  <div class="action-desc">${this.t('backup_restore.factory_desc')}</div>
                </div>
              </div>
            </div>

            <input type="file" id="restoreFileInput" accept="application/json" @change=${this._onFileSelected} />
          </div>

          <div class="modal-footer">
            <button class="btn-cancel-dialog" @click=${this._onClose} ?disabled=${this._loading}>
              ${this.t('backup_restore.close')}
            </button>
          </div>
        </div>
      </div>

      <twilight-alert-dialog
        .hass=${this.hass}
        .open=${this.dialog.alertOpen}
        .dialogTitle=${this.dialog.alertTitle}
        .message=${this.dialog.alertMessage}
        @close=${this.dialog._onCloseAlert}
      ></twilight-alert-dialog>

      <twilight-confirm-dialog
        .hass=${this.hass}
        .open=${this.dialog.confirmOpen}
        .dialogTitle=${this.dialog.confirmTitle}
        .message=${this.dialog.confirmMessage}
        @confirm=${this.dialog._onConfirm}
        @cancel=${this.dialog._onCancelConfirm}
      ></twilight-confirm-dialog>

      <twilight-reset-dialog
        .open=${this._resetDialogOpen}
        title=${this.t('backup_restore.reset_title')}
        description=${this.t('backup_restore.reset_dialog_desc')}
        .nodes=${this._resetNodes}
        @confirm=${this._executeResetSettings}
        @cancel=${() => { this._resetDialogOpen = false }}
      ></twilight-reset-dialog>
    `
  }
}
