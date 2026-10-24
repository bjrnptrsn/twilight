import { describe, it, expect, vi } from 'vitest'
import '../components/activity-row-editor'
import { activityToDraft } from '../components/activity-row-editor'
import type { ActivityConfig } from '../lib/types'

async function makeEl() {
  const el = document.createElement('twilight-activity-row-editor') as any
  document.body.appendChild(el)
  await el.updateComplete
  return el
}

function makeSlotActivity(): ActivityConfig {
  return {
    id: 'evening_relax',
    name: 'Evening Relax',
    suppress_inputs: [],
    auto_expire_enabled: true,
    auto_expire: null,
    action: {
      type: 'slot',
      respect_manual_off: true,
    },
    release_action: { type: 'none' },
    transition_off_seconds: null,
  } as ActivityConfig
}

describe('activityToDraft', () => {
  it('seeds action_respect_manual_off from a SlotAction', () => {
    const draft = activityToDraft(makeSlotActivity())
    expect(draft.action_respect_manual_off).toBe(true)
  })

  it('defaults respect_manual_off to false when unset', () => {
    const activity = makeSlotActivity()
    delete (activity.action as any).respect_manual_off
    const draft = activityToDraft(activity)
    expect(draft.action_respect_manual_off).toBe(false)
  })
})

describe('twilight-activity-row-editor save roundtrip', () => {
  it('round-trips respect_manual_off through edit -> save for SlotAction', async () => {
    const el = await makeEl()
    const activity = makeSlotActivity()
    el.activity = activity
    el.editIndex = 0
    el.open = true
    await el.updateComplete

    // Edit draft as the UI inputs would.
    el._editDraft = { ...el._editDraft, action_respect_manual_off: true }
    await el.updateComplete

    const onSave = vi.fn()
    el.addEventListener('save', onSave)
    el._save()

    expect(onSave).toHaveBeenCalledTimes(1)
    const saved: ActivityConfig = onSave.mock.calls[0][0].detail
    expect(saved.action?.respect_manual_off).toBe(true)
    el.remove()
  })

  it('omits respect_manual_off when set to false', async () => {
    const el = await makeEl()
    const activity = makeSlotActivity()
    el.activity = activity
    el.editIndex = 0
    el.open = true
    await el.updateComplete

    el._editDraft = { ...el._editDraft, action_respect_manual_off: false }
    await el.updateComplete

    const onSave = vi.fn()
    el.addEventListener('save', onSave)
    el._save()

    const saved: ActivityConfig = onSave.mock.calls[0][0].detail
    expect(saved.action?.respect_manual_off).toBeUndefined()
    el.remove()
  })
})
