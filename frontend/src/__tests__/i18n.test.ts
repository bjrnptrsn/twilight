import { describe, it, expect } from 'vitest'
import { t, normalizeLanguage, formatNumber, formatDateTime, formatTime } from '../lib/i18n'

describe('i18n core helper tests', () => {
  describe('normalizeLanguage', () => {
    it('normalizes locale strings correctly', () => {
      expect(normalizeLanguage('de-DE')).toBe('de')
      expect(normalizeLanguage('de')).toBe('de')
      expect(normalizeLanguage('en-US')).toBe('en')
      expect(normalizeLanguage('zh-Hans')).toBe('zh-Hans')
      expect(normalizeLanguage('unknown-LOCALE')).toBe('en')
      expect(normalizeLanguage(undefined)).toBe('en')
    })
  })

  describe('t() translation lookup', () => {
    it('returns exact translations for active locale', () => {
      expect(t('en', 'common.save')).toBe('Save')
      expect(t('de', 'common.save')).toBe('Speichern')
      expect(t('en', 'nav.settings')).toBe('Settings')
      expect(t('de', 'nav.settings')).toBe('Einstellungen')
    })

    it('interpolates variables into templates correctly', () => {
      expect(t('en', 'status_card.ends_in', { time: '5 min' })).toBe('ends in 5 min')
      expect(t('de', 'status_card.ends_in', { time: '5 Min.' })).toBe('endet in 5 Min.')
    })

    it('falls back to English when the active locale has no dictionary at all', () => {
      // 'xx' normalizes to 'en' (unknown locale), so this exercises the same
      // fallback path a missing per-key translation would take.
      expect(t('xx', 'common.save')).toBe('Save')
    })

    it('returns the key string if key is unknown', () => {
      expect(t('en', 'non_existent_key' as any)).toBe('non_existent_key')
    })
  })

  describe('formatNumber and formatDateTime', () => {
    it('formats numbers without error', () => {
      expect(formatNumber(1234.56, { language: 'de' })).toContain('1')
      expect(formatNumber(100, { language: 'en' })).toBe('100')
    })

    it('formats dates without error', () => {
      const date = new Date(2026, 7, 7, 12, 0, 0)
      const formatted = formatDateTime(date, { language: 'de' }, { month: 'short' })
      expect(typeof formatted).toBe('string')
      expect(formatted.length).toBeGreaterThan(0)
    })

    it('honors number_format overrides independent of language', () => {
      // decimal_comma (de-DE style) forces a comma decimal separator even
      // when the active UI language is English.
      expect(formatNumber(1234.5, { language: 'en', number_format: 'decimal_comma' })).toContain(',')
      // comma_decimal (en-US style) forces a dot decimal separator even
      // when the active UI language is German.
      expect(formatNumber(1234.5, { language: 'de', number_format: 'comma_decimal' })).toContain('.')
      // 'language' (default) falls back to the language-derived locale.
      expect(formatNumber(1234.5, { language: 'de', number_format: 'language' })).toContain(',')
      // space_comma (fr/sv/cs style) groups with a space (fr-FR uses a
      // narrow no-break space, U+202F, not a plain ASCII space), not a dot.
      expect(formatNumber(1234567.89, { language: 'en', number_format: 'space_comma' })).toMatch(/1\s234\s567,89/)
      // quote_decimal (de-CH style) groups with an apostrophe.
      expect(formatNumber(1234567.89, { language: 'en', number_format: 'quote_decimal' })).toContain("'")
      // none disables digit grouping entirely.
      expect(formatNumber(1234567.89, { language: 'en', number_format: 'none' })).toBe('1234567.89')
    })
  })

  describe('formatTime', () => {
    const noon = new Date(Date.UTC(2026, 7, 7, 12, 0))

    it('forces 24h notation when time_format is 24', () => {
      const formatted = formatTime(
        noon,
        { language: 'en', time_format: '24' },
        { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }
      )
      expect(formatted).not.toMatch(/AM|PM/i)
    })

    it('forces 12h notation with AM/PM when time_format is 12', () => {
      const formatted = formatTime(
        noon,
        { language: 'de', time_format: '12' },
        { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }
      )
      expect(formatted).toMatch(/AM|PM/i)
    })

    it('follows the language for time_format language: en is 12h AM/PM', () => {
      const formatted = formatTime(
        noon,
        { language: 'en', time_format: 'language' },
        { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }
      )
      expect(formatted).toMatch(/AM|PM/i)
    })

    it('keeps region info for time_format language: en-GB stays 24h like HA', () => {
      // The AM/PM sniff must run against the raw language tag ('en-GB' is a
      // 24h locale on its own), not normalizeLanguage('en-GB') -> 'en'.
      const formatted = formatTime(
        noon,
        { language: 'en-GB', time_format: 'language' },
        { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }
      )
      expect(formatted).not.toMatch(/AM|PM/i)
    })
  })
})
