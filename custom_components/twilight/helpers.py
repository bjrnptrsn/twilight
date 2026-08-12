"""Helper utilities for the Twilight integration."""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Coroutine, Iterator, Sequence
from typing import TYPE_CHECKING, Any

from homeassistant.core import Context, HomeAssistant

from .config_model import ActionConfig, SlotActionConfig
from .const import (
    CONTEXT_PREFIX,
    DEFAULT_BINARY_AGGREGATION,
    DEFAULT_LUX_IGNORE_ACTIVE,
    DEFAULT_LUX_IGNORE_SCOPE,
    DEFAULT_LUX_THRESHOLD,
    DEFAULT_LUX_WATCH_WINDOW,
    DEFAULT_MOTION_RETRIGGER,
    DEFAULT_TRANSITION_ON_SECONDS,
    DOMAIN,
    ActionType,
    AggregationMode,
    InputType,
)

SIM_TEMPLATE_ELIGIBLE_TYPES = frozenset(
    {ActionType.SLOT, ActionType.ENTITY, ActionType.LIGHT}
)

if TYPE_CHECKING:
    from .config_model import (
        ActivityConfig,
        AreaConfig,
        ChannelConfig,
        InputConfig,
        MotionInputConfig,
    )
    from .rule_manager import RuleManager
    from .state import RunState, SlotSceneInfo

_LOGGER = logging.getLogger(__name__)


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


def recorder_state_ts(s: dict[str, Any]) -> float:
    """Extract last-updated/last-changed timestamp from a recorder state dict."""
    ts = s.get("lu")
    if ts is None:
        ts = s.get("lc")
    return float(ts) if ts is not None else 0.0


def create_tracked_task(
    hass: HomeAssistant | None,
    coro: Coroutine[Any, Any, Any],
    tasks: set[asyncio.Task[Any]],
) -> asyncio.Task[Any] | None:
    """Create a task tracked in `tasks`, to prevent fire-and-forget leaks or unhandled exceptions."""
    if not hass:
        return None
    # The add-after-create order is an invariant: hass.async_create_task() starts
    # eagerly, so the coroutine's synchronous prefix (up to its first await) runs
    # BEFORE the task lands in `tasks`. A self.cancel() in that prefix (e.g.
    # BaseCallHandler._run() starts with self.cancel()) can therefore never hit
    # the caller's own task — everything cancel() finds here is a foreign task.
    # Swapping the order (or losing eager_start) makes the first _run() cancel
    # itself: CancelledError at the first await, no service call ever sent.
    task = hass.async_create_task(coro)
    tasks.add(task)
    task.add_done_callback(tasks.discard)
    return task


# The scene_map is keyed by (channel_id, slot_id): slot ids are free in custom
# channels and can collide across channels, so a flat slot_id key is not enough
# (scene_map must be channel-aware).
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
    domain_data = hass.data.get(DOMAIN)
    if isinstance(domain_data, dict):
        return domain_data.get("store")
    return None


def get_area_lock(hass: HomeAssistant, area_id: str) -> asyncio.Lock:
    """Return the per-area asyncio.Lock, serializing save/delete for one area_id."""
    domain_data: dict[str, Any] = hass.data.setdefault(DOMAIN, {})
    locks: dict[str, asyncio.Lock] = domain_data.setdefault("area_locks", {})
    return locks.setdefault(area_id, asyncio.Lock())


def remove_area_lock(hass: HomeAssistant, area_id: str) -> None:
    """Remove the per-area asyncio.Lock from memory when an area is deleted.

    Only removes the lock if it is not currently held (lock.locked() is False).
    """
    domain_data = hass.data.get(DOMAIN)
    if isinstance(domain_data, dict):
        locks = domain_data.get("area_locks")
        if isinstance(locks, dict):
            lock = locks.get(area_id)
            if lock and not lock.locked():
                locks.pop(area_id, None)


def get_setup_lock(hass: HomeAssistant) -> asyncio.Lock:
    """Return the single global asyncio.Lock guarding a Twilight (re-)setup.

    Per-area locks (get_area_lock) only serialize a save/delete against a
    setup's teardown loop for area_ids the setup already knows about
    (engines.keys() before the reload). A brand-new area's first save can
    still register its engine — under its own, previously-unknown area
    lock — in the unguarded window between that teardown loop and the
    unconditional engines.clear() that follows it, only to have that fresh
    engine discarded (leaked, since it's never torn down) right after. This
    lock closes that gap: async_setup holds it for the whole reload, and
    area/save, area/delete, and global/import (the other writers of
    hass.data[DOMAIN]["engines"]) all acquire it briefly before their own
    per-area lock(s) so none of them can register/remove an engine while a
    reload is mid-flight — including the window where the reload has
    released every individual area lock but is still suspended in
    store.async_load(), holding only this lock.
    """
    domain_data: dict[str, Any] = hass.data.setdefault(DOMAIN, {})
    lock: asyncio.Lock = domain_data.setdefault("setup_lock", asyncio.Lock())
    return lock


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
    hass: HomeAssistant, area_id: str, entity_id: str | None, action: str | None
) -> None:
    """Call the HA service matching an EntityTargetConfig's domain/action.

    Used by the `reset` activity action to drive additional entities beyond
    turn_off_all_channels() (input_boolean/switch on/off/toggle, script
    activate). Unknown domain/action combos are logged and skipped — a
    misconfigured target must not crash the reset.
    """
    if not entity_id or "." not in entity_id or not action:
        _LOGGER.warning(
            "Invalid entity_target: entity_id=%s action=%s", entity_id, action
        )
        return
    domain = entity_id.split(".", 1)[0]
    service = _ENTITY_TARGET_SERVICES.get(domain, {}).get(action)
    if service is None:
        _LOGGER.warning(
            "Unsupported entity_target domain/action: %s / %s", domain, action
        )
        return
    domain_service, service_name = service
    context = Context(id=f"{CONTEXT_PREFIX}{area_id}_reset_entity_target")
    await hass.services.async_call(
        domain_service, service_name, {"entity_id": entity_id}, context=context
    )


def dispatch_button_input(
    hass: HomeAssistant, area_id: str, input_id: str, active: bool
) -> str | None:
    """Look up a button input and trigger/toggle it via its engine's button_handler.

    `input_id` may be either the input's technical id or its configured name
    (case-insensitive); id is tried first. Shared by the `twilight.trigger_input`
    service and the `twilight/trigger_input` WS command, which must stay in sync
    on lookup/validation behavior.
    Returns an error code ("not_found" / "invalid_format" / "ambiguous") on
    failure, else None.
    """
    engine = hass.data.get(DOMAIN, {}).get("engines", {}).get(area_id)
    if not engine:
        return "not_found"

    inp = engine.config.input_by_id(input_id)
    if inp is None:
        needle = input_id.casefold()
        by_name = [
            i for i in engine.config.inputs if (i.name or "").casefold() == needle
        ]
        if len(by_name) > 1:
            return "ambiguous"
        inp = by_name[0] if by_name else None
    if inp is None:
        return "not_found"

    if inp.type != InputType.BUTTON:
        return "invalid_format"

    handler = engine.button_handler
    if (inp.button_mode or "click") == "toggle":
        handler.toggle(inp.id, active)
    else:
        handler.trigger(inp.id)
    return None


def resolve_transition_on_seconds(
    channel: ChannelConfig | None,
    area: AreaConfig,
) -> int:
    """Resolve transition_on_seconds via channel -> area -> const default."""
    if channel is not None and channel.transition_on_seconds is not None:
        try:
            return int(channel.transition_on_seconds)
        except (ValueError, TypeError):
            pass
    if area.transition_on_seconds is not None:
        try:
            return int(area.transition_on_seconds)
        except (ValueError, TypeError):
            pass
    return DEFAULT_TRANSITION_ON_SECONDS


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
    inp: InputConfig,
    input_type: InputType | str,
) -> tuple[str, int | None]:
    """Resolve (mode, count) for a binary input via input → const default.

    Binary inputs aggregate the state of multiple entities into one active flag
    (see aggregate_active). Motion does not use this — it uses resolve_retrigger.
    """
    if input_type != InputType.BINARY:
        raise ValueError("resolve_aggregation is binary-only")
    mode = getattr(inp, "aggregation", None) or DEFAULT_BINARY_AGGREGATION
    count = getattr(inp, "aggregation_count", None)
    return str(mode), count


def resolve_retrigger(inp: InputConfig) -> str:
    """Resolve the re-trigger mode ("every"/"first") for a motion input.

    This controls whether every motion event re-triggers the activity (restarting
    the auto-expire timer) or only the first activation does — it is not a
    multi-entity aggregation.
    """
    retrigger = getattr(inp, "retrigger", None)
    return str(retrigger or DEFAULT_MOTION_RETRIGGER)


def resolve_lux_threshold(
    inp: MotionInputConfig | None,
    area: AreaConfig,
) -> float | int:
    """Resolve lux_threshold via motion input -> area -> const default."""
    if inp is not None and inp.lux_threshold is not None:
        return inp.lux_threshold
    if area.lux_threshold is not None:
        return area.lux_threshold
    return DEFAULT_LUX_THRESHOLD


def resolve_lux_watch_window(
    inp: MotionInputConfig | None,
    area: AreaConfig,
) -> int:
    """Resolve lux_watch_window via motion input -> area -> const default."""
    if inp is not None and inp.lux_watch_window is not None:
        return inp.lux_watch_window
    if area.lux_watch_window is not None:
        return area.lux_watch_window
    return DEFAULT_LUX_WATCH_WINDOW


def resolve_lux_ignore_active(
    inp: MotionInputConfig | None,
    area: AreaConfig,
) -> bool:
    """Resolve lux_ignore_active via motion input -> area -> const default."""
    if inp is not None and inp.lux_ignore_active is not None:
        return inp.lux_ignore_active
    if area.lux_ignore_active is not None:
        return area.lux_ignore_active
    return DEFAULT_LUX_IGNORE_ACTIVE


def resolve_lux_ignore_scope(
    inp: MotionInputConfig | None,
    area: AreaConfig,
) -> str:
    """Resolve lux_ignore_scope via motion input -> area -> const default."""
    if inp is not None and inp.lux_ignore_scope is not None:
        return str(inp.lux_ignore_scope)
    if area.lux_ignore_scope is not None:
        return str(area.lux_ignore_scope)
    return DEFAULT_LUX_IGNORE_SCOPE


def is_slot_excluded(
    config: AreaConfig,
    state: RunState,
    channel_id: str,
    slot_id: str,
) -> bool:
    """Whether a channel's slot is excluded from the running activity's slot action.

    Only the `action` phase of a `slot`-type activity action supports
    `excluded_slots` (see SlotActionConfig) — `release_action` always applies
    all channels/slots regardless. Free function (not a Coordinator method) so
    websocket/subscribe.py can call it from an engine/state snapshot alone.
    """
    activity = config.activity_by_id(state.active_activity)
    if activity is None:
        return False
    action = activity.action
    if action is None:
        return False

    if not isinstance(action, SlotActionConfig) or not action.excluded_slots:
        return False

    return slot_id in action.excluded_slots.get(channel_id, ())


def is_slot_excluded_effective(
    config: AreaConfig,
    state: RunState,
    rule_manager: RuleManager,
    channel_id: str,
    slot_id: str,
) -> bool:
    """Whether a slot is excluded once active Rule overrides are applied.

    Same activity-only check as `is_slot_excluded()`, but additionally consults
    `rule_manager.get_effective_excluded_slots()` — the same merge
    (activity default, replaced by the union of active matching rules) that
    `action_handler.apply_slot_action_over_channels()` uses. Without this, a
    Rule-excluded slot would only be turned off on the next
    `reapply_active_activity_rules()` re-trigger instead of immediately on the
    next natural slot change / anticipatory fade / live state push.
    """
    activity_id = state.active_activity
    if not activity_id:
        return is_slot_excluded(config, state, channel_id, slot_id)

    activity = config.activity_by_id(activity_id)
    action = activity.action if activity else None
    default_excluded = (
        action.excluded_slots if isinstance(action, SlotActionConfig) and action.excluded_slots else {}
    )

    effective = rule_manager.get_effective_excluded_slots(activity_id, default_excluded)
    return slot_id in effective.get(channel_id, ())


def simulation_template_eligible(config: AreaConfig, template: str | None) -> bool:
    """Whether an activity may serve as a presence-simulation template.

    Eligible = it exists and its start action switches a light on
    (slot/entity/light). No implicit type default — a `None`-typed action is
    not eligible.
    """
    if not template:
        return False
    activity = config.activity_by_id(template)
    if activity is None:
        return False
    action = activity.action
    action_type = action.type if action else None
    return action_type in SIM_TEMPLATE_ELIGIBLE_TYPES


def get_activity_supports_excluded_slots(activity: ActivityConfig | None) -> bool:
    """Whether an activity supports excluded slots overrides."""
    if not activity or not activity.action:
        return False
    return activity.action.type == ActionType.SLOT


def get_activity_supports_auto_expire(activity: ActivityConfig | None) -> bool:
    """Whether an activity supports auto_expire_mode overrides (native timer enabled)."""
    if not activity:
        return False
    if activity.action and activity.action.type == ActionType.RESET:
        return False
    return activity.auto_expire_enabled is not False


def get_activity_supports_borrowed_auto_expire(
    activity: ActivityConfig | None,
) -> bool:
    """Whether an activity supports borrowed auto_expire duration from a rule."""
    if not activity:
        return False
    if activity.action and activity.action.type == ActionType.RESET:
        return False
    return activity.auto_expire_enabled is False


def get_activity_supports_input_suppression(activity: ActivityConfig | None) -> bool:
    """Whether an activity supports input suppression overrides."""
    if not activity:
        return False
    return not (activity.action and activity.action.type == ActionType.RESET)


def get_activity_has_rule_support(activity: ActivityConfig | None) -> bool:
    """Whether an activity supports any rule override feature."""
    if not activity:
        return False
    return (
        get_activity_supports_excluded_slots(activity)
        or get_activity_supports_auto_expire(activity)
        or get_activity_supports_borrowed_auto_expire(activity)
        or get_activity_supports_input_suppression(activity)
    )


def coerce_action(
    action: dict[str, Any] | ActionConfig | None,
) -> ActionConfig:
    """Normalize a missing or dict action into a typed ActionConfig. No implicit type default."""
    if isinstance(action, ActionConfig):
        return action
    if isinstance(action, dict):
        return ActionConfig.from_dict(action)
    return ActionConfig.from_dict({"type": None})

