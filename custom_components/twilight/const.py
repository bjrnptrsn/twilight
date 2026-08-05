"""Constants for the Twilight integration."""

from __future__ import annotations

import logging
from enum import StrEnum
from typing import Any

from homeassistant.const import (
    STATE_HOME,
    STATE_ON,
    STATE_OPEN,
)

_LOGGER = logging.getLogger(__name__)

DOMAIN = "twilight"
STORAGE_VERSION = 2

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
    BLOCK = "block"
    TURN_OFF = "turn_off"
    SIMULATION = "simulation"
    RESET = "reset"


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
BACKUP_VERSION = 1
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
ECHO_SETTLE_WINDOW_SECONDS = 1.0

# Re-arm delay when the slot scheduler could not determine any active slot
# (in practice: a broken time zone, which makes the sun calculation raise).
# Without a retry the scheduler would stay dormant until the next HA restart.
# Long on purpose — the cause is a config error that stays broken until fixed,
# so a short interval would only spam the log. See TwilightManager.
SLOT_RECOVERY_RETRY_SECONDS = 300

# Presence simulation defaults (PRESENCE_SIMULATION_PLAN.md)
SIM_FREQUENCY_FACTORS: dict[str, float] = {
    SimFrequencyMode.VERY_LOW.value: 0.25,
    SimFrequencyMode.LOW.value: 0.5,
    SimFrequencyMode.NORMAL.value: 1.0,
    SimFrequencyMode.HIGH.value: 2.0,
    SimFrequencyMode.VERY_HIGH.value: 4.0,
}
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
    return materialize_primary_slots({})


def materialize_primary_slots(
    raw_slots: dict[str, Any] | list[dict[str, Any]] | None,
) -> list[dict[str, Any]]:
    """Materialize Primary-Channel slots into 10 complete slot dicts.

    Accepts two input shapes:
      - the sparse overrides dict (the store's persistence format): keyed by
        standard zone ID, each value a dict with only the fields that deviate
        from default (offset_minutes/scene_entity_id/configured_entities).
      - a full slot list (the frontend's `area/save` payload / call-site
        format used throughout config_model.py and tests): one dict per zone
        with all seven SlotConfig fields; only the three override fields are
        actually read, the rest is recomputed from STANDARD_ZONES/STANDARD_NAMES.

    Unknown zone keys/ids or fields, and fields with an implausible type, are
    pruned and replaced by their default — logged as a warning so a
    corrupted/hand-edited entry is visible, not silently accepted (see
    docs/architecture/slots.md §3.1).

    The list path projects each item onto the three override fields before that
    validation runs — otherwise the structurally fixed fields of a full slot dict
    (id/name/start_type/zone/fixed_time) would each be reported as an unknown field.
    """
    override_by_zone: dict[str, dict[str, Any]] = {}

    if isinstance(raw_slots, dict):
        for zone_id, override in raw_slots.items():
            if not isinstance(zone_id, str) or zone_id not in STANDARD_ZONES:
                _LOGGER.warning(
                    "Discarding Primary-Channel slot override for unknown zone %r "
                    "(not one of the 10 standard zones)",
                    zone_id,
                )
                continue
            if not isinstance(override, dict):
                _LOGGER.warning(
                    "Discarding Primary-Channel slot override for zone %r: "
                    "expected a dict, got %s",
                    zone_id,
                    type(override).__name__,
                )
                continue
            override_by_zone[zone_id] = override
    elif isinstance(raw_slots, list):
        for item in raw_slots:
            if not isinstance(item, dict):
                continue
            item_zone = item.get("zone") or item.get("id")
            if isinstance(item_zone, str) and item_zone in STANDARD_ZONES:
                override_by_zone[item_zone] = {
                    "offset_minutes": item.get("offset_minutes"),
                    "scene_entity_id": item.get("scene_entity_id"),
                    "configured_entities": item.get("configured_entities"),
                    "hue_activate_dynamic": item.get("hue_activate_dynamic"),
                    "hue_dynamic_speed": item.get("hue_dynamic_speed"),
                }
    elif raw_slots is not None:
        _LOGGER.warning(
            "Discarding Primary-Channel slots: expected a dict or list, got %s",
            type(raw_slots).__name__,
        )

    result: list[dict[str, Any]] = []
    for zone in STANDARD_ZONES:
        override = override_by_zone.get(zone) or {}

        offset_mins = override.get("offset_minutes")
        if offset_mins is not None and not isinstance(offset_mins, (int, float)):
            _LOGGER.warning(
                "Discarding invalid offset_minutes %r for Primary-Channel zone %r "
                "(expected a number)",
                offset_mins,
                zone,
            )
            offset_mins = None

        scene_id = override.get("scene_entity_id")
        if scene_id is not None and not isinstance(scene_id, str):
            _LOGGER.warning(
                "Discarding invalid scene_entity_id %r for Primary-Channel zone %r "
                "(expected a string)",
                scene_id,
                zone,
            )
            scene_id = None

        entities = override.get("configured_entities")
        if entities is not None and not isinstance(entities, (list, tuple)):
            _LOGGER.warning(
                "Discarding invalid configured_entities %r for Primary-Channel zone %r "
                "(expected a list)",
                entities,
                zone,
            )
            entities = None

        unknown_keys = set(override) - {
            "offset_minutes",
            "scene_entity_id",
            "configured_entities",
            "hue_activate_dynamic",
            "hue_dynamic_speed",
        }
        if unknown_keys:
            _LOGGER.warning(
                "Discarding unknown field(s) %s in Primary-Channel override for zone %r",
                sorted(unknown_keys),
                zone,
            )

        speed_val = override.get("hue_dynamic_speed")
        result.append(
            {
                "id": zone,
                "name": STANDARD_NAMES[zone],
                "start_type": StartType.ASTRAL.value,
                "zone": zone,
                "offset_minutes": int(offset_mins) if offset_mins is not None else 0,
                "scene_entity_id": scene_id,
                "configured_entities": list(entities) if entities is not None else [],
                "hue_activate_dynamic": bool(override.get("hue_activate_dynamic", False)),
                "hue_dynamic_speed": int(speed_val) if isinstance(speed_val, (int, float)) else None,
            }
        )
    return result


def default_channels() -> dict[str, Any]:
    """Build the default channels dict for a new area (Primary only)."""
    return {
        PRIMARY_CHANNEL_ID: {
            "name": "Primary",
            "enabled": True,
            "slots": {},
        }
    }


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
                }
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
            "action": {"type": "slot", "excluded_slots": None},
            "release_action": {"type": "turn_off"},
            "transition_off_seconds": 0,
        },
        {
            "id": "activity_1c5fd855",
            "name": "Reset",
            "suppress_inputs": [],
            "auto_expire_enabled": False,
            "auto_expire": None,
            "action": {"type": ActionType.RESET.value, "entity_targets": []},
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
            "auto_disabled_reason": None,
        }
    ],
}
