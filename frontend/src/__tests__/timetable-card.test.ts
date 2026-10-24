import { describe, it, expect, vi } from 'vitest'
import '../components/timetable-card'
import type { Slot, ChannelConfig } from '../lib/types'

async function makeEl() {
  const el = document.createElement('twilight-timetable-card') as any
  document.body.appendChild(el)
  await el.updateComplete
  return el
}

function makeSlots(): Slot[] {
  return [
    { id: 'day', label: 'Day', color: '#fff', from: 360, to: 1080, scene: 'scene.day' },
    { id: 'night', label: 'Night', color: '#003', from: 1080, to: 360, scene: null },
  ]
}

function makeChannels(): Record<string, ChannelConfig> {
  return {
    primary: { name: 'Primary', enabled: true, slots: [] },
    kitchen: { name: 'Kitchen', enabled: true, slots: [] },
  }
}

describe('twilight-timetable-card', () => {
  it('renders a channel tab per channel, Primary first', async () => {
    const el = await makeEl()
    el.channels = makeChannels()
    el.selectedChannelId = 'primary'
    await el.updateComplete

    const tabs = [...el.shadowRoot!.querySelectorAll('.channel-tab')] as HTMLElement[]
    expect(tabs.map(t => t.textContent)).toEqual(['Primary', 'Kitchen'])
    expect(tabs[0].classList.contains('active')).toBe(true)
    el.remove()
  })

  it('clicking a channel tab dispatches channel-selected', async () => {
    const el = await makeEl()
    el.channels = makeChannels()
    el.selectedChannelId = 'primary'
    await el.updateComplete

    const onSelected = vi.fn()
    el.addEventListener('channel-selected', onSelected)
    const tabs = [...el.shadowRoot!.querySelectorAll('.channel-tab')] as HTMLElement[]
    tabs[1].click()

    expect(onSelected).toHaveBeenCalledTimes(1)
    expect(onSelected.mock.calls[0][0].detail).toEqual({ channelId: 'kitchen' })
    el.remove()
  })

  it('marks a disabled custom channel with the disabled class', async () => {
    const el = await makeEl()
    el.channels = {
      primary: { name: 'Primary', enabled: true, slots: [] },
      garage: { name: 'Garage', enabled: false, slots: [] },
    }
    el.selectedChannelId = 'primary'
    await el.updateComplete

    const tabs = [...el.shadowRoot!.querySelectorAll('.channel-tab')] as HTMLElement[]
    expect(tabs[1].classList.contains('disabled')).toBe(true)
    el.remove()
  })

  it('kebab menu is closed by default and opens on click', async () => {
    const el = await makeEl()
    el.channels = makeChannels()
    await el.updateComplete
    expect(el.shadowRoot!.querySelector('.dropdown-menu')).toBeNull()

    el.shadowRoot!.querySelector('.edit-btn')!.dispatchEvent(new Event('click', { bubbles: true }))
    await el.updateComplete
    expect(el.shadowRoot!.querySelector('.dropdown-menu')).not.toBeNull()
    el.remove()
  })

  it('a click outside the kebab closes the menu', async () => {
    const el = await makeEl()
    el.channels = makeChannels()
    await el.updateComplete

    el._menuOpen = true
    await el.updateComplete
    expect(el.shadowRoot!.querySelector('.dropdown-menu')).not.toBeNull()

    document.body.click()
    await el.updateComplete
    expect(el.shadowRoot!.querySelector('.dropdown-menu')).toBeNull()
    el.remove()
  })

  it('"Add channel" is disabled once MAX_CUSTOM_CHANNELS is reached', async () => {
    const el = await makeEl()
    el.channels = {
      primary: { name: 'Primary', enabled: true, slots: [] },
      c1: { name: 'C1', enabled: true, slots: [] },
      c2: { name: 'C2', enabled: true, slots: [] },
      c3: { name: 'C3', enabled: true, slots: [] },
    }
    el.selectedChannelId = 'primary'
    el._menuOpen = true
    await el.updateComplete

    const items = [...el.shadowRoot!.querySelectorAll('.dropdown-item')] as HTMLButtonElement[]
    const addItem = items.find(i => i.textContent!.includes('Add channel'))!
    expect(addItem.disabled).toBe(true)
    el.remove()
  })

  it('rename/toggle/delete channel items only appear for a selected custom channel', async () => {
    const el = await makeEl()
    el.channels = makeChannels()
    el.selectedChannelId = 'primary'
    el._menuOpen = true
    await el.updateComplete

    let items = [...el.shadowRoot!.querySelectorAll('.dropdown-item')]
    expect(items.some(i => i.textContent!.includes('Rename channel'))).toBe(false)

    el.selectedChannelId = 'kitchen'
    await el.updateComplete
    items = [...el.shadowRoot!.querySelectorAll('.dropdown-item')]
    expect(items.some(i => i.textContent!.includes('Rename channel'))).toBe(true)
    expect(items.some(i => i.textContent!.includes('Delete channel'))).toBe(true)
    el.remove()
  })

  it('deleting the Primary channel is a no-op (guarded)', async () => {
    const el = await makeEl()
    el.channels = makeChannels()
    el.selectedChannelId = 'primary'
    await el.updateComplete

    const onDeleted = vi.fn()
    el.addEventListener('channel-deleted', onDeleted)
    await el._deleteChannel()

    expect(onDeleted).not.toHaveBeenCalled()
    el.remove()
  })

  it('clicking a slot row dispatches edit-requested', async () => {
    const el = await makeEl()
    el.slots = makeSlots()
    await el.updateComplete

    const onEdit = vi.fn()
    el.addEventListener('edit-requested', onEdit)
    el.shadowRoot!.querySelector('.slot-summary-row')!.dispatchEvent(new Event('click', { bubbles: true }))
    expect(onEdit).toHaveBeenCalledTimes(1)
    el.remove()
  })

  it('shows an empty state when there are no slots', async () => {
    const el = await makeEl()
    el.slots = []
    await el.updateComplete
    expect(el.shadowRoot!.querySelector('.entity-list-empty')!.textContent).toContain('No slots configured')
    el.remove()
  })

  it('template mode shows the template-specific empty state', async () => {
    const el = await makeEl()
    el.slots = []
    el.templateMode = true
    await el.updateComplete
    expect(el.shadowRoot!.querySelector('.entity-list-empty')!.textContent).toContain('Add channel')
    el.remove()
  })

  it('rotates the slot list so the currently active slot renders first', async () => {
    const el = await makeEl()
    el.slots = makeSlots()
    el._clock.liveMins = 1200 // inside 'night' (wraps past midnight)
    await el.updateComplete

    const labels = [...el.shadowRoot!.querySelectorAll('.slot-summary-label')].map(n => n.textContent)
    expect(labels[0]).toBe('Night')
    el.remove()
  })
})
