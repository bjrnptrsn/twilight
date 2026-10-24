import { describe, it, expect } from 'vitest'
import { resolveChannelActiveSlot } from '../components/status-card'
import type { RunState } from '../lib/types'

/**
 * Backend-first regression tests for the status-card "Active Timeslots"
 * widget.
 *
 * The widget used to fall back to a local isSlotActiveAt() guess
 * whenever a runState existed but had no entry for the channel — a phantom
 * badge that could disagree with the engine dot shown right next to it.
 */

const slots = [
  { id: 'day', label: 'Day', color: '#fff', from: 360, to: 1080 },
  { id: 'gold_dusk', label: 'Golden Dusk', color: '#f90', from: 1080, to: 1200 },
  { id: 'night', label: 'Night', color: '#003', from: 1200, to: 360 },
] as any[]

const NOON = 720 // local minutes -> inside "day"

describe('resolveChannelActiveSlot', () => {
  it("uses the engine's active slot even when the local clock disagrees", () => {
    const runState = { active_slots: { primary: 'night' } } as unknown as RunState
    expect(resolveChannelActiveSlot(slots, runState, 'primary', NOON)?.id).toBe('night')
  })

  it('shows nothing when the engine reports no slot for this channel', () => {
    const runState = { active_slots: {} } as unknown as RunState
    // Must not fall back to the local clock: that is the phantom badge (B4).
    expect(resolveChannelActiveSlot(slots, runState, 'primary', NOON)).toBeUndefined()
  })

  it('falls back to the local clock only when there is no runState at all', () => {
    expect(resolveChannelActiveSlot(slots, null, 'primary', NOON)?.id).toBe('day')
  })

  it('shows nothing when the engine slot is unknown to the config', () => {
    const runState = { active_slots: { primary: 'ghost_slot' } } as unknown as RunState
    expect(resolveChannelActiveSlot(slots, runState, 'primary', NOON)).toBeUndefined()
  })
})
