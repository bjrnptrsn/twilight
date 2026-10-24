import type { HomeAssistant } from './types'

/**
 * Robustly checks if Home Assistant is currently in dark mode.
 *
 * Falls back to prefers-color-scheme and checks the relative luminance of the
 * --primary-text-color custom property if the theme doesn't define darkMode.
 */
export function isDarkMode(hass: HomeAssistant | null | undefined, element?: HTMLElement): boolean {
  // 1. Explicit theme darkMode setting — the authoritative source when hass
  // is available; a custom theme's --primary-text-color luminance (step 2)
  // is only a heuristic and can misjudge mid-tone colors.
  if (hass?.themes?.darkMode !== undefined) {
    return !!hass.themes.darkMode
  }

  // 2. No hass (e.g. Lab/Storybook context): check computed CSS color
  // directly on element or document.body.
  try {
    const target = element || document.body
    const style = window.getComputedStyle(target)
    const textColor = style.getPropertyValue('--primary-text-color').trim() || style.color
    if (textColor) {
      return isColorDark(textColor)
    }
  } catch (e) {
    // Ignore
  }

  // 3. Fallback to prefers-color-scheme
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true
  }

  return false
}

function isColorDark(colorStr: string): boolean {
  const color = colorStr.toLowerCase().trim()

  // High-luminance text color indicates a dark background (dark mode)
  if (color === 'white' || color.startsWith('#fff') || color.includes('255,255,255') || color.includes('255, 255, 255')) {
    return true
  }
  if (color === 'black' || color === '#000' || color === '#000000' || color.includes('0,0,0') || color.includes('0, 0, 0')) {
    return false
  }

  if (color.startsWith('#')) {
    const hex = color.substring(1)
    let r = 0, g = 0, b = 0
    if (hex.length === 3 || hex.length === 4) {
      r = parseInt(hex[0] + hex[0], 16)
      g = parseInt(hex[1] + hex[1], 16)
      b = parseInt(hex[2] + hex[2], 16)
    } else if (hex.length >= 6) {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    }
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5
  }

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10)
    const g = parseInt(rgbMatch[2], 10)
    const b = parseInt(rgbMatch[3], 10)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5
  }

  return false
}
