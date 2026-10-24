import { describe, it, expect } from 'vitest'
import { localMidnightSec, computeLiveDensities, localWeekdayLabels, resolveFirstWeekdayIndex } from '../components/heatmap-card'

describe('heatmap-card.ts localMidnightSec', () => {
  it('resolves midnight in UTC for a UTC instant', () => {
    const sec = localMidnightSec(new Date('2026-06-15T12:00:00Z'), 'UTC')
    expect(new Date(sec * 1000).toISOString()).toBe('2026-06-15T00:00:00.000Z')
  })

  it('resolves local midnight for a non-UTC timezone', () => {
    // 2026-07-22 10:00 UTC is 2026-07-22 12:00 in Europe/Berlin (CEST, UTC+2).
    const sec = localMidnightSec(new Date('2026-07-22T10:00:00Z'), 'Europe/Berlin')
    expect(new Date(sec * 1000).toISOString()).toBe('2026-07-21T22:00:00.000Z')
  })

  it('gives a day length of 23h on the DST spring-forward day (Europe/Berlin)', () => {
    // 2026-03-29 is the DST transition day for Europe/Berlin (02:00 -> 03:00).
    const day1 = localMidnightSec(new Date('2026-03-29T10:00:00Z'), 'Europe/Berlin')
    const day2 = localMidnightSec(new Date((day1 + 25 * 3600) * 1000), 'Europe/Berlin')
    expect((day2 - day1) / 3600).toBe(23)
  })

  it('gives a day length of 24h on a normal day (Europe/Berlin)', () => {
    const day1 = localMidnightSec(new Date('2026-06-15T10:00:00Z'), 'Europe/Berlin')
    const day2 = localMidnightSec(new Date((day1 + 25 * 3600) * 1000), 'Europe/Berlin')
    expect((day2 - day1) / 3600).toBe(24)
  })

  it('gives a day length of 25h on the DST fall-back day (Europe/Berlin)', () => {
    // 2026-10-25 is the DST fall-back day for Europe/Berlin (03:00 -> 02:00).
    const day1 = localMidnightSec(new Date('2026-10-25T10:00:00Z'), 'Europe/Berlin')
    const day2 = localMidnightSec(new Date((day1 + 25 * 3600) * 1000), 'Europe/Berlin')
    expect((day2 - day1) / 3600).toBe(25)
  })
})

describe('heatmap-card.ts resolveFirstWeekdayIndex', () => {
  it('resolves string first_weekday values', () => {
    expect(resolveFirstWeekdayIndex({ first_weekday: 'monday', language: 'en' })).toBe(0)
    expect(resolveFirstWeekdayIndex({ first_weekday: 'sunday', language: 'en' })).toBe(6)
    expect(resolveFirstWeekdayIndex({ first_weekday: 'saturday', language: 'en' })).toBe(5)
    expect(resolveFirstWeekdayIndex({ first_weekday: 'wednesday', language: 'en' })).toBe(2)
    expect(resolveFirstWeekdayIndex({ first_weekday: 'sun', language: 'en' })).toBe(6)
  })

  it('resolves numeric first_weekday values', () => {
    expect(resolveFirstWeekdayIndex({ first_weekday: 0, language: 'en' })).toBe(6)
    expect(resolveFirstWeekdayIndex({ first_weekday: 1, language: 'en' })).toBe(0)
    expect(resolveFirstWeekdayIndex({ first_weekday: 6, language: 'en' })).toBe(5)
    expect(resolveFirstWeekdayIndex({ first_weekday: 7, language: 'en' })).toBe(6)
  })

  it('resolves language / undefined based on region fallback', () => {
    expect(resolveFirstWeekdayIndex({ first_weekday: 'language', language: 'de-DE' })).toBe(0)
    expect(resolveFirstWeekdayIndex({ first_weekday: 'language', language: 'en-US' })).toBe(6)
  })
})

describe('heatmap-card.ts localWeekdayLabels', () => {
  // 2026-01-07 12:00 UTC is a Wednesday.
  const instant = new Date('2026-01-07T12:00:00Z')
  const monToSun = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  it('orders Mon..Sun for UTC', () => {
    expect(localWeekdayLabels(instant, 'UTC', 'en-US')).toEqual(monToSun)
  })

  it('orders Mon..Sun for a negative-offset zone (America/New_York, UTC-5)', () => {
    expect(localWeekdayLabels(instant, 'America/New_York', 'en-US')).toEqual(monToSun)
  })

  it('orders Mon..Sun for a positive-offset zone beyond UTC+12 (Pacific/Kiritimati, UTC+14)', () => {
    // A UTC-anchored calculation lands on the wrong calendar day here.
    expect(localWeekdayLabels(instant, 'Pacific/Kiritimati', 'en-US')).toEqual(monToSun)
  })

  it('orders Mon..Sun for a fractional-offset zone (Pacific/Chatham, UTC+12:45)', () => {
    expect(localWeekdayLabels(instant, 'Pacific/Chatham', 'en-US')).toEqual(monToSun)
  })

  it('orders Mon..Sun regardless of which weekday `instant` falls on', () => {
    for (let i = 0; i < 7; i++) {
      const d = new Date(instant.getTime() + i * 24 * 60 * 60 * 1000)
      expect(localWeekdayLabels(d, 'Pacific/Kiritimati', 'en-US')).toEqual(monToSun)
    }
  })

  it('orders Sun..Sat when firstDayIndex is 6 (Sunday)', () => {
    const sunToSat = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    expect(localWeekdayLabels(instant, 'UTC', 'en-US', 6)).toEqual(sunToSat)
  })

  it('orders Sat..Fri when firstDayIndex is 5 (Saturday)', () => {
    const satToFri = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    expect(localWeekdayLabels(instant, 'UTC', 'en-US', 5)).toEqual(satToFri)
  })
})

describe('heatmap-card.ts computeLiveDensities', () => {
  it('does not project active status into future slots of the current day', () => {
    // Current time: Wednesday 2026-07-29 at 00:10:00 UTC (10 mins after midnight)
    const now = new Date('2026-07-29T00:10:00Z')
    const wedMidnightSec = localMidnightSec(now, 'UTC') // 2026-07-29 00:00:00 UTC

    // Motion turned ON at 00:05:00 UTC and remained ON at current time 00:10:00 UTC
    const rawEvents: [number, number][] = [
      [wedMidnightSec + 300, 1], // 00:05:00 -> 1
    ]

    // 10m resolution -> 144 slots/day
    const densities = computeLiveDensities(rawEvents, 'UTC', 7, '10m', now)

    // Wednesday is weekday index 2 (Mon=0, Tue=1, Wed=2)
    const wedSlots = densities[2]

    // Slot 0 (00:00 - 00:10): 00:05 to 00:10 active -> 5 mins active out of 10 -> density 0.5
    expect(wedSlots[0]).toBeCloseTo(0.5, 2)

    // Future slots (slot 1: 00:10-00:20, slot 2: 00:20-00:30, ...) MUST be 0
    for (let slotIdx = 1; slotIdx < 144; slotIdx++) {
      expect(wedSlots[slotIdx]).toBe(0)
    }
  })

  it('correctly aggregates past completed days up to 24:00', () => {
    // Current time: Wednesday 2026-07-29 at 12:00:00 UTC
    const now = new Date('2026-07-29T12:00:00Z')
    const tueMidnightSec = localMidnightSec(new Date('2026-07-28T00:00:00Z'), 'UTC')

    // On Tuesday, light turned ON at 12:00:00 UTC and turned OFF at 12:10:00 UTC
    const rawEvents: [number, number][] = [
      [tueMidnightSec + 12 * 3600, 1],
      [tueMidnightSec + 12 * 3600 + 600, 0],
    ]

    const densities = computeLiveDensities(rawEvents, 'UTC', 7, '10m', now)

    // Tuesday is weekday index 1 (Tue=1)
    const tueSlots = densities[1]

    // Slot 72 corresponds to 12:00 - 12:10
    expect(tueSlots[72]).toBeCloseTo(1.0, 2)
    expect(tueSlots[71]).toBe(0)
    expect(tueSlots[73]).toBe(0)
  })

  it('handles multi-entity event streams separated by timestamp resets', () => {
    const now = new Date('2026-07-29T12:00:00Z')
    const tueMidnightSec = localMidnightSec(new Date('2026-07-28T00:00:00Z'), 'UTC')

    // Entity 1: active 10:00 - 10:10 on Tue
    // Entity 2: active 11:00 - 11:10 on Tue (starts with timestamp reset to Tue start)
    const rawEvents: [number, number][] = [
      [tueMidnightSec + 10 * 3600, 1],
      [tueMidnightSec + 10 * 3600 + 600, 0],
      // Timestamp reset for Entity 2
      [tueMidnightSec, 0],
      [tueMidnightSec + 11 * 3600, 1],
      [tueMidnightSec + 11 * 3600 + 600, 0],
    ]

    const densities = computeLiveDensities(rawEvents, 'UTC', 7, '10m', now)
    const tueSlots = densities[1]

    // Slot 60 (10:00 - 10:10) and Slot 66 (11:00 - 11:10)
    expect(tueSlots[60]).toBeCloseTo(1.0, 2)
    expect(tueSlots[66]).toBeCloseTo(1.0, 2)
  })
})

