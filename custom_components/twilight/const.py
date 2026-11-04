"""Constants for the Twilight integration."""

from __future__ import annotations

from enum import StrEnum

from homeassistant.const import (
    STATE_HOME,
    STATE_ON,
    STATE_OPEN,
)

DOMAIN = "twilight"
STORAGE_VERSION = 3

# Prefix for HA Context IDs on Twilight's own service calls, used by echo
# detection (echo.py) to distinguish them from externally-triggered state
# changes on the same entities.
CONTEXT_PREFIX = "twilight_"

# Dispatcher signals (homeassistant.helpers.dispatcher).
# One global state signal for all areas — payload (area_id, old_state, new_state).
# Keying by area in the payload instead of the signal name means subscriptions
# survive engine replacement and automatically cover areas created later.
SIGNAL_STATE_CHANGED = "twilight_state_changed"
# Fired (no payload) after area/save or area/delete created, replaced, or
# removed an engine, so live subscriptions rebuild their caches and watchers.
SIGNAL_ENGINES_CHANGED = "twilight_engines_changed"
# Fired (payload: area_id) when an anticipatory fade starts or is cut short, so live
# subscriptions push the fade badge — no RunState change carries it.
SIGNAL_FADE_CHANGED = "twilight_fade_changed"

# HA state strings considered "active" for binary-style inputs (binary_sensor,
# person, device_tracker, ...).
ACTIVE_STATES = frozenset({STATE_ON, STATE_HOME, "occupied", STATE_OPEN})

# HA state strings considered "active" for motion-style inputs (binary_sensor
# with device_class motion/occupancy, person, device_tracker). Deliberately a
# subset of ACTIVE_STATES — motion sensors don't report "occupied"/"open".
MOTION_ACTIVE_STATES = frozenset({STATE_ON, STATE_HOME})


class SceneType(StrEnum):
    """Supported scene types."""

    PLAIN_SCENE = "plain_scene"
    HUE_SCENE = "hue_scene"
    HUE_SMART_SCENE = "hue_smart_scene"
    SCRIPT = "script"


class InputType(StrEnum):
    """Supported input types."""

    MOTION = "motion"
    BINARY = "binary"
    EVENT = "event"
    TIMER = "timer"
    BUTTON = "button"


class SensorType(StrEnum):
    """Supported sensor types."""

    ILLUMINANCE = "illuminance"


class ActionType(StrEnum):
    """Supported activity start action types."""

    SLOT = "slot"
    ENTITY = "entity"
    BLOCK = "block"
    TURN_OFF = "turn_off"
    SIMULATION = "simulation"
    RESET = "reset"


class ReleaseActionType(StrEnum):
    """Supported activity release_action types."""

    TURN_OFF = "turn_off"
    ACTIVITY = "activity"
    NONE = "none"


class ResetScope(StrEnum):
    """What a `reset` action turns off."""

    AREA = "area"
    ENTITIES = "entities"


class LuxIgnoreScope(StrEnum):
    """Which slots should ignore the lux threshold for motion inputs."""

    NONE = "none"
    TWILIGHT_SLOTS = "twilight_slots"
    ALL_SLOTS = "all_slots"


class SimLuxMode(StrEnum):
    """When the presence simulation is allowed to switch lights on.

    The lux gate normally lives in the motion input, which the simulation
    skips — so the sim-handler evaluates one of these itself before an "on" step.
    """

    THRESHOLD = "threshold"  # only when current lux <= lux_threshold
    DUSK_DAWN = "dusk_dawn"  # only when the primary slot is in TWILIGHT_SLOTS
    ALWAYS = "always"  # no condition


class HueDynamicMode(StrEnum):
    """Whether a slot's Hue scene starts its dynamic palette."""

    HUE = "hue"  # follow the Hue scene's own "start dynamic" setting (Hue app)
    ON = "on"
    OFF = "off"


class SimFrequencyMode(StrEnum):
    """Frequency / probability multiplier mode for presence simulation.

    Geometric progression (each step doubles/halves), symmetric around
    NORMAL — not linear, so the felt intensity step is consistent regardless
    of which end of the scale you're on.
    """

    VERY_LOW = "very_low"  # 25% probability scaling
    LOW = "low"  # 50% probability scaling
    NORMAL = "normal"  # 100% probability scaling (1:1 history)
    HIGH = "high"  # 200% probability scaling
    VERY_HIGH = "very_high"  # 400% probability scaling


class AggregationMode(StrEnum):
    """How a binary input combines multiple entity states into one active flag."""

    ANY = "any"  # active if at least one entity is active
    ALL = "all"  # active only if all entities are active
    COUNT = "count"  # active if at least N (aggregation_count) are active


class RetriggerMode(StrEnum):
    """How a motion input re-triggers its activity while already active.

    Only affects re-triggering (which restarts the auto-expire timer); it is not
    a multi-entity aggregation. For multi-entity motion, any active entity keeps
    the input active regardless of this mode.
    """

    EVERY = "every"  # every motion event re-triggers → restarts the timer
    FIRST = "first"  # only the first motion (off→on for the whole input) triggers


class RuleAutoExpireMode(StrEnum):
    """Whether/how a Rule freezes its targeted Activity's auto-expire timer."""

    NONE = "none"
    RESTART = "restart"
    PAUSE = "pause"
    SUSPEND = "suspend"


class StartType(StrEnum):
    """Slot start types for the channel scheduler.

    StrEnum inherits from str, so JSON comparison against the raw stored
    values ("astral"/"fixed") works without conversion.
    """

    ASTRAL = "astral"
    FIXED = "fixed"


# The single Primary Channel id every area always has. Its 10 slots are the
# fixed astral zones (order + zone not editable); only scene_entity_id and
# offset_minutes are configurable per slot.
PRIMARY_CHANNEL_ID = "primary"
# Maximum number of additional (custom) channels per area, on top of Primary
# (keeps the sun-path readable).
MAX_CUSTOM_CHANNELS = 3
# Maximum slots per channel. Primary is fixed at 10; custom channels may not exceed it.
MAX_SLOTS_PER_CHANNEL = 10
# Minimum allowed distance in minutes between two consecutive slots in a channel.
MIN_SLOT_DISTANCE_MINUTES = 10
# Schema version of the config backup produced by export_all() / consumed by
# async_import_all(). Bump when the exported snapshot shape changes incompatibly.
# 2: hue_activate_dynamic is a HueDynamicMode instead of a bool (see
# store._migrate_legacy_dynamic_slots for how a version-1 backup is read).
BACKUP_VERSION = 2
# Maximum allowed offset magnitude in minutes for vertical vertipper protection in slot editor.
MAX_OFFSET_MINUTES = 180


# Default configuration values
DEFAULT_LUX_THRESHOLD = 30
DEFAULT_AUTO_EXPIRE = (
    "03:00:00"  # HH:MM:SS — overnight safety net (e.g. "Guest" left active)
)
DEFAULT_LUX_WATCH_WINDOW = 10  # seconds
DEFAULT_TRANSITION_ON_SECONDS = 60
DEFAULT_TRANSITION_OFF_SECONDS = 0
DEFAULT_LUX_AGGREGATION = "min"
DEFAULT_MOTION_RETRIGGER = RetriggerMode.EVERY
DEFAULT_BINARY_AGGREGATION = AggregationMode.ANY
DEFAULT_RETRY_DELAYS = (1.2, 2.4, 3.6, 4.8, 6.0)
# How often a call without transition that runs the retry loop is resent at the
# first retry points, whatever the lamp reports. Lamps behind the Hue Bridge are
# first reported at the commanded value and only seconds to minutes later at
# their real one, so a check cannot see a command the lamp missed. Must stay
# below the number of retry delays, or no check follows the last resend.
HARD_CALL_RESENDS = 2
ECHO_SETTLE_WINDOW_SECONDS = 1.0

# Expected-state keys Twilight may still enforce on a lamp of a running Hue
# dynamic scene. Live-verified on the Bridge: a color or color-temperature
# command to ANY lamp of the scene — even one that cannot play dynamics itself —
# ends the scene's dynamic playback, while on/off and brightness leave it running.
DYNAMIC_SAFE_STATE_KEYS = frozenset({"state", "brightness"})

# How long the remaining calls wait for lead calls (static values for lamps that
# can't rotate, sent before a dynamic scene recall). A Bridge answers in ~0.1 s;
# the cap only matters when it is overloaded and the Hue integration keeps
# retrying without a timeout. A lead color that lands after the recall ends the
# scene's dynamics (static fallback) — preferable to holding back the recall.
LEAD_CALL_MAX_WAIT_SECONDS = 1.0

# Re-arm delay when the slot scheduler could not determine any active slot
# (in practice: a broken time zone, which makes the sun calculation raise).
# Without a retry the scheduler would stay dormant until the next HA restart.
# Long on purpose — the cause is a config error that stays broken until fixed,
# so a short interval would only spam the log. See TwilightManager.
SLOT_RECOVERY_RETRY_SECONDS = 300

# Presence simulation defaults
SIM_FREQUENCY_FACTORS: dict[str, float] = {
    SimFrequencyMode.VERY_LOW.value: 0.25,
    SimFrequencyMode.LOW.value: 0.5,
    SimFrequencyMode.NORMAL.value: 1.0,
    SimFrequencyMode.HIGH.value: 2.0,
    SimFrequencyMode.VERY_HIGH.value: 4.0,
}
SIM_LOOP_TICK_S = 60.0  # fallback loop tick when the template has no auto_expire
# (normally the tick is dynamic: 0.4 * auto_expire)
SIM_DEFAULT_RESOLUTION = "15m"  # dynamic recorder window bucket size
SIM_DEFAULT_RANGE = "1m"  # dynamic recorder window (30 days)
DEFAULT_LUX_IGNORE_ACTIVE = False
DEFAULT_LUX_IGNORE_SCOPE = LuxIgnoreScope.NONE
# Placeholder values shown (greyed) in edit dialogs when a per-object field is
# left empty — purely informational, tells the user which const.py default the
# backend will use. Intentionally SEPARATE from GLOBAL_DEFAULTS (which is about
# real global settings): this is only the source for input/activity placeholders.
# Only fields that are shown as a placeholder in an empty text/number input
# belong here (selects carry their own default value inline).
PLACEHOLDER_DEFAULTS: dict[str, object] = {
    "auto_expire": DEFAULT_AUTO_EXPIRE,
    "transition_on_seconds": DEFAULT_TRANSITION_ON_SECONDS,
    "transition_off_seconds": DEFAULT_TRANSITION_OFF_SECONDS,
    "lux_threshold": DEFAULT_LUX_THRESHOLD,
    "lux_watch_window": DEFAULT_LUX_WATCH_WINDOW,
    "min_slot_distance_minutes": MIN_SLOT_DISTANCE_MINUTES,
    "max_offset_minutes": MAX_OFFSET_MINUTES,
}


# Dawn/dusk/night slots for lux_ignore_scope=twilight_slots (everything except day)
TWILIGHT_SLOTS = frozenset(
    {
        "astro_dawn",
        "nautical_dawn",
        "civil_dawn",
        "gold_dawn",
        "gold_dusk",
        "civil_dusk",
        "nautical_dusk",
        "astro_dusk",
        "night",
    }
)
# Every slot including day, for lux_ignore_scope=all_slots — effectively disables
# the lux gate entirely (e.g. windowless rooms where lux readings are meaningless)
ALL_IGNORE_SLOTS = TWILIGHT_SLOTS | {"day"}
SCENE_EXTRACTION_MAX_RETRIES = 6  # Try for 1 minute (6 attempts * 10 seconds)
SCENE_EXTRACTION_RETRY_INTERVAL = 10.0  # seconds
SCENE_REFRESH_DEBOUNCE = 1.0  # seconds

HUE_DYNAMIC_PALETTE = "dynamic_palette"  # a Hue lamp's dynamics status while it rotates

# Deviation comparison tolerances.
# Per-attribute, individually switchable for live A/B testing. 0 = EXACT
# comparison for that attribute (deviates as soon as the values differ at all);
# > 0 swallows differences up to that amount (e.g. Hue bridge rounding). The
# comparison is always `diff > TOLERANCE`, so 0 is the exact case automatically.
# Strategy: verify EXACT first, then raise one attribute at a time and compare
# against the exact run to tell hardware rounding from genuine deviations.
# Default to exact (0). Calibration starting points in comments.
DEVIATION_BRIGHTNESS_TOLERANCE = 3  # out of 255  (calibrate: ~3)
DEVIATION_XY_TOLERANCE = (
    0.005  # Euclidean distance in xy space (calibrated: real bridge rounding ≈ 0.0001)
)
DEVIATION_TEMP_TOLERANCE = (
    1  # mireds (calibrated exact; ~10 was an early guess, not real bridge behavior)
)
DEVIATION_HS_TOLERANCE_H = 2.0  # degrees
DEVIATION_HS_TOLERANCE_S = 2.0  # percent

# ── Primary Channel slot definitions ──
# The 10 fixed astral zones, in chronological order. Order and zone are not
# editable; only scene_entity_id and offset_minutes are configurable per slot.
STANDARD_ZONES = [
    "astro_dawn",
    "nautical_dawn",
    "civil_dawn",
    "gold_dawn",
    "day",
    "gold_dusk",
    "civil_dusk",
    "nautical_dusk",
    "astro_dusk",
    "night",
]
STANDARD_NAMES = {
    "astro_dawn": "Astronomical dawn",
    "nautical_dawn": "Nautical dawn",
    "civil_dawn": "Civil dawn",
    "gold_dawn": "Golden dawn",
    "day": "Day",
    "gold_dusk": "Golden dusk",
    "civil_dusk": "Civil dusk",
    "nautical_dusk": "Nautical dusk",
    "astro_dusk": "Astronomical dusk",
    "night": "Night",
}

# The evening zones that may carry a "not before" floor, in chain order. A floor
# that pushes one of them later shifts every later zone of this chain by the same
# delta; the order here is the order that delta propagates in.
NOT_BEFORE_ZONES: tuple[str, ...] = (
    "gold_dusk",
    "civil_dusk",
    "nautical_dusk",
    "astro_dusk",
    "night",
)
# The zones a pushed evening slot is capped against on the following day.
MORNING_ZONES: tuple[str, ...] = tuple(
    z for z in STANDARD_ZONES if z not in NOT_BEFORE_ZONES
)
# A floor of 12:00–23:59 is the same evening, 00:00–03:59 is after midnight of the
# following night; 04:00–11:59 is invalid.
NOT_BEFORE_EVENING_FROM_MINUTES = 12 * 60
NOT_BEFORE_AFTER_MIDNIGHT_UNTIL_MINUTES = 4 * 60


# Default template configuration for newly created areas
DEFAULT_AREA_TEMPLATE = {
    "inputs": [
        {
            "id": "motion_4011420a",
            "name": None,
            "type": "motion",
            "entity_ids": [],
            "activity": "activity_b04fef97",
            "enabled": True,
            "rule": None,
            "lux_threshold": None,
            "lux_watch_window": None,
            "lux_ignore_active": False,
            "lux_ignore_scope": LuxIgnoreScope.NONE.value,
            "retrigger": RetriggerMode.EVERY.value,
        },
        {
            "id": "event_0cf81d91",
            "name": None,
            "type": "event",
            "entity_ids": [],
            "activity": "activity_a7ae5492",
            "enabled": True,
            "rule": None,
            "event_type": None,
        },
        {
            "id": "event_c325c375",
            "name": None,
            "type": "event",
            "entity_ids": [],
            "activity": "activity_1c5fd855",
            "enabled": True,
            "rule": None,
            "event_type": None,
        },
        {
            "id": "binary_1d9958e7",
            "name": None,
            "type": "binary",
            "entity_ids": [],
            "activity": "activity_c3abaeee",
            "enabled": True,
            "rule": None,
            "aggregation": "any",
            "aggregation_count": None,
        },
        {
            "id": "button_d319b0b3",
            "name": None,
            "type": "button",
            "activity": "activity_1c5fd855",
            "enabled": True,
            "rule": None,
            "button_mode": "click",
            "label": "Reset",
            "create_entity": False,
        },
        {
            "id": "binary_8f2a1b94",
            "name": "Ambient",
            "type": "binary",
            "entity_ids": [],
            "activity": None,
            "enabled": True,
            "rule": "rule_92bf6f67",
            "aggregation": "any",
            "aggregation_count": None,
        },
    ],
    "activities": [
        {
            "id": "activity_b04fef97",
            "name": "Motion",
            "suppress_inputs": [],
            "auto_expire_enabled": True,
            "auto_expire": "00:05:00",
            "action": {
                "type": "slot",
                "excluded_slots": {
                    "primary": [],
                    "channel_e0c3dd6b": [
                        "custom_80635c06",
                        "custom_ea7c9f51",
                        "custom_631b9f14",
                        "custom_5cb9c9a3",
                        "custom_8148b20b",
                        "custom_159cacc9",
                        "custom_489cd4cb"
                    ]
                },
                "respect_manual_off": False,
            },
            "release_action": {"type": "turn_off"},
            "transition_off_seconds": 0,
        },
        {
            "id": "activity_a7ae5492",
            "name": "Manual",
            "suppress_inputs": ["motion_4011420a"],
            "auto_expire_enabled": False,
            "auto_expire": None,
            "action": {
                "type": "slot",
                "excluded_slots": None,
                "respect_manual_off": False,
            },
            "release_action": {"type": "turn_off"},
            "transition_off_seconds": 0,
        },
        {
            "id": "activity_1c5fd855",
            "name": "Reset",
            "suppress_inputs": [],
            "auto_expire_enabled": False,
            "auto_expire": None,
            "action": {
                "type": ActionType.RESET.value,
                "entity_targets": [],
                "scope": ResetScope.AREA.value,
                "configured_entities": [],
            },
            "release_action": {"type": "none"},
            "transition_off_seconds": 0,
        },
        {
            "id": "activity_c3abaeee",
            "name": "Sleep",
            "suppress_inputs": ["motion_4011420a"],
            "auto_expire_enabled": False,
            "auto_expire": None,
            "action": {"type": ActionType.BLOCK.value},
            "release_action": {"type": "turn_off"},
            "transition_off_seconds": None,
        },
    ],
    "sensors": [
        {
            "id": "illuminance_814db760",
            "name": None,
            "type": "illuminance",
            "entity_ids": [],
            "aggregation": "min",
        }
    ],
    "primary_slots": {},
    "custom_channels": {
        "channel_e0c3dd6b": {
            "name": "Ambient",
            "enabled": True,
            "slots": [
                {
                    "id": "custom_80635c06",
                    "name": STANDARD_NAMES["astro_dawn"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "astro_dawn",
                    "fixed_time": None,
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                    "hue_activate_dynamic": HueDynamicMode.HUE.value,
                    "hue_dynamic_speed": None,
                    "not_before": None,
                },
                {
                    "id": "custom_ea7c9f51",
                    "name": STANDARD_NAMES["civil_dawn"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "civil_dawn",
                    "fixed_time": None,
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                    "hue_activate_dynamic": HueDynamicMode.HUE.value,
                    "hue_dynamic_speed": None,
                    "not_before": None,
                },
                {
                    "id": "custom_631b9f14",
                    "name": STANDARD_NAMES["day"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "day",
                    "fixed_time": None,
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                    "hue_activate_dynamic": HueDynamicMode.HUE.value,
                    "hue_dynamic_speed": None,
                    "not_before": None,
                },
                {
                    "id": "custom_5cb9c9a3",
                    "name": STANDARD_NAMES["civil_dusk"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "civil_dusk",
                    "fixed_time": None,
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                    "hue_activate_dynamic": HueDynamicMode.HUE.value,
                    "hue_dynamic_speed": None,
                    "not_before": None,
                },
                {
                    "id": "custom_8148b20b",
                    "name": STANDARD_NAMES["astro_dusk"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "astro_dusk",
                    "fixed_time": None,
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                    "hue_activate_dynamic": HueDynamicMode.HUE.value,
                    "hue_dynamic_speed": None,
                    "not_before": None,
                },
                {
                    "id": "custom_159cacc9",
                    "name": STANDARD_NAMES["night"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "night",
                    "fixed_time": None,
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                    "hue_activate_dynamic": HueDynamicMode.HUE.value,
                    "hue_dynamic_speed": None,
                    "not_before": None,
                },
                {
                    "id": "custom_489cd4cb",
                    "name": "Late Evening",
                    "start_type": StartType.FIXED.value,
                    "zone": None,
                    "fixed_time": "22:00",
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                    "hue_activate_dynamic": HueDynamicMode.HUE.value,
                    "hue_dynamic_speed": None,
                    "not_before": None,
                },
            ],
        },
    },
    "rules": [
        {
            "id": "rule_92bf6f67",
            "name": "Ambient",
            "enabled": True,
            "applied_activities": ["activity_b04fef97"],
            "excluded_slots_override": {},
            "auto_expire_mode": RuleAutoExpireMode.NONE.value,
            "auto_expire_enabled": None,
            "auto_expire": None,
            "suppressed_inputs_override": [],
            "respect_manual_off_override": None,
            "auto_disabled_reason": None,
        }
    ],
}
