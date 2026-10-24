import { describe, it, expect } from 'vitest'
import '../components/slot-tooltip'
import type { Slot } from '../lib/types'

async function makeEl() {
  const el = document.createElement('twilight-slot-tooltip') as any
  document.body.appendChild(el)
  await el.updateComplete
  return el
}

function fireHover(hoverTime: number | null, channelId?: string) {
  window.dispatchEvent(new CustomEvent('time-hover-changed', {
    detail: { hoverTime, channelId },
  }))
}

function makeSlots(): Slot[] {
  return [
    { id: 'day', label: 'Day', color: '#fff', from: 360, to: 1080, scene: 'scene.day' },
    { id: 'night', label: 'Night', color: '#003', from: 1080, to: 360, scene: null },
  ]
}

describe('twilight-slot-tooltip', () => {
  it('renders nothing when nothing is hovered', async () => {
    const el = await makeEl()
    el.slots = makeSlots()
    await el.updateComplete
    expect(el.shadowRoot!.querySelector('.slot-tooltip-badge')).toBeNull()
    el.remove()
  })

  it('renders the active slot label and time once a time-hover-changed event arrives', async () => {
    const el = await makeEl()
    el.slots = makeSlots()
    fireHover(720) // inside 'day'
    await el.updateComplete

    const badge = el.shadowRoot!.querySelector('.slot-tooltip-badge')
    expect(badge).not.toBeNull()
    expect(badge!.textContent).toContain('12:00')
    el.remove()
  })

  it('renders nothing when the hovered time falls into no configured slot', async () => {
    const el = await makeEl()
    el.slots = [{ id: 'day', label: 'Day', color: '#fff', from: 360, to: 720, scene: null }]
    fireHover(900) // outside the only slot
    await el.updateComplete

    expect(el.shadowRoot!.querySelector('.slot-tooltip-badge')).toBeNull()
    el.remove()
  })

  it('a hoverTime of null (mouse left the chart) clears the tooltip', async () => {
    const el = await makeEl()
    el.slots = makeSlots()
    fireHover(720)
    await el.updateComplete
    expect(el.shadowRoot!.querySelector('.slot-tooltip-badge')).not.toBeNull()

    fireHover(null)
    await el.updateComplete
    expect(el.shadowRoot!.querySelector('.slot-tooltip-badge')).toBeNull()
    el.remove()
  })

  it('uses channelSlotsMap for the channel under the pointer, falling back to `slots`', async () => {
    const el = await makeEl()
    el.slots = makeSlots() // fallback: 'day' active at 720
    el.channelSlotsMap = {
      kitchen: [{ id: 'custom', label: 'Custom', color: '#0f0', from: 700, to: 740, scene: null }],
    }
    fireHover(720, 'kitchen')
    await el.updateComplete

    expect(el.shadowRoot!.querySelector('.slot-tooltip-badge')!.textContent).toContain('Custom')
    el.remove()
  })

  it('tracks window mousemove locally without any external re-render trigger', async () => {
    const el = await makeEl()
    el.slots = makeSlots()
    fireHover(720)
    await el.updateComplete

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 111, clientY: 222 }))
    await el.updateComplete

    expect(el._x).toBe(111)
    expect(el._y).toBe(222)
    el.remove()
  })

  it('stops listening after being removed from the DOM', async () => {
    const el = await makeEl()
    el.remove()

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 999, clientY: 999 }))
    expect(el._x).not.toBe(999)

    fireHover(720)
    expect(el._hoveredTime).not.toBe(720)
  })
})
