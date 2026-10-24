import { LitElement } from 'lit'
import type { HomeAssistant } from './types'
import { translations, TranslationKey, en } from '../lang'

export type { TranslationKey }

// Helper type for Lit mixin constructors
type LitConstructor = new (...args: any[]) => LitElement & { hass?: HomeAssistant | null }

/**
 * Resolves normalized language code from locale string.
 * e.g., "de-DE" -> "de", "zh-Hans" -> "zh-Hans", "en-US" -> "en"
 */
export function normalizeLanguage(locale?: string): string {
  if (!locale) return 'en'
  if (translations[locale]) return locale
  const primary = locale.split('-')[0].toLowerCase()
  if (translations[primary]) return primary
  return 'en'
}

/**
 * Core translation lookup function.
 */
export function t(
  locale: string | undefined,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const lang = normalizeLanguage(locale)
  const activeDict = translations[lang] || en
  const template = activeDict[key] || en[key]

  if (template === undefined) {
    return key
  }

  if (!vars) {
    return template
  }

  return template.replace(/\{(\w+)\}/g, (match, varName) => {
    if (Object.prototype.hasOwnProperty.call(vars, varName)) {
      return String(vars[varName])
    }
    return match
  })
}

// number_format -> a locale whose Intl.NumberFormat digit-grouping/decimal
// separators match that HA setting (mirrors the mapping used by the HA
// frontend). 'system'/undefined pass no explicit locale (browser default).
const NUMBER_FORMAT_LOCALE: Record<string, string | undefined> = {
  comma_decimal: 'en-US',
  decimal_comma: 'de-DE',
  space_comma: 'fr-FR',
  quote_decimal: 'de-CH',
  none: 'en-US',
  system: undefined,
}

/**
 * Format numbers honoring Home Assistant locale overrides if provided.
 */
export function formatNumber(
  value: number,
  locale?: HomeAssistant['locale'],
  options?: Intl.NumberFormatOptions
): string {
  const numberFormat = locale?.number_format
  const lang =
    numberFormat && numberFormat !== 'language'
      ? NUMBER_FORMAT_LOCALE[numberFormat]
      : normalizeLanguage(locale?.language)
  // 'none' means no digit grouping at all (mirrors HA's formatNumberToParts).
  // useGrouping is applied after the spread so it cannot be overridden.
  const resolvedOptions = numberFormat === 'none' ? { ...options, useGrouping: false } : options
  try {
    return new Intl.NumberFormat(lang, resolvedOptions).format(value)
  } catch {
    return String(value)
  }
}

/**
 * Format date & time honoring Home Assistant locale overrides if provided.
 * Only `language` is applied — HA has no `number_format`/`time_format`-style
 * override for pure date formatting, so this stays locale-only by design.
 */
export function formatDateTime(
  date: Date | string | number,
  locale?: HomeAssistant['locale'],
  options?: Intl.DateTimeFormatOptions
): string {
  const lang = normalizeLanguage(locale?.language)
  const d = date instanceof Date ? date : new Date(date)
  try {
    return new Intl.DateTimeFormat(lang, options).format(d)
  } catch {
    return d.toLocaleString()
  }
}

/**
 * Format a time-of-day value honoring HA's time_format locale override
 * (12/24/system/language). Mirrors HA frontend's own useAmPm() (see
 * src/common/datetime/use_am_pm.ts): for 'language'/'system', HA doesn't
 * hardcode a per-language table — it sniffs whether the resolved locale's
 * own toLocaleString() renders 22:00 as "10" (12h) to decide. Reproduced
 * here rather than folding the language down via normalizeLanguage(), which
 * would lose region info (e.g. 'en-GB' -> 'en' reads as 12h by Intl default,
 * while the real en-GB locale is 24h). hourCycle: 'h23' (not `hour12: false`,
 * which some locales render as h24 — midnight as "24:00") keeps slot end
 * times like 24:00 unambiguous.
 */
export function formatTime(
  date: Date | string | number,
  locale?: HomeAssistant['locale'],
  options?: Intl.DateTimeFormatOptions
): string {
  const d = date instanceof Date ? date : new Date(date)
  const timeFormat = locale?.time_format
  const lang = timeFormat === 'system' ? undefined : normalizeLanguage(locale?.language)
  // Sniff with the raw language tag, not the normalized one: 'en-GB' must
  // resolve as its own (24h) locale, not fall back to 'en' (12h).
  const sniffLang = timeFormat === 'system' ? undefined : locale?.language
  const amPm =
    timeFormat === '12' ||
    ((timeFormat === 'language' || timeFormat === 'system' || !timeFormat) &&
      new Date('January 1, 2026 22:00:00').toLocaleString(sniffLang).includes('10'))
  try {
    return new Intl.DateTimeFormat(lang, { hourCycle: amPm ? 'h12' : 'h23', ...options }).format(d)
  } catch {
    return d.toLocaleTimeString()
  }
}

/**
 * Mixin for LitElement components to add `this.t(key, vars)` method.
 */
export function TwilightLocalizeMixin<T extends LitConstructor>(superClass: T) {
  return class extends superClass {
    protected t(key: TranslationKey, vars?: Record<string, string | number>): string {
      const lang = this.hass?.locale?.language || (typeof navigator !== 'undefined' ? navigator.language : 'en')
      return t(lang, key, vars)
    }
  }
}
