import type { HomeAssistant, SensorConfig } from './types'
import { t, type TranslationKey } from './i18n'

/**
 * User-facing display name for a sensor:
 * Uses cosmetic name if set, otherwise the linked entities' friendly name(s),
 * otherwise a type label ("Illuminance Sensor").
 */
export function getSensorDisplayName(sensor: SensorConfig, hass?: HomeAssistant | null): string {
  if (sensor.name && sensor.name.trim()) return sensor.name.trim()
  const entityIds = sensor.entity_ids ?? []
  if (entityIds.length > 0 && hass) {
    const names = entityIds.map(ent => hass.states[ent]?.attributes?.friendly_name ?? ent)
    let friendlyName = names.join(', ')
    if (friendlyName.length > 35 && names.length > 1) {
      friendlyName = `${names[0]} + ${names.length - 1} more`
    }
    return friendlyName
  }
  if (sensor.type === 'illuminance') return 'Illuminance Sensor'
  return sensor.id
}

export function getLuxAggregationLabel(mode?: string | null, hass?: HomeAssistant | null): string {
  const keys: Record<string, TranslationKey> = {
    min: 'sensors_dialog.agg_min',
    max: 'sensors_dialog.agg_max',
    mean: 'sensors_dialog.agg_mean',
    median: 'sensors_dialog.agg_median',
  }
  return t(hass?.locale?.language, keys[mode ?? 'min'] ?? 'sensors_dialog.agg_min')
}
