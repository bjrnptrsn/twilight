import { describe, it, expect, vi } from 'vitest'
import '../components/heatmap-card'

/**
 * Regression test for the profile-selection fetch guard and live-range
 * restore in heatmap-card.ts.
 *
 * Selecting a saved profile pins _activeRange/_activeResolution to the
 * profile's own snapshot values. Without a guard, updated() reads that as a
 * live range change and re-fires the recorder query (analyticsGet) even
 * though the rendered data comes from the profile's own motion_buckets and
 * never uses it. Switching back to "Live" must also restore whatever
 * range/resolution the user had selected before viewing the profile.
 */

const PROFILE = {
  id: 'prof_1',
  name: 'Weekday',
  resolution: '30m',
  range: '1m',
  motion_buckets: [],
}

function makeHass() {
  const callWS = vi.fn((msg: { type: string }) => {
    if (msg.type === 'twilight/heatmap/profile/list') return Promise.resolve([PROFILE])
    if (msg.type === 'twilight/analytics/get') return Promise.resolve({ motion: [], light_on: [] })
    return Promise.resolve([])
  })
  return { connection: {}, callWS } as any
}

async function makeCard() {
  const el = document.createElement('twilight-heatmap-card') as any
  document.body.appendChild(el)
  el.activeAreaId = 'living_room'
  await el.updateComplete
  return el
}

describe('heatmap-card profile source switching', () => {
  it('does not re-fire analyticsGet when selecting a profile', async () => {
    const hass = makeHass()
    const el = await makeCard()
    el.hass = hass
    await el.updateComplete
    await Promise.resolve()
    await Promise.resolve()

    const analyticsCallsBefore = hass.callWS.mock.calls.filter(
      (c: [{ type: string }]) => c[0].type === 'twilight/analytics/get'
    ).length
    expect(analyticsCallsBefore).toBeGreaterThan(0)

    el._profiles = [PROFILE]
    el._setSource('prof_1')
    await el.updateComplete
    await Promise.resolve()
    await Promise.resolve()

    const analyticsCallsAfter = hass.callWS.mock.calls.filter(
      (c: [{ type: string }]) => c[0].type === 'twilight/analytics/get'
    ).length
    expect(analyticsCallsAfter).toBe(analyticsCallsBefore)
    expect(el._activeRange).toBe('1m')
    expect(el._activeResolution).toBe('30m')

    el.remove()
  })

  it('restores the previous live range/resolution when switching back', async () => {
    const hass = makeHass()
    const el = await makeCard()
    el.hass = hass
    await el.updateComplete
    await Promise.resolve()

    el._activeRange = '2w'
    el._activeResolution = '15m'
    el._profiles = [PROFILE]

    el._setSource('prof_1')
    expect(el._activeRange).toBe('1m')
    expect(el._activeResolution).toBe('30m')

    el._setSource('live')
    expect(el._activeRange).toBe('2w')
    expect(el._activeResolution).toBe('15m')

    el.remove()
  })
})
