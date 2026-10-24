import { describe, it, expect, vi } from 'vitest'
import '../components/slot-editor'
import type { Slot } from '../lib/types'

async function makeEl() {
  const el = document.createElement('twilight-slot-editor') as any
  document.body.appendChild(el)
  await el.updateComplete
  return el
}

function makeSlots(): Slot[] {
  return [
    {
      id: 'civil_dawn', label: 'Civil Dawn', color: '#111', from: 300, to: 340,
      scene: 'scene.morning', isCustom: false, startType: 'astral', startEvent: 'civil_dawn', startOffset: 0,
    },
    {
      id: 'day', label: 'Day', color: '#fff', from: 340, to: 1000,
      scene: null, isCustom: false, startType: 'astral', startEvent: 'day', startOffset: 0,
    },
  ]
}

describe('twilight-slot-editor', () => {
  it('renders nothing while closed', async () => {
    const el = await makeEl()
    expect(el.shadowRoot!.querySelector('.overlay')).toBeNull()
    el.remove()
  })

  it('seeds the draft with a clone of `slots` on open (willUpdate)', async () => {
    const el = await makeEl()
    const slots = makeSlots()
    el.slots = slots
    el.open = true
    await el.updateComplete

    expect(el._draft).toEqual(slots)
    expect(el._draft).not.toBe(slots)
    el.remove()
  })

  it('closing without edits does not dispatch slots-changed (dirty check)', async () => {
    const el = await makeEl()
    el.slots = makeSlots()
    el.open = true
    await el.updateComplete

    const onChanged = vi.fn()
    el.addEventListener('slots-changed', onChanged)
    el.shadowRoot!.querySelector('.btn-done')!.dispatchEvent(new Event('click', { bubbles: true }))

    expect(onChanged).not.toHaveBeenCalled()
    el.remove()
  })

  it('closing after adding a custom slot dispatches slots-changed with the new slot', async () => {
    const el = await makeEl()
    el.slots = makeSlots()
    el.isPrimaryChannel = false
    el.open = true
    await el.updateComplete

    el._addCustomSlot()
    await el.updateComplete

    const onChanged = vi.fn()
    el.addEventListener('slots-changed', onChanged)
    el.shadowRoot!.querySelector('.btn-done')!.dispatchEvent(new Event('click', { bubbles: true }))

    expect(onChanged).toHaveBeenCalledTimes(1)
    const detail = onChanged.mock.calls[0][0].detail
    expect(detail.slots).toHaveLength(3)
    expect(detail.slots[2].isCustom).toBe(true)
    el.remove()
  })

  it('does not add a slot beyond MAX_SLOTS_PER_CHANNEL', async () => {
    const el = await makeEl()
    const many = Array.from({ length: 10 }, (_, i) => ({
      id: `s${i}`, label: `Slot ${i}`, color: '#000', from: i * 60, to: i * 60 + 30,
      scene: null, isCustom: true, startType: 'fixed' as const, fixedStartTime: '12:00',
    }))
    el.slots = many
    el.isPrimaryChannel = false
    el.open = true
    await el.updateComplete

    el._addCustomSlot()
    await el.updateComplete

    expect(el._draft).toHaveLength(10)
    el.remove()
  })

  it('deletes a slot from the draft, not from the `slots` prop', async () => {
    const el = await makeEl()
    const slots = makeSlots()
    el.slots = slots
    el.open = true
    await el.updateComplete

    el._deleteSlot('day')
    await el.updateComplete

    expect(el._draft.map((s: Slot) => s.id)).toEqual(['civil_dawn'])
    expect(slots).toHaveLength(2)
    el.remove()
  })

  it('flags a fixed slot with an invalid HH:MM time and blocks Done', async () => {
    const el = await makeEl()
    el.slots = [{
      id: 'bad', label: 'Bad', color: '#000', from: 0, to: 60,
      scene: null, isCustom: true, startType: 'fixed', fixedStartTime: '25:99',
    }]
    el.open = true
    await el.updateComplete

    const btn = el.shadowRoot!.querySelector('.btn-done') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    expect(el.shadowRoot!.querySelector('.slot-edit-card.invalid')).not.toBeNull()
    el.remove()
  })

  it('discarding (overlay click) drops draft edits and does not dispatch slots-changed', async () => {
    const el = await makeEl()
    const slots = makeSlots()
    el.slots = slots
    el.isPrimaryChannel = false
    el.open = true
    await el.updateComplete

    el._addCustomSlot()
    await el.updateComplete

    const onChanged = vi.fn()
    const onClose = vi.fn()
    el.addEventListener('slots-changed', onChanged)
    el.addEventListener('close', onClose)

    const overlay = el.shadowRoot!.querySelector('.overlay')! as HTMLElement
    overlay.click()

    expect(onChanged).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(el._draft).toBeNull()
    el.remove()
  })

  it('_clampOffset keeps consecutive astral slots at least min_slot_distance_minutes apart', async () => {
    const el = await makeEl()
    el.placeholderDefaults = { min_slot_distance_minutes: 10, max_offset_minutes: 180, transition_on_seconds: 60 }
    const draft = makeSlots() // civil_dawn offset 0, day offset 0
    // Pushing civil_dawn's offset above day's offset + min distance must clamp.
    const clamped = el._clampOffset('civil_dawn', 500, draft)
    expect(clamped).toBe(10)
    el.remove()
  })

  it('_clampOffset respects max_offset_minutes', async () => {
    const el = await makeEl()
    el.placeholderDefaults = { min_slot_distance_minutes: 10, max_offset_minutes: 180, transition_on_seconds: 60 }
    const draft = [{
      id: 'only', label: 'Only', color: '#000', from: 0, to: 60,
      scene: null, isCustom: false, startType: 'astral' as const, startEvent: 'day', startOffset: 0,
    }]
    expect(el._clampOffset('only', 500, draft)).toBe(180)
    expect(el._clampOffset('only', -500, draft)).toBe(-180)
    el.remove()
  })

  it('re-opening after transitionOnSeconds changed re-seeds the transition draft', async () => {
    const el = await makeEl()
    el.slots = makeSlots()
    el.transitionOnSeconds = 30
    el.open = true
    await el.updateComplete
    expect(el._draftTransitionOnSeconds).toBe(30)

    el.open = false
    await el.updateComplete
    el.transitionOnSeconds = 90
    el.open = true
    await el.updateComplete

    expect(el._draftTransitionOnSeconds).toBe(90)
    el.remove()
  })

  it('the Primary channel hides delete buttons (not editable)', async () => {
    const el = await makeEl()
    el.slots = makeSlots()
    el.isPrimaryChannel = true
    el.open = true
    await el.updateComplete

    const deleteButtons = el.shadowRoot!.querySelectorAll('.slot-edit-card button[title="Delete"]')
    expect(deleteButtons.length).toBe(0)
    el.remove()
  })
})
