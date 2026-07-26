"""Constants for the Twilight integration."""

from __future__ import annotations

from enum import StrEnum
from typing import Any

from homeassistant.const import (
    STATE_HOME,
    STATE_ON,
    STATE_OPEN,
)

DOMAIN = "twilight"

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
    """Supported activity action/release_action types."""

    SLOT = "slot"
    ENTITY = "entity"
    LIGHT = "light"
    NONE = "none"
    TURN_OFF = "turn_off"
    SIMULATION = "simulation"
    RESET = "reset"


class LuxIgnoreScope(StrEnum):
    """Which slots should ignore the lux threshold for motion inputs."""

    NONE = "none"
    TWILIGHT_SLOTS = "twilight_slots"
    ALL_SLOTS = "all_slots"


class SimulationMode(StrEnum):
    """Umbrella modes for the `simulation` action. Only presence_heatmap in v1."""

    PRESENCE_HEATMAP = "presence_heatmap"


class SimLuxMode(StrEnum):
    """When the presence simulation is allowed to switch lights on.

    The lux gate normally lives in the motion input, which the simulation
    skips — so the sim-handler evaluates one of these itself before an "on" step.
    """

    THRESHOLD = "threshold"  # only when current lux <= lux_threshold
    DUSK_DAWN = "dusk_dawn"  # only when the primary slot is in TWILIGHT_SLOTS
    ALWAYS = "always"  # no condition


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


class ExpireCheckMode(StrEnum):
    """Whether/how motion & binary inputs postpone an activity's auto-expire."""

    DISABLED = "disabled"
    RESPECT_LUX = "respect_lux"
    IGNORE_LUX = "ignore_lux"


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
BACKUP_VERSION = 1
# Maximum allowed offset magnitude in minutes for vertical vertipper protection in slot editor.
MAX_OFFSET_MINUTES = 180


# Default configuration values
DEFAULT_LUX_THRESHOLD = 30
DEFAULT_AUTO_EXPIRE = (
    "03:00:00"  # HH:MM:SS — overnight safety net (e.g. "Guest" left active)
)
DEFAULT_LUX_WATCH_WINDOW = 10  # seconds
DEFAULT_EXPIRE_CHECK_MODE = ExpireCheckMode.RESPECT_LUX
DEFAULT_ACTION_TYPE = ActionType.SLOT
DEFAULT_RELEASE_ACTION_TYPE = ActionType.TURN_OFF
DEFAULT_TRANSITION_ON_SECONDS = 60
DEFAULT_TRANSITION_OFF_SECONDS = 0
DEFAULT_LUX_AGGREGATION = "min"
DEFAULT_MOTION_RETRIGGER = RetriggerMode.EVERY
DEFAULT_BINARY_AGGREGATION = AggregationMode.ANY
DEFAULT_RETRY_DELAYS = (1.0, 1.5, 3.0, 5.0, 8.0)
ECHO_SETTLE_WINDOW_SECONDS = 1.0

# Presence simulation defaults (PRESENCE_SIMULATION_PLAN.md)
DEFAULT_SIMULATION_MODE = SimulationMode.PRESENCE_HEATMAP
DEFAULT_SIM_LUX_MODE = SimLuxMode.DUSK_DAWN
SIM_LOOP_TICK_S = 60.0  # fallback loop tick when the template has no auto_expire
# (normally the tick is dynamic: 0.4 * auto_expire, see presence_simulation.md §3)
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


def default_primary_slots() -> list[dict[str, Any]]:
    """Build a fresh list of the 10 fixed Primary-Channel slots."""
    return [
        {
            "id": z,
            "name": STANDARD_NAMES[z],
            "start_type": StartType.ASTRAL.value,
            "zone": z,
            "offset_minutes": 0,
            "scene_entity_id": None,
            "configured_entities": [],
        }
        for z in STANDARD_ZONES
    ]


def default_channels() -> dict[str, Any]:
    """Build the default channels dict for a new area (Primary only)."""
    return {
        PRIMARY_CHANNEL_ID: {
            "name": "Primary",
            "enabled": True,
            "slots": default_primary_slots(),
        }
    }


# Default template configuration for newly created areas
DEFAULT_AREA_TEMPLATE = {
    "inputs": [
        {
            "id": "motion",
            "type": "motion",
            "activity": "motion",
            "rule": None,
            "enabled": True,
            "entity_ids": [],
            "lux_threshold": None,
            "lux_watch_window": None,
            "lux_ignore_active": False,
            "lux_ignore_scope": LuxIgnoreScope.NONE,
            "retrigger": RetriggerMode.EVERY,
        },
        {
            "id": "manual",
            "type": "event",
            "activity": "manual",
            "rule": None,
            "enabled": True,
            "entity_ids": [],
        },
        {
            "id": "reset",
            "type": "event",
            "activity": "reset",
            "rule": None,
            "enabled": True,
            "entity_ids": [],
        },
        {
            "id": "binary",
            "type": "binary",
            "entity_ids": [],
            "rule": None,
            "activity": "sleep",
            "aggregation": None,
            "aggregation_count": None,
        },
        {
            "id": "clear",
            "type": "button",
            "activity": "reset",
            "rule": None,
            "enabled": True,
            "button_mode": "click",
            "label": "Reset",
            "create_entity": False,
        },
    ],
    "activities": [
        {
            "id": "motion",
            "name": "Motion",
            "suppress_inputs": [],
            "auto_expire": "00:05:00",
            "expire_check_mode": ExpireCheckMode.RESPECT_LUX,
            "action": {"type": None},
            "release_action": {"type": None},
            "transition_off_seconds": 0,
        },
        {
            "id": "manual",
            "name": "Manual",
            "suppress_inputs": ["motion"],
            "auto_expire": "00:00:00",
            "expire_check_mode": None,
            "action": {"type": None},
            "release_action": {"type": None},
            "transition_off_seconds": 0,
        },
        {
            "id": "reset",
            "name": "Reset",
            "suppress_inputs": [],
            "auto_expire": None,
            "expire_check_mode": None,
            "action": {"type": ActionType.RESET},
            "release_action": {"type": None},
            "transition_off_seconds": 0,
        },
        {
            "id": "sleep",
            "name": "Sleep",
            "suppress_inputs": ["motion"],
            "auto_expire": "03:00:00",
            "expire_check_mode": None,
            "action": {"type": ActionType.NONE},
            "release_action": {"type": None},
            "transition_off_seconds": 0,
        },
    ],
    "sensors": [
        {
            "id": "illuminance_1",
            "type": "illuminance",
            "entity_ids": [],
            "aggregation": "min",
        }
    ],
    "custom_channels": {
        "ambient": {
            "name": "Ambient",
            "enabled": True,
            "slots": [
                {
                    "id": "custom_astro_dawn",
                    "name": STANDARD_NAMES["astro_dawn"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "astro_dawn",
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                },
                {
                    "id": "custom_civil_dawn",
                    "name": STANDARD_NAMES["civil_dawn"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "civil_dawn",
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                },
                {
                    "id": "custom_day",
                    "name": STANDARD_NAMES["day"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "day",
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                },
                {
                    "id": "custom_civil_dusk",
                    "name": STANDARD_NAMES["civil_dusk"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "civil_dusk",
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                },
                {
                    "id": "custom_astro_dusk",
                    "name": STANDARD_NAMES["astro_dusk"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "astro_dusk",
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                },
                {
                    "id": "custom_night",
                    "name": STANDARD_NAMES["night"],
                    "start_type": StartType.ASTRAL.value,
                    "zone": "night",
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                },
                {
                    "id": "custom_late_evening",
                    "name": "Late Evening",
                    "start_type": StartType.FIXED.value,
                    "zone": None,
                    "fixed_time": "22:00",
                    "offset_minutes": 0,
                    "scene_entity_id": None,
                    "configured_entities": [],
                },
            ],
        },
    },
    "rules": [
        {
            "id": "party",
            "name": "Party",
            "enabled": True,
            "applied_activities": ["motion"],
            "slot_overrides": {},
        }
    ],
}
