"""Helper utilities for the Twilight integration."""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Coroutine, Iterator, Sequence
from typing import TYPE_CHECKING, Any, Protocol

from homeassistant.core import HomeAssistant

from .const import (
    DEFAULT_ACTION_TYPE,
    DEFAULT_BINARY_AGGREGATION,
    DEFAULT_MOTION_RETRIGGER,
    DOMAIN,
    AggregationMode,
    InputType,
)

if TYPE_CHECKING:
    from .config_model import AreaConfig
    from .state import RunState, SlotSceneInfo

_LOGGER = logging.getLogger(__name__)


class ConfigLike(Protocol):
    """Anything readable like a config dict — plain dicts and the typed
    config_model dataclasses (which bridge `get()` to their raw dict)."""

    def get(self, key: str, default: Any = None) -> Any:
        """Return the raw value for `key`, or `default`."""


def parse_hms_parts(s: str | None) -> tuple[int, int, int] | None:
    """Parse HH:MM:SS string to an (hour, minute, second) tuple. Return None if unset or invalid."""
    if not s or not isinstance(s, str):
        return None
    try:
        parts = s.split(":")
        if len(parts) == 3:
            h, m, sec = int(parts[0]), int(parts[1]), int(parts[2])
            # Reject out-of-range components (e.g. "25:99:99") so a bogus timer
            # value is treated as unset rather than scheduled at a nonsense time.
            if 0 <= h < 24 and 0 <= m < 60 and 0 <= sec < 60:
                return h, m, sec
    except ValueError:
        pass
    return None


def parse_hms(s: str | None) -> int | None:
    """Parse HH:MM:SS string to seconds. Return None if unset or invalid."""
    parts = parse_hms_parts(s)
    if parts is None:
        return None
    h, m, sec = parts
    return h * 3600 + m * 60 + sec


def create_tracked_task(
    hass: HomeAssistant | None,
    coro: Coroutine[Any, Any, Any],
    tasks: set[asyncio.Task[Any]],
) -> asyncio.Task[Any] | None:
    """Create a task tracked in `tasks`, to prevent fire-and-forget leaks or unhandled exceptions."""
    if not hass:
        return None
    task = hass.async_create_task(coro)
    tasks.add(task)
    task.add_done_callback(tasks.discard)
    return task


# The scene_map is keyed by (channel_id, slot_id): slot ids are free in custom
# channels and can collide across channels, so a flat slot_id key is not enough
# (see docs/architecture/multi_channel.md §3, "scene_map must become channel-aware").
SceneMap = dict[tuple[str, str], "SlotSceneInfo"]


def get_slot_info(
    scene_map: SceneMap, channel_id: str, slot_id: str | None
) -> SlotSceneInfo | None:
    """Look up the SlotSceneInfo for one (channel, slot), or None."""
    if not slot_id:
        return None
    return scene_map.get((channel_id, slot_id))


def iter_channel_slots(
    scene_map: SceneMap, channel_id: str
) -> Iterator[tuple[str, SlotSceneInfo]]:
    """Yield (slot_id, info) for every slot of one channel."""
    for (ch_id, slot_id), info in scene_map.items():
        if ch_id == channel_id:
            yield slot_id, info


def channel_entities(
    scene_map: SceneMap, channel_id: str, manual_only: bool = False
) -> set[str]:
    """Union of all controlled entities across one channel's slots.

    Used for the per-channel turn_off (null-slot / disabled channel) so the
    main channel stays untouched. With manual_only, only configured_entities
    are returned (mirrors Coordinator._get_active_slot_entities).
    """
    out: set[str] = set()
    for _slot_id, info in iter_channel_slots(scene_map, channel_id):
        if manual_only:
            out |= set(info.configured_entities)
        else:
            out |= set(info.extracted_entities) | set(info.configured_entities)
    return out


def detect_channel_collisions(scene_map: SceneMap) -> dict[str, list[str]]:
    """Find entities controlled by more than one channel.

    Builds, per channel, the union of its slots' extracted+configured entities
    (the already-resolved sets, so Hue scenes are covered too — see §3 #6) and
    returns {entity_id: [channel_id, ...]} for every entity in >1 channel.
    """
    by_channel: dict[str, set[str]] = {}
    for (ch_id, _slot_id), info in scene_map.items():
        by_channel.setdefault(ch_id, set())
        by_channel[ch_id] |= set(info.extracted_entities) | set(
            info.configured_entities
        )

    entity_channels: dict[str, set[str]] = {}
    for ch_id, entities in by_channel.items():
        for eid in entities:
            entity_channels.setdefault(eid, set()).add(ch_id)

    return {eid: sorted(chs) for eid, chs in entity_channels.items() if len(chs) > 1}


def get_store(hass: HomeAssistant) -> Any | None:
    """Return the TwilightStore from hass.data, or None if not registered yet."""
    return hass.data.get(DOMAIN, {}).get("store")


def partition_by_domain(
    entities: Sequence[str],
) -> tuple[list[str], list[str], list[str]]:
    """Split entities into (lights, switches, others) by entity_id prefix.

    Used wherever a bulk turn_off/turn_on must be split into per-domain service
    calls (light.*, switch.*, homeassistant.* for everything else).
    """
    lights = []
    switches = []
    others = []
    for ent in entities:
        if ent.startswith("light."):
            lights.append(ent)
        elif ent.startswith("switch."):
            switches.append(ent)
        else:
            others.append(ent)
    return lights, switches, others


_ENTITY_TARGET_SERVICES: dict[str, dict[str, tuple[str, str]]] = {
    "input_boolean": {
        "on": ("input_boolean", "turn_on"),
        "off": ("input_boolean", "turn_off"),
        "toggle": ("input_boolean", "toggle"),
    },
    "switch": {
        "on": ("switch", "turn_on"),
        "off": ("switch", "turn_off"),
        "toggle": ("switch", "toggle"),
    },
    "script": {
        "activate": ("script", "turn_on"),
    },
}


async def dispatch_entity_target(
    hass: HomeAssistant, entity_id: str | None, action: str | None
) -> None:
    """Call the HA service matching an EntityTargetConfig's domain/action.

    Used by the `reset` activity action to drive additional entities beyond
    turn_off_all_channels() (input_boolean/switch on/off/toggle, script
    activate). Unknown domain/action combos are logged and skipped — a
    misconfigured target must not crash the reset.
    """
    if not entity_id or "." not in entity_id or not action:
        _LOGGER.warning("Invalid entity_target: entity_id=%s action=%s", entity_id, action)
        return
    domain = entity_id.split(".", 1)[0]
    service = _ENTITY_TARGET_SERVICES.get(domain, {}).get(action)
    if service is None:
        _LOGGER.warning(
            "Unsupported entity_target domain/action: %s / %s", domain, action
        )
        return
    domain_service, service_name = service
    await hass.services.async_call(
        domain_service, service_name, {"entity_id": entity_id}
    )


def dispatch_button_input(
    hass: HomeAssistant, area_id: str, input_id: str, active: bool
) -> str | None:
    """Look up a button input and trigger/toggle it via its engine's button_handler.

    Shared by the `twilight.trigger_input` service and the `twilight/trigger_input`
    WS command, which must stay in sync on lookup/validation behavior.
    Returns an error code ("not_found" / "invalid_format") on failure, else None.
    """
    engine = hass.data.get(DOMAIN, {}).get("engines", {}).get(area_id)
    if not engine:
        return "not_found"

    inp = engine.config.input_by_id(input_id)
    if inp is None:
        return "not_found"

    if inp.type != InputType.BUTTON:
        return "invalid_format"

    handler = engine.button_handler
    if (inp.button_mode or "click") == "toggle":
        handler.toggle(input_id, active)
    else:
        handler.trigger(input_id)
    return None


def get_config_value(
    hass: HomeAssistant | None,
    configs: Sequence[ConfigLike | None],
    key: str,
    default: Any,
) -> Any:
    """Retrieve configuration value from a sequence of config-like objects.

    Accepts raw dicts and typed config_model objects alike (see ConfigLike).
    Falls back in order:
      1. First non-None value found in the `configs` list.
      2. Global configuration from the TwilightStore.
      3. Default value provided.
    """
    for config in configs:
        if config is not None and (val := config.get(key)) is not None:
            return val

    if hass is not None:
        store = get_store(hass)
        if store:
            global_val = store.get_global().get(key)
            if global_val is not None:
                return global_val

    return default


def aggregate_active(
    active_flags: Sequence[bool],
    mode: str,
    count: int | None = None,
) -> bool:
    """Aggregate a list of boolean flags using the specified mode.

    Supported modes:
      - "all": True if all flags are True.
      - "count": True if at least `count` flags are True (count clamped to [1, len(flags)]).
      - "any" / others: True if at least one flag is True.
    """
    if not active_flags:
        return False
    if mode == AggregationMode.ALL:
        return all(active_flags)
    if mode == AggregationMode.COUNT:
        n = count if count is not None and count > 0 else 1
        return sum(active_flags) >= min(n, len(active_flags))
    return any(active_flags)


def resolve_aggregation(
    hass: HomeAssistant | None,
    inp: ConfigLike,
    area_config: ConfigLike,
    input_type: InputType,
) -> tuple[str, int | None]:
    """Resolve (mode, count) for a binary input via area/input → const.

    Binary inputs aggregate the state of multiple entities into one active flag
    (see aggregate_active). Motion does not use this — it uses resolve_retrigger.
    """
    if input_type != InputType.BINARY:
        raise ValueError("resolve_aggregation is binary-only")
    mode = get_config_value(
        hass, [inp, area_config], "aggregation", DEFAULT_BINARY_AGGREGATION
    )
    count = get_config_value(hass, [inp, area_config], "aggregation_count", None)
    return mode, count


def resolve_retrigger(
    hass: HomeAssistant | None,
    inp: ConfigLike,
    area_config: ConfigLike,
) -> str:
    """Resolve the re-trigger mode ("every"/"first") for a motion input.

    This controls whether every motion event re-triggers the activity (restarting
    the auto-expire timer) or only the first activation does — it is not a
    multi-entity aggregation.
    """
    return str(
        get_config_value(hass, [inp, area_config], "retrigger", DEFAULT_MOTION_RETRIGGER)
    )


def is_slot_excluded(
    config: AreaConfig,
    state: RunState,
    channel_id: str,
    slot_id: str,
) -> bool:
    """Whether a channel's slot is excluded from the running activity's slot action.

    Only the `action` phase of a `slot`-type activity action supports
    `excluded_slot_ids` (see SlotActionConfig) — `release_action` always applies
    all channels/slots regardless. Free function (not a Coordinator method) so
    websocket/subscribe.py can call it from an engine/state snapshot alone.
    """
    activity = config.activity_by_id(state.active_activity)
    if activity is None:
        return False
    action = activity.action
    if action is None:
        return False

    action_type = action.type or DEFAULT_ACTION_TYPE

    if action_type != "slot":
        return False

    # A `type: "slot"` action parses to SlotActionConfig (typed attribute); a
    # `type: None` action that only defaults to "slot" here stays a base
    # ActionConfig without the attribute, so fall back to the raw dict.
    excluded_slot_ids = getattr(action, "excluded_slot_ids", None)
    if excluded_slot_ids is None:
        excluded_slot_ids = action.get("excluded_slot_ids")

    if not excluded_slot_ids:
        return False
    return slot_id in excluded_slot_ids.get(channel_id, ())
