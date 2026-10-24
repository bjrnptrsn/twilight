import { describe, it, expect, vi } from 'vitest'
import '../components/heatmap-card'

/**
 * Regression test for the analytics recorder query re-firing on every HA
 * state-change tick.
 *
 * HA replaces the `hass` object with a new reference on every state-change
 * tick, not just on a genuine reconnect (see areas-view.ts's
 * `_subscribedConnection` for the same pattern). Comparing `hass` by
 * reference in `updated()` therefore re-triggered `_load()` — and its
 * recorder query spanning up to 365 days — on every tick while the card was
 * mounted with the Analytics tab open. Only `hass.connection` changing
 * (an actual reconnect) should trigger a reload.
 */

function makeHass(connection: object) {
  const callWS = vi.fn().mockResolvedValue([])
  return { connection, callWS } as any
}

async function makeCard() {
  const el = document.createElement('twilight-heatmap-card') as any
  document.body.appendChild(el)
  el.activeAreaId = 'living_room'
  await el.updateComplete
  return el
}

describe('heatmap-card connection-based reload guard', () => {
  it('does not reload on a new hass object referencing the same connection', async () => {
    const connection = {}
    const hass1 = makeHass(connection)

    const el = await makeCard()
    el.hass = hass1
    await el.updateComplete
    await Promise.resolve()

    const callsAfterFirstLoad = hass1.callWS.mock.calls.length
    expect(callsAfterFirstLoad).toBeGreaterThan(0)

    // Simulate several per-tick `hass` object replacements with the same
    // underlying connection (the routine case, e.g. a sensor state changing).
    for (let i = 0; i < 5; i++) {
      const hassTick = makeHass(connection)
      hassTick.callWS = hass1.callWS // same spy, so call count keeps accumulating
      el.hass = hassTick
      await el.updateComplete
      await Promise.resolve()
    }

    expect(hass1.callWS.mock.calls.length).toBe(callsAfterFirstLoad)

    el.remove()
  })

  it('does reload when hass.connection actually changes (reconnect)', async () => {
    const hass1 = makeHass({})

    const el = await makeCard()
    el.hass = hass1
    await el.updateComplete
    await Promise.resolve()

    const callsAfterFirstLoad = hass1.callWS.mock.calls.length
    expect(callsAfterFirstLoad).toBeGreaterThan(0)

    const hass2 = makeHass({}) // new connection object → genuine reconnect
    el.hass = hass2
    await el.updateComplete
    await Promise.resolve()

    expect(hass2.callWS.mock.calls.length).toBeGreaterThan(0)

    el.remove()
  })
})
