import { describe, it, expect } from 'vitest'
import {
  daySlotsFromCurves,
  buildSlotEvents,
  COLOR_NIGHT,
  type DayData,
} from '../lib/sun-zones'

// A generic day, as delivered by twilight/sun/year. The slot_* fields carry the
// system defaults; daySlotsFromCurves is expected to replace exactly those with
// the area-resolved values and leave everything else alone.
const baseDay = (over: Partial<DayData> = {}): DayData => ({
  date: '2026-01-15',
  tz_offset: 60,
  solar_midnight: 0,
  midnight_el: -40,
  solar_noon: 720,
  astro_dawn: 400,
  nautical_dawn: 435,
  dawn: 470,
  sunrise: 505,
  sunset: 960,
  dusk: 990,
  nautical_dusk: 1025,
  astro_dusk: 1060,
  slot_astro_dawn: 400,
  slot_nautical_dawn: 435,
  slot_civil_dawn: 470,
  slot_sunrise: 505,
  slot_gold_dawn: 505,
  slot_day: 535,
  slot_gold_dusk: 930,
  slot_sunset: 960,
  slot_civil_dusk: 960,
  slot_nautical_dusk: 995,
  slot_astro_dusk: 1030,
  slot_night: 1065,
  ...over,
})

describe('daySlotsFromCurves', () => {
  it('replaces slot_* fields with the area-resolved curve values', () => {
    // An area with a +20 min offset on every zone.
    const curves = {
      astro_dawn: [420], nautical_dawn: [455], civil_dawn: [490],
      gold_dawn: [525], day: [555], gold_dusk: [950],
      civil_dusk: [980], nautical_dusk: [1015], astro_dusk: [1050], night: [1085],
    }
    const out = daySlotsFromCurves(baseDay(), curves, 0)

    expect(out.slot_astro_dawn).toBe(420)
    expect(out.slot_civil_dawn).toBe(490)
    expect(out.slot_day).toBe(555)
    expect(out.slot_night).toBe(1085)
  })

  it('maps slot_sunrise to gold_dawn, not day', () => {
    // slot_sunrise is the cutoff dawn zones must precede in buildSlotEvents.
    // Mapping it to `day` would swallow the whole gold_dawn→day span.
    const curves = { gold_dawn: [525], day: [555] }
    const out = daySlotsFromCurves(baseDay(), curves, 0)

    expect(out.slot_sunrise).toBe(525)
  })

  it('falls back to day for slot_sunrise when gold_dawn is absent', () => {
    const curves = { gold_dawn: [null], day: [555] }
    const out = daySlotsFromCurves(baseDay(), curves, 0)

    expect(out.slot_sunrise).toBe(555)
  })

  it('keeps non-slot fields untouched', () => {
    const out = daySlotsFromCurves(baseDay(), { day: [555] }, 0)

    expect(out.midnight_el).toBe(-40)
    expect(out.tz_offset).toBe(60)
    expect(out.sunrise).toBe(505)
    expect(out.astro_dawn).toBe(400)
  })

  it('preserves day-overflow values above 1440 for carry-over rendering', () => {
    const out = daySlotsFromCurves(baseDay(), { night: [1465] }, 0)

    expect(out.slot_night).toBe(1465)
  })

  it('propagates nulls instead of inventing a zone boundary', () => {
    // This is the polar-day regression: the backend flags these slots synthetic
    // and sends null. Turning null into a number here reproduces the fan of
    // 1-minute zones around solar noon.
    const curves = {
      astro_dawn: [null], nautical_dawn: [null], civil_dawn: [null],
      gold_dawn: [null], day: [null], gold_dusk: [null],
      civil_dusk: [null], nautical_dusk: [null], astro_dusk: [null], night: [null],
    }
    const out = daySlotsFromCurves(baseDay(), curves, 0)

    expect(out.slot_day).toBeNull()
    expect(out.slot_night).toBeNull()
    expect(out.slot_sunrise).toBeNull()
    // With no zone boundaries at all the column renders as a single fill.
    expect(buildSlotEvents(out)).toEqual([])
  })

  it('yields a single uniform night column on a polar night', () => {
    const curves = { day: [null], gold_dawn: [null], night: [null] }
    const out = daySlotsFromCurves(baseDay({ midnight_el: -40 }), curves, 0)

    expect(buildSlotEvents(out)).toEqual([])
    expect(COLOR_NIGHT).toBe('#141926')
  })

  it('handles a missing or out-of-range index as null', () => {
    const curves = { day: [555] }

    expect(daySlotsFromCurves(baseDay(), curves, 5).slot_day).toBeNull()
    expect(daySlotsFromCurves(baseDay(), {}, 0).slot_day).toBeNull()
  })

  it('mixes real and null zones on a polar transition day', () => {
    // Tromso mid-January: twilight happens, the sun never rises.
    const curves = {
      astro_dawn: [466], nautical_dawn: [501], civil_dawn: [536],
      gold_dawn: [null], day: [null], gold_dusk: [null], civil_dusk: [null],
      nautical_dusk: [892], astro_dusk: [927], night: [962],
    }
    const out = daySlotsFromCurves(baseDay(), curves, 0)

    expect(out.slot_astro_dawn).toBe(466)
    expect(out.slot_day).toBeNull()
    expect(out.slot_night).toBe(962)

    // Only the zones that actually occur become colour boundaries, and they
    // stay in chronological order.
    const evs = buildSlotEvents(out)
    const times = evs.map(e => e.t)
    expect(times).toEqual([...times].sort((a, b) => a - b))
    expect(times).toContain(466)
    expect(times).toContain(962)
  })
})
