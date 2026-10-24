import { describe, it, expect, vi } from 'vitest'
import { customElement } from 'lit/decorators.js'
import { TwilightPanelBase } from '../panel-base'
import '../components/tab-bar'
import '../views/areas-view'

/**
 * Tab-switch lifecycle:
 * - The areas view is keep-alive: panel-base keeps it mounted and toggles an
 *   `active` class instead of unmounting, so its live state and any open
 *   area-detail draft survive a tab switch untouched — no discard dialog.
 * - The settings view still unmounts on a tab switch (plain conditional
 *   render), silently discarding an unsaved DraftController draft — the back
 *   button had its own confirm guard, the tab bar had none. TwilightPanelBase
 *   asks the active view (via a `hasUnsavedChanges` getter) before committing
 *   a tab switch.
 */

@customElement('twilight-panel-test')
class TestPanel extends TwilightPanelBase {
  constructor() {
    super()
    this.tabs = [
      { id: 'areas', label: 'Areas' },
      { id: 'settings', label: 'Settings' },
      { id: 'timeline', label: 'Timeline' },
    ]
  }
}

async function mountPanel(): Promise<TestPanel> {
  const el = document.createElement('twilight-panel-test') as TestPanel
  document.body.appendChild(el)
  await el.updateComplete
  return el
}

/** Stubs querySelector(tag) to return a fake element with the given
 *  hasUnsavedChanges value, so the draft-view lookup in panel-base.ts
 *  doesn't need a real settings-view mounted underneath. */
function stubDraftView(panel: TestPanel, tag: string, hasUnsavedChanges: boolean) {
  const fake = document.createElement('div')
  ;(fake as any).hasUnsavedChanges = hasUnsavedChanges
  vi.spyOn(panel, 'querySelector').mockImplementation((sel: string) =>
    sel === tag ? (fake as any) : null
  )
}

describe('TwilightPanelBase tab switch', () => {
  it('switches immediately when the active view has no unsaved changes', async () => {
    const panel = await mountPanel()

    await (panel as any)._onTabChanged(new CustomEvent('tab-changed', { detail: 'timeline' }))

    expect((panel as any)._activeTab).toBe('timeline')
  })

  it('keeps the areas view mounted across a tab switch (keep-alive)', async () => {
    const panel = await mountPanel()
    const areasView = panel.querySelector('twilight-areas-view')
    expect(areasView).not.toBeNull()

    await (panel as any)._onTabChanged(new CustomEvent('tab-changed', { detail: 'timeline' }))

    expect(panel.querySelector('twilight-areas-view')).toBe(areasView)
    expect((areasView as any).active).toBe(false)
    // The switched-to view mounts fresh as before.
    expect(panel.querySelector('twilight-timeline-view')).not.toBeNull()
  })

  it('blocks the settings tab switch until the user confirms discarding unsaved changes', async () => {
    const panel = await mountPanel()
    ;(panel as any)._activeTab = 'settings'
    stubDraftView(panel, 'twilight-settings-view', true)

    const showConfirmSpy = vi
      .spyOn((panel as any)._dialog, 'showConfirm')
      .mockResolvedValue(false)

    await (panel as any)._onTabChanged(new CustomEvent('tab-changed', { detail: 'timeline' }))

    expect(showConfirmSpy).toHaveBeenCalled()
    // User declined to discard — tab must not have switched.
    expect((panel as any)._activeTab).toBe('settings')
  })

  it('switches away from settings after the user confirms discarding unsaved changes', async () => {
    const panel = await mountPanel()
    ;(panel as any)._activeTab = 'settings'
    stubDraftView(panel, 'twilight-settings-view', true)

    vi.spyOn((panel as any)._dialog, 'showConfirm').mockResolvedValue(true)

    await (panel as any)._onTabChanged(new CustomEvent('tab-changed', { detail: 'areas' }))

    expect((panel as any)._activeTab).toBe('areas')
  })
})
