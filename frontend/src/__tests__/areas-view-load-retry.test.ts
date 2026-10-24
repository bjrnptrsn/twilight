import { describe, it, expect, vi } from 'vitest'
import '../views/areas-view'

/**
 * Regression test for the first-load retry guard in areas-view.
 *
 * _loadData() wraps every WS call with a `.catch(() => <empty default>)` so a
 * single failing endpoint doesn't wipe out the others (see the "Promise.all
 * failing whole on one bad endpoint" fix). But areasList/areaRegistryList are
 * load-bearing: if either genuinely fails (transient WS error on first load),
 * swallowing it let `_hasLoadedOnce` get set to `true` anyway with empty data
 * — the "hass arrived late" retry guard in updated() checks `!_hasLoadedOnce`
 * and never fires again, so the Overview stayed permanently empty instead of
 * retrying on the next hass tick.
 */

function makeHass(overrides: Record<string, () => Promise<unknown>> = {}) {
  const connection = { subscribeMessage: vi.fn().mockResolvedValue(vi.fn()) }
  const callWS = vi.fn((msg: { type: string }) => {
    if (msg.type in overrides) return overrides[msg.type]()
    if (msg.type === 'twilight/areas/list') return Promise.resolve([])
    if (msg.type === 'twilight/area_registry/list') return Promise.resolve([])
    if (msg.type === 'twilight/sun/day') return Promise.resolve({ day_data: [] })
    if (msg.type === 'twilight/global/get') return Promise.resolve({})
    if (msg.type === 'twilight/global/defaults') return Promise.resolve(null)
    return Promise.resolve([])
  })
  return { connection, callWS } as any
}

async function makeView() {
  const el = document.createElement('twilight-areas-view') as any
  document.body.appendChild(el)
  await el.updateComplete
  return el
}

describe('areas-view first-load retry', () => {
  it('retries on the next hass tick after areasList genuinely fails', async () => {
    let failFirstCall = true
    const hass = makeHass({
      'twilight/areas/list': () => {
        if (failFirstCall) {
          failFirstCall = false
          return Promise.reject(new Error('transient WS error'))
        }
        return Promise.resolve([])
      },
    })

    const el = await makeView()
    el.hass = hass
    await el.updateComplete
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    expect(el._hasLoadedOnce).toBe(false)

    // Next hass tick (new object, same connection) must retry the load.
    const hassTick = { ...hass }
    el.hass = hassTick
    await el.updateComplete
    await Promise.resolve()
    await Promise.resolve()
    await Promise.resolve()

    expect(el._hasLoadedOnce).toBe(true)

    el.remove()
  })

  it('still sets _hasLoadedOnce when areasList succeeds with zero areas configured', async () => {
    const hass = makeHass()

    const el = await makeView()
    el.hass = hass
    await el.updateComplete
    await el.updateComplete
    await new Promise(r => setTimeout(r, 0))
    await el.updateComplete

    expect(el._hasLoadedOnce).toBe(true)
    expect(el._areaConfigs).toEqual([])

    el.remove()
  })

  it('does not lose todaySun data when a non-essential endpoint fails', async () => {
    const hass = makeHass({
      'twilight/sun/day': () => Promise.reject(new Error('sun/day down')),
    })

    const el = await makeView()
    el.hass = hass
    await el.updateComplete
    await el.updateComplete
    await new Promise(r => setTimeout(r, 0))
    await el.updateComplete

    expect(el._hasLoadedOnce).toBe(true)
    expect(el._todayData).toEqual([])

    el.remove()
  })
})
