// The Hue app's dynamic-speed slider has twelve levels. The percentages are the
// Bridge values of those levels, rounded because hue.activate_scene only takes
// whole numbers; they are not evenly spaced.
export const HUE_DYNAMIC_SPEED_LEVELS = [
  { level: 1, percent: 37 },
  { level: 2, percent: 44 },
  { level: 3, percent: 48 },
  { level: 4, percent: 50 },
  { level: 5, percent: 54 },
  { level: 6, percent: 56 },
  { level: 7, percent: 60 },
  { level: 8, percent: 63 },
  { level: 9, percent: 73 },
  { level: 10, percent: 75 },
  { level: 11, percent: 82 },
  { level: 12, percent: 88 },
] as const

/** Hue speed level for a stored percentage, or null if it is a custom value. */
export function speedPercentToLevel(percent: number): number | null {
  return HUE_DYNAMIC_SPEED_LEVELS.find(entry => entry.percent === percent)?.level ?? null
}

/** Percentage of the Hue level nearest to a stored value; a level value stays as it is. */
export function nearestSpeedPercent(percent: number): number {
  return HUE_DYNAMIC_SPEED_LEVELS.reduce((best, entry) =>
    Math.abs(entry.percent - percent) < Math.abs(best.percent - percent) ? entry : best
  ).percent
}
