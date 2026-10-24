import { describe, it, expect } from 'vitest'
import { minsToHHMM, slotToZone, convertCalculatedTimesToSlots, generateGradient, zoneColor } from '../lib/utils'
import { Slot, SlotConfig, CalculatedSlotTime } from '../lib/types'

describe('utils.ts tests', () => {
  describe('minsToHHMM', () => {
    it('formats minutes to HH:MM correctly', () => {
      expect(minsToHHMM(0)).toBe('00:00')
      expect(minsToHHMM(60)).toBe('01:00')
      expect(minsToHHMM(1439)).toBe('23:59')
      expect(minsToHHMM(75)).toBe('01:15')
    })

    it('handles overflow and negative values correctly', () => {
      expect(minsToHHMM(1440)).toBe('00:00')
      expect(minsToHHMM(1500)).toBe('01:00')
      expect(minsToHHMM(-60)).toBe('23:00')
      expect(minsToHHMM(-1440)).toBe('00:00')
    })
  })

  describe('slotToZone', () => {
    it('returns fixed startTime for fixed startType', () => {
      const slot: Slot = {
        id: 'slot1',
        label: 'Slot 1',
        color: '#fff',
        from: 0,
        to: 60,
        scene: null,
        startType: 'fixed',
        fixedStartTime: '08:30',
        startEvent: 'sunrise',
      }
      expect(slotToZone(slot)).toBe('08:30')
    })

    it('returns startEvent or fallback civil_dawn for non-fixed startType (never s.id)', () => {
      const slot: Slot = {
        id: 'draft_123',
        label: 'Slot 2',
        color: '#fff',
        from: 0,
        to: 60,
        scene: null,
        startType: 'astral',
        fixedStartTime: '08:30',
        startEvent: 'sunset',
      }
      expect(slotToZone(slot)).toBe('sunset')

      const slotNoEvent: Slot = {
        ...slot,
        startEvent: undefined,
      }
      expect(slotToZone(slotNoEvent)).toBe('civil_dawn')
    })
  })

  describe('convertCalculatedTimesToSlots', () => {
    it('converts calculated times and preserves config properties', () => {
      const calcTimes: CalculatedSlotTime[] = [
        { id: 'sunrise', start: 495 },
        { id: 'fixed_morning', start: 570 },
      ]
      const rawSlots: SlotConfig[] = [
        {
          id: 'sunrise',
          name: 'Sunrise Slot',
          start_type: 'astral',
          zone: 'sunrise',
          offset_minutes: 15,
          scene_entity_id: 'scene.morning',
          configured_entities: [],
        },
        {
          id: 'fixed_morning',
          name: 'Fixed Morning',
          start_type: 'fixed',
          zone: null,
          fixed_time: '09:30',
          offset_minutes: 0,
          scene_entity_id: 'scene.work',
          configured_entities: [],
        },
      ]

      const result = convertCalculatedTimesToSlots(calcTimes, rawSlots)
      expect(result.length).toBe(2)

      expect(result[0].id).toBe('sunrise')
      expect(result[0].from).toBe(495)
      expect(result[0].to).toBe(570)
      expect(result[0].scene).toBe('scene.morning')

      expect(result[1].id).toBe('fixed_morning')
      expect(result[1].from).toBe(570)
      expect(result[1].to).toBe(495 + 1440)
      expect(result[1].scene).toBe('scene.work')
    })
  })

  describe('generateGradient', () => {
    it('returns divider color for empty slots', () => {
      expect(generateGradient([])).toBe('var(--divider-color)')
    })

    it('generates correct linear-gradient string', () => {
      const slots = [
        { id: 's1', color: '#111', from: 0, to: 720 },
        { id: 's2', color: '#222', from: 720, to: 1440 },
      ]
      const gradient = generateGradient(slots)
      expect(gradient).toContain('linear-gradient')
      expect(gradient).toContain('#111 0.0%')
      expect(gradient).toContain('#111 50.0%')
      expect(gradient).toContain('#222 50.0%')
    })
  })
})

describe('zoneColor', () => {
  it('maps dawn and dusk of the same band to one colour', () => {
    expect(zoneColor('civil_dawn')).toBe(zoneColor('civil_dusk'))
    expect(zoneColor('nautical_dawn')).toBe(zoneColor('nautical_dusk'))
    expect(zoneColor('astro_dawn')).toBe(zoneColor('astro_dusk'))
    expect(zoneColor('gold_dawn')).toBe(zoneColor('gold_dusk'))
  })

  it('keeps distinct bands visually distinct', () => {
    const colors = new Set([
      zoneColor('civil_dawn'),
      zoneColor('nautical_dawn'),
      zoneColor('astro_dawn'),
      zoneColor('gold_dawn'),
      zoneColor('day'),
      zoneColor('night'),
    ])
    expect(colors.size).toBe(6)
  })

  it('falls back to the day colour for an unknown zone', () => {
    expect(zoneColor('not_a_zone')).toBe(zoneColor('day'))
  })
})
