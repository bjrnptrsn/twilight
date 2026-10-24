export interface HassEntity {
  entity_id: string
  attributes: { friendly_name?: string; name?: string; event_types?: string[]; [key: string]: unknown }
  state: string
}

export interface HomeAssistant {
  states: Record<string, HassEntity>
  callWS: <T>(msg: Record<string, unknown>) => Promise<T>
  connection: {
    subscribeMessage: <T>(
      callback: (message: T) => void,
      subscribeMessage: Record<string, unknown>
    ) => Promise<() => void>
  }
  themes?: { darkMode: boolean; [key: string]: unknown }
  config: { latitude: number; longitude: number; time_zone: string; [key: string]: unknown }
  locale?: {
    language: string
    number_format?:
      | 'language'
      | 'comma_decimal'
      | 'decimal_comma'
      | 'space_comma'
      | 'quote_decimal'
      | 'none'
      | 'system'
    time_format?: 'language' | '12' | '24' | 'system'
    first_weekday?: number | string
    [key: string]: unknown
  }
}

export interface Area {
  area_id: string
  name: string
  picture: string | null
}

export interface LabEntity {
  entity_id: string
  name: string
  domain: string
  in_area: boolean
  checked: boolean
  // Backend scene classification (scene/script entities only, null otherwise).
  scene_type?: string | null
  // True for Hue scenes with a non-empty palette (dynamic playback capable).
  supports_dynamic?: boolean
  // The scene's own speed as stored on the bridge, rescaled to 0-100.
  scene_speed?: number | null
}

// Per-attribute entry from the backend. One uniform shape for state /
// brightness / color: ready-to-render labels and swatch CSS, plus the deviation
// flag. null → nothing to show for this attribute (card renders "—").
export interface AttrEntry {
  actual: string                 // display label, e.g. "ON", "64%", "RGB(255,143,47)", "2700K", "—"
  target: string
  actual_swatch: string | null   // CSS color for the swatch, or null (no swatch)
  target_swatch: string | null
  deviates: boolean
}

export interface LightStateEntry {
  name: string                // friendly name, resolved by the backend
  actual_on: boolean             // is the light physically on (row dot)
  on: AttrEntry | null
  brightness: AttrEntry | null
  color: AttrEntry | null
}

// Full per-entity ready-to-render map pushed by the backend. The frontend
// maps this 1:1 into table cells — no comparison, no formatting, no hass.states.
export type LightStates = Record<string, LightStateEntry>

export interface ActivityTrigger {
  input_id: string | null
  input_type: string | null
  entity_id: string | null
  triggered_at: string  // ISO-String, always UTC
}

export interface RunState {
  // True when this area's config wants an engine but setup failed — every
  // other field is absent in that case (see websocket/subscribe.py's
  // _rebuild_cache, engine_registry.async_start_engine).
  engine_setup_failed?: boolean
  // channel_id -> active slot id (backend resolves all channels)
  active_slots?: Record<string, string>
  active_slot_start: string | null
  scene_activated_at: string | null
  active_activity?: string | null
  activity_trigger?: ActivityTrigger | null
  activity_expires_at: string | null
  activity_expire_frozen_seconds?: number | null
  activity_expire_source?: 'activity' | 'rule' | null
  startup_time: number | null
  // Full per-attribute target/actual/deviates map — backend computes all comparisons.
  // deviated_entities is derived from this map by the backend (convenience shortcut).
  light_states?: LightStates
  deviated_entities?: string[]
  // Entities externally turned off during the active activity (Respect Off) —
  // skipped by automatic slot changes when respect_manual_off is active.
  manual_off_entities?: string[]
  // Target of the *active* slot, resolved by the backend — already scoped
  // to active_slot, so the frontend does not search for the slot or extract scene
  // attributes itself.
  active_expected_states?: Record<string, { state: string; brightness?: number; color_temp?: number; rgb_color?: [number, number, number] }>
  active_scene_name?: string | null
  // channel_id -> friendly scene name (only while a scene is active per channel)
  active_scene_names?: Record<string, string>
  motion_active?: boolean
  lux_value?: number | null
  lights_on?: number
  lights_total?: number
  inputs?: Record<string, { type: string; active: boolean; disabled_by: string[] }>
  active_rules?: Record<string, boolean>
  // Slots whose scene extraction never resolved (empty extraction or a Hue
  // scene with no mappable targets) — the slot has no scene_map entry and
  // stays that way until the scene itself is fixed/replaced, so the panel
  // surfaces it instead of silently doing nothing on activation.
  scene_extraction_failed?: { channel_id: string; slot_id: string }[]
}

export interface Slot {
  id: string
  label: string
  color: string
  from: number   // minutes since midnight
  to: number
  scene: string | null
  isCustom?: boolean
  startType?: 'astral' | 'fixed'
  startEvent?: string
  startOffset?: number
  fixedStartTime?: string
  hue_activate_dynamic?: boolean
  hue_dynamic_speed?: number | null
  configured_entities?: string[]
}

// Store-shape of a single slot inside a channel (mirrors the backend schema).
export interface SlotConfig {
  id: string
  name: string
  start_type?: 'astral' | 'fixed'
  zone?: string | null          // sun event for astral slots
  fixed_time?: string | null    // "HH:MM" for fixed slots
  offset_minutes: number
  scene_entity_id: string | null
  configured_entities: string[]
  hue_activate_dynamic?: boolean
  hue_dynamic_speed?: number | null
}

// A channel: the Primary one (fixed 10 astral slots) or a free custom channel.
export interface ChannelConfig {
  name: string
  enabled: boolean
  slots: SlotConfig[]
  transition_on_seconds?: number | null
}

export interface CalculatedSlot {
  id: string
  label: string
  color: string
  from: number
  to: number
  scene: string | null
}

export const PRIMARY_CHANNEL_ID = 'primary'
export const MAX_CUSTOM_CHANNELS = 3
// Max slots per channel. Primary is fixed at 10; custom channels may not exceed it.
export const MAX_SLOTS_PER_CHANNEL = 10
// Fallback only, used before placeholderDefaults (backend, location-aware
// min_slot_distance_minutes) has loaded. Must be the smallest value the backend
// formula max(20, dynamic_min) - MIN_SLOT_DISTANCE_MINUTES can ever return
// (equator case: max(20,20)-10=10) — never the backend's own MIN_SLOT_DISTANCE_MINUTES
// alone, and never a typical/average value, so the editor can't briefly allow more
// offset headroom than the backend would ultimately enforce.
export const MIN_SLOT_DISTANCE_MINUTES = 10

export const SLOT_COLORS: Record<string, string> = {
  night:    '#141926',
  astro:    '#1e2e45',
  nautical: '#2c4268',
  civil:    '#3d5c8a',
  gold:     '#bfb39b',
  day:      '#8ab0cd',
}

export const STANDARD_ZONE_IDS = [
  'astro_dawn',
  'nautical_dawn',
  'civil_dawn',
  'gold_dawn',
  'day',
  'gold_dusk',
  'civil_dusk',
  'nautical_dusk',
  'astro_dusk',
  'night'
] as const

export const STANDARD_NAMES: Record<string, string> = {
  astro_dawn: 'Astronomical dawn',
  nautical_dawn: 'Nautical dawn',
  civil_dawn: 'Civil dawn',
  gold_dawn: 'Golden dawn',
  day: 'Day',
  gold_dusk: 'Golden dusk',
  civil_dusk: 'Civil dusk',
  nautical_dusk: 'Nautical dusk',
  astro_dusk: 'Astronomical dusk',
  night: 'Night',
}

export interface SensorConfig {
  id: string
  name?: string
  type: 'illuminance'
  entity_ids?: string[]
  aggregation?: 'min' | 'max' | 'mean' | 'median' | null
}

export interface InputConfig {
  id: string
  name?: string
  type: 'binary' | 'event' | 'motion' | 'timer' | 'button'
  entity_ids?: string[]
  // Binary only: how multiple entities combine into one active flag.
  aggregation?: 'any' | 'all' | 'count'
  aggregation_count?: number
  // Motion only: whether every motion re-triggers (restarts the auto-expire
  // timer) or only the first activation does. Not a multi-entity aggregation.
  retrigger?: 'every' | 'first'
  activity?: string | null
  rule?: string | null
  enabled?: boolean
  event_type?: string
  lux_threshold?: number | null
  lux_watch_window?: number | null
  lux_ignore_active?: boolean | null
  lux_ignore_scope?: 'none' | 'twilight_slots' | 'all_slots' | null
  trigger_time?: string
  label?: string
  button_mode?: 'click' | 'toggle'
  create_entity?: boolean
}

export type ActivityActionType = 'slot' | 'entity' | 'light' | 'block' | 'reset' | 'simulation'

export interface EntityTarget {
  entity_id: string
  action: 'on' | 'off' | 'toggle' | 'activate'
}

export interface ActivityAction {
  type: ActivityActionType
  entity_id?: string              // entity (scene / script — domain aus entity_id)
  targets?: string[]              // light
  state?: 'on' | 'off'           // light, default 'on'
  brightness?: number             // light, 0–255
  color_temp?: number             // light, mired
  rgb_color?: [number, number, number]  // light
  respect_manual_off?: boolean    // slot — skip manually-off entities during automatic slot changes
  transition?: number             // light — fixed fade seconds on start(), 0/absent = instant
  entity_targets?: EntityTarget[] // reset — additional entities (input_boolean/switch/script)
  excluded_slots?: Record<string, string[]> // slot — channel_id -> excluded slot ids
  mode?: SimulationMode           // simulation — umbrella dispatch key
  template_activity?: string      // simulation — activity whose action is played back
  lux_mode?: SimLuxMode           // simulation — when to switch lights on
  frequency_mode?: SimFrequencyMode // simulation — probability scaling factor
  heatmap_profile_id?: string     // simulation — saved profile, empty = dynamic
}

export type SimulationMode = 'presence_heatmap'
export type SimLuxMode = 'threshold' | 'dusk_dawn' | 'always'
export type SimFrequencyMode = 'very_low' | 'low' | 'normal' | 'high' | 'very_high'

export type ReleaseActionType = 'turn_off' | 'slot' | 'none'

export interface ReleaseAction {
  type: ReleaseActionType
}

export interface ActivityConfig {
  id: string
  name?: string | null
  suppress_inputs: string[]
  auto_expire_enabled?: boolean
  auto_expire: string | null
  action?: ActivityAction          // Default: { type: 'slot' }
  release_action?: ReleaseAction   // Default: { type: 'turn_off' }
  transition_off_seconds?: number | null
}

export interface HeatmapProfileConfig {
  id: string
  name: string
  resolution: '5m' | '10m' | '15m' | '30m' | '60m'
  range: '1w' | '2w' | '1m' | '3m' | '6m'
  created_at: string
  updated_at: string
  motion_buckets: Record<string, number[]>
  motion_presence_buckets?: Record<string, number[]>
}

export type RuleAutoExpireMode = 'none' | 'pause' | 'suspend' | 'restart'

export interface RuleConfig {
  id: string
  name: string
  enabled: boolean
  applied_activities: string[]
  excluded_slots_override: Record<string, Record<string, string[]>>
  auto_expire_mode?: RuleAutoExpireMode
  auto_expire_enabled?: boolean | null
  auto_expire?: string | null
  suppressed_inputs_override?: string[]
  respect_manual_off_override?: boolean | null
  // Set only by the backend's capability-mismatch auto-disable
  // — distinguishes an auto-disabled rule
  // from one the user disabled themselves. Cleared on any explicit save.
  auto_disabled_reason?: 'mismatch' | null
}

export interface AreaConfig {
  area_id: string
  name?: string
  enabled: boolean
  sensors: SensorConfig[]
  lux_threshold: number | null
  lux_watch_window: number | null
  channels: Record<string, ChannelConfig>
  inputs: InputConfig[]
  activities: ActivityConfig[]
  rules?: RuleConfig[]
  heatmap_profiles?: HeatmapProfileConfig[]
  transition_on_seconds?: number | null
  manual_only?: boolean
}

// area/save's WS response: the persisted AreaConfig plus a transient list of
// rule ids the backend auto-disabled for a capability mismatch
// — not a config field, must never be
// persisted back into AreaConfig or written back to the store on the next
// save (voluptuous rejects the unknown key).
export interface AreaSaveResult extends AreaConfig {
  disabled_rule_ids?: string[]
}

// area_template mirrors AreaConfig plus custom_channels, a template-only field
// backfilled by store.py's _normalize_area_config() for backward compatibility
// (not part of a saved area's own config).
export type AreaTemplateConfig = Partial<AreaConfig> & {
  custom_channels?: Record<string, ChannelConfig>
  primary_slots?: Record<string, Partial<SlotConfig>>
}

// Mirrors custom_components/twilight/store.py GLOBAL_DEFAULTS.
export interface GlobalConfig {
  area_template?: AreaTemplateConfig | null
}

// Mirrors custom_components/twilight/const.py PLACEHOLDER_DEFAULTS — const.py
// values shown greyed in empty edit-dialog fields. Separate from GlobalConfig.
export interface PlaceholderDefaults {
  auto_expire: string
  transition_on_seconds: number
  transition_off_seconds: number
  lux_threshold: number
  lux_watch_window: number
  min_slot_distance_minutes: number
  max_offset_minutes?: number
}

export interface CalculatedSlotTime {
  id: string
  start: number
}

export interface AreaSlotTimesResult {
  area_id: string
  dates: string[]
  channels: Record<string, Record<string, CalculatedSlotTime[]>>
}

export interface SlotTimesPreviewResult {
  slots: CalculatedSlotTime[]
}

export interface TimelineSlotTimesResult {
  year: number
  // One entry per day of the year, index-aligned with `sun/year`'s `days`.
  // null = the zone does not occur that day (polar day/night) — render a gap,
  // never a value.
  curves: Record<string, (number | null)[]>
}

export class SensorsChangedEvent extends CustomEvent<SensorConfig[]> {
  static readonly eventName = 'sensors-changed' as const
  constructor(detail: SensorConfig[]) {
    super(SensorsChangedEvent.eventName, { detail, bubbles: true, composed: true })
  }
}

export class InputsChangedEvent extends CustomEvent<{ inputs: InputConfig[] }> {
  static readonly eventName = 'inputs-changed' as const
  constructor(inputs: InputConfig[]) {
    super(InputsChangedEvent.eventName, { detail: { inputs }, bubbles: true, composed: true })
  }
}

export class ActivitiesChangedEvent extends CustomEvent<{
  activities: ActivityConfig[]
}> {
  static readonly eventName = 'activities-changed' as const
  constructor(detail: {
    activities: ActivityConfig[]
  }) {
    super(ActivitiesChangedEvent.eventName, { detail, bubbles: true, composed: true })
  }
}

export class RulesChangedEvent extends CustomEvent<RuleConfig[]> {
  static readonly eventName = 'rules-changed' as const
  constructor(rules: RuleConfig[]) {
    super(RulesChangedEvent.eventName, { detail: rules, bubbles: true, composed: true })
  }
}

export class SlotsChangedEvent extends CustomEvent<{
  slots: Slot[]
  transitionOnSeconds?: number | null
}> {
  static readonly eventName = 'slots-changed' as const
  constructor(slots: Slot[], transitionOnSeconds?: number | null) {
    super(SlotsChangedEvent.eventName, {
      detail: { slots, transitionOnSeconds },
      bubbles: true,
      composed: true,
    })
  }
}

export interface SimFlags {
  simCritical: boolean
  simError: boolean
  simSensorOffline: boolean
  simWarning: boolean
}

export interface EngineStateInfo {
  label: string
  color: string
  class: string
  sub: string
}

export interface BackupPayload {
  twilight_backup_version: number
  global: GlobalConfig
  areas: Record<string, AreaConfig>
}



