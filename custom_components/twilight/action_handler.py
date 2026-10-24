"""Action handlers for Twilight control logic."""

from __future__ import annotations

import asyncio
import logging
import random
from abc import ABC, abstractmethod
from collections.abc import Callable, Coroutine
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any, cast

from homeassistant.const import STATE_OFF, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import callback as ha_callback
from homeassistant.helpers.event import async_call_later
from homeassistant.util import dt as dt_util

from .call_handler import TurnOffCallHandler
from .config_model import (
    ActionConfig,
    EntityActionConfig,
    HeatmapProfileConfig,
    LightActionConfig,
    SimulationActionConfig,
    SlotActionConfig,
)
from .const import (
    PRIMARY_CHANNEL_ID,
    SIM_DEFAULT_RANGE,
    SIM_DEFAULT_RESOLUTION,
    SIM_FREQUENCY_FACTORS,
    SIM_LOOP_TICK_S,
    TWILIGHT_SLOTS,
    ActionType,
    SimFrequencyMode,
    SimLuxMode,
)
from .deviation import check_entity_deviation
from .heatmap import async_compute_heatmap
from .helpers import (
    channel_entities,
    create_tracked_task,
    get_slot_info,
    get_store,
    simulation_template_eligible,
)

if TYPE_CHECKING:
    from .coordinator import Coordinator

_LOGGER = logging.getLogger(__name__)


def _channel_matches_slot(
    coordinator: Coordinator, channel_id: str, slot_id: str
) -> bool:
    """True if every entity of the channel already matches the slot's expected state."""
    scene_info = get_slot_info(coordinator.engine.scene_map, channel_id, slot_id)
    if not scene_info or not scene_info.expected_states:
        return False
    # Dynamic-Hue slots always "match": the Bridge rotates the palette on its
    # own, so a per-entity comparison would deviate and dispatch a pointless
    # reapply on every re-trigger (reapply() guards itself, but the dispatch
    # work is wasted — the same reasoning as the retry guard in _can_retry()).
    slot = coordinator.engine.config.slot(channel_id, slot_id)
    if slot and slot.hue_activate_dynamic and scene_info.supports_dynamic:
        return True
    hass = coordinator.engine.hass
    for entity_id, expected in scene_info.expected_states.items():
        ha_state = hass.states.get(entity_id)
        if check_entity_deviation(ha_state, expected):
            return False
    return True


def apply_release_over_channels(
    coordinator: Coordinator,
    release: ActionConfig,
    transition_off: int | None,
) -> None:
    """Apply a release action's slot/turn_off/none dispatch across all channels.

    Shared by ``BaseActionHandler.stop()`` (real activity release) and
    ``PresenceSimulationActionHandler._off_step()`` (per-motion off-timer). The
    caller is responsible for any preceding teardown (cancel/cancel_all_handlers)
    that this function deliberately does not perform.

    A release action is only turn_off | slot | none (ReleaseActionType in
    types.ts; the UI offers only these). The else branch handles ``none``
    and a `None`-typed release (no implicit type default) — whose correct
    behaviour is to do nothing to the lights (just clear scene_activated_at,
    no service call). entity/light can never be a release type, so "the else
    issues no call" is intended, not a bug.
    """
    t = release.type
    if t == ActionType.SLOT:
        coordinator.update_state(scene_activated_at=datetime.now(UTC))
        coordinator.lux_manager.update_lux_state()
        coordinator.apply_all_channels_slots()
    else:
        coordinator.update_state(scene_activated_at=None)
        coordinator.lux_manager.update_lux_state()
        if t == ActionType.TURN_OFF:
            coordinator.turn_off_all_channels(transition_off=transition_off)


def apply_slot_action_over_channels(
    coordinator: Coordinator,
    action: SlotActionConfig,
    active_slots: dict[str, str],
    *,
    was_activated: bool,
    transition_off: int | None = None,
) -> None:
    """Apply a ``slot``-type start action's per-channel dispatch.

    Shared by ``SlotActionHandler.start()`` and the slot branch of
    ``PresenceSimulationActionHandler._on_step()``. The simulation always passes
    ``was_activated=False`` so it re-applies the slot directly on every tick
    (it never needs ``reapply_deviating_slot``). Only the ``slot`` action type
    is handled here; entity/light stay in their respective call sites because
    they diverge too much (e.g. LightActionHandler's STATE_OFF branch) to share
    without hiding behaviour behind flags.
    """
    default_excluded = action.excluded_slots or {}
    activity_id = coordinator.run_state.active_activity
    excluded_slots = (
        coordinator.rule_manager.get_effective_excluded_slots(
            activity_id, default_excluded
        )
        if activity_id
        else default_excluded
    )
    for channel_id in coordinator.channel_ids:
        slot_id = active_slots.get(channel_id)
        if not slot_id:
            continue
        if slot_id in excluded_slots.get(channel_id, ()):
            if not _channel_already_off(coordinator, channel_id):
                coordinator.turn_off_channel(channel_id, transition_off=transition_off)
        elif not was_activated or _channel_already_off(coordinator, channel_id):
            # A channel that is fully off (e.g. turned off by a previous
            # activity's excluded_slots, while scene_activated_at stayed set
            # for the area as a whole) is a fresh entry, not a correction —
            # route it through the same direct start as the never-activated
            # case. Otherwise it falls into reapply_deviating_slot() below,
            # whose dynamic-Hue "always matches" guard (_channel_matches_slot)
            # then silently no-ops instead of turning the channel back on.
            coordinator.apply_channel_slot(channel_id, slot_id, direct=True)
        elif not _channel_matches_slot(coordinator, channel_id, slot_id):
            coordinator.reapply_deviating_slot(channel_id, slot_id)


def _channel_already_off(coordinator: Coordinator, channel_id: str) -> bool:
    """True if every entity controlled by the channel is already off.

    Used to skip redundant turn_off_channel() calls for excluded slots — every
    activity_requested (e.g. repeated motion while the activity is already
    active) re-runs SlotActionHandler.start(), and _apply_action() clears all
    channel handlers beforehand, so a call-handler-type check can't detect
    "already turned off"; checking live entity state can.

    An entity that HA reports as explicitly unavailable/unknown is skipped
    rather than counted as "not off": check_entity_deviation() reports it as
    deviating, so counting it would make a single offline lamp defeat the guard
    permanently and re-send turn_off to the whole channel on every motion
    re-trigger. An entity with no state object at all is NOT skipped — that is
    "we have never heard from it", not "it is known to be offline", and the
    channel must still get its turn_off.
    """
    entities = channel_entities(
        coordinator.engine.scene_map,
        channel_id,
        coordinator.engine.config.manual_only,
    )
    if not entities:
        return True
    hass = coordinator.engine.hass
    for entity_id in entities:
        ha_state = hass.states.get(entity_id)
        if ha_state is not None and ha_state.state in (
            STATE_UNAVAILABLE,
            STATE_UNKNOWN,
        ):
            continue
        if check_entity_deviation(ha_state, {"state": STATE_OFF}):
            return False
    return True


class BaseActionHandler(ABC):
    """Abstract base class for all Twilight action handlers, providing execution infrastructure."""

    def __init__(self, coordinator: Coordinator) -> None:
        """Initialize the action handler."""
        self._coordinator = coordinator
        self.hass = coordinator.engine.hass
        self._timers: list[Callable[[], None]] = []
        self._tasks: set[asyncio.Task[Any]] = set()
        self._cancelled = False

    @property
    def pauses_slots(self) -> bool:
        """Return True if this handler overrides/pauses default slot scheduling."""
        return True

    def _start_timer(self, delay: float, callback: Callable[[], Any]) -> None:
        """Start a timer in the event loop that schedules a coroutine callback.

        No-ops after cancel(): a task's `finally` block can still run to
        completion after `task.cancel()` (an `await` inside `finally` is not
        re-cancelled by the same CancelledError) and re-arm a timer here. The
        `_cancelled` guard, set before cancel() tears anything down, stops
        that timer from being armed on an already torn-down handler.
        """
        if self._cancelled:
            return

        @ha_callback
        def _fire(_now: datetime) -> None:
            if unsub in self._timers:
                self._timers.remove(unsub)
            self._start_task(callback())

        unsub = async_call_later(self.hass, delay, _fire)
        self._timers.append(unsub)

    def _start_task(self, coro: Coroutine[Any, Any, Any]) -> asyncio.Task[Any] | None:
        """Start an asynchronous task and track it for cancellation."""
        return create_tracked_task(self.hass, coro, self._tasks)

    async def cancel(self) -> None:
        """Cancel all running timers and tasks, and wait for them to actually finish.

        task.cancel() alone does not stop a task that is suspended in a real
        await (e.g. a Recorder query) — it only schedules CancelledError for
        the next suspension point. Without the
        gather() below, a caller that immediately restarts the handler (e.g.
        Coordinator._apply_action()) could reset `_cancelled` back to False
        before the old task's `finally` block (which re-arms a timer via
        `_start_timer`) has run, arming a second, stale tick chain alongside
        the new one. Mirrors climate_group_helper's
        BaseServiceCallHandler.async_cancel_all().
        """
        self._cancelled = True
        for unsub in self._timers:
            unsub()
        self._timers.clear()
        tasks = list(self._tasks)
        for t in tasks:
            t.cancel()
        self._tasks.clear()
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)

    def _after_stop(self) -> None:  # noqa: B027 -- optional hook, no-op by default
        """Lifecycle hook run after action stops."""

    @abstractmethod
    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Start execution of the action."""

    async def stop(
        self, release: ActionConfig, transition_off: int | None = None
    ) -> None:
        """Standard release behavior for action handlers."""
        await self.cancel()
        c = self._coordinator

        c.cancel_all_handlers()

        apply_release_over_channels(c, release, transition_off)
        self._after_stop()


class SlotActionHandler(BaseActionHandler):
    """Handler that applies standard slot-based configuration across all channels."""

    @property
    def pauses_slots(self) -> bool:
        """SlotActionHandler does not pause standard slot scheduling."""
        return False

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Apply slot-based scene configuration."""
        if not isinstance(action, SlotActionConfig):
            raise TypeError(
                f"SlotActionHandler.start() requires a SlotActionConfig, got {type(action).__name__}"
            )
        c = self._coordinator
        if not active_slots:
            return

        was_activated = c.run_state.scene_activated_at is not None

        c.update_state(
            scene_activated_at=c.run_state.scene_activated_at or datetime.now(UTC)
        )
        c.lux_manager.update_lux_state()

        apply_slot_action_over_channels(
            c,
            action,
            active_slots,
            was_activated=was_activated,
            transition_off=transition_off,
        )


class EntityActionHandler(BaseActionHandler):
    """Handler that applies a specific scene or script on the primary channel."""

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Apply a scene or script.

        A re-trigger while the Entity-Action is already active goes through
        `reapply()` instead of `start()` — same
        was_activated pattern as SlotActionHandler.start()/
        apply_slot_action_over_channels().
        """
        if not isinstance(action, EntityActionConfig):
            raise TypeError(
                f"EntityActionHandler.start() requires an EntityActionConfig, got {type(action).__name__}"
            )
        c = self._coordinator
        entity_id = action.entity_id
        if entity_id:
            was_activated = c.run_state.scene_activated_at is not None
            c.update_state(
                scene_activated_at=c.run_state.scene_activated_at or datetime.now(UTC)
            )
            c.lux_manager.update_lux_state()
            handler = c.scene_handler(PRIMARY_CHANNEL_ID)
            if handler is None:
                _LOGGER.error(
                    "[%s] No SceneCallHandler for primary channel — cannot apply "
                    "Entity-Action",
                    c.engine.area_id,
                )
                return
            if was_activated:
                c.swap_channel_handler(
                    PRIMARY_CHANNEL_ID,
                    handler,
                    lambda grace_elapsed: handler.reapply(
                        entity_id, grace_elapsed=grace_elapsed
                    ),
                )
            else:
                c.swap_channel_handler(
                    PRIMARY_CHANNEL_ID,
                    handler,
                    lambda grace_elapsed: handler.start(entity_id),
                )


class LightActionHandler(BaseActionHandler):
    """Handler that sets direct light parameters on the primary channel."""

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Apply direct light settings.

        A re-trigger while the Light-Action is already active goes through
        `reapply()` instead of `start()` — same
        was_activated pattern as SlotActionHandler/EntityActionHandler. Does
        not apply to the `state == off` branch: TurnOffCallHandler's turn_off
        is idempotent, nothing to compare against.
        """
        if not isinstance(action, LightActionConfig):
            raise TypeError(
                f"LightActionHandler.start() requires a LightActionConfig, got {type(action).__name__}"
            )
        c = self._coordinator
        was_activated = c.run_state.scene_activated_at is not None
        c.update_state(
            scene_activated_at=c.run_state.scene_activated_at or datetime.now(UTC)
        )
        c.lux_manager.update_lux_state()
        targets = list(action.targets)
        if action.state == STATE_OFF:
            off_handler = TurnOffCallHandler(
                c.engine, PRIMARY_CHANNEL_ID, transition_off=transition_off
            )
            c.swap_channel_handler(
                PRIMARY_CHANNEL_ID,
                off_handler,
                lambda grace_elapsed: off_handler.execute(
                    targets, grace_elapsed=grace_elapsed
                ),
            )
            return
        light_handler = c.light_handler(PRIMARY_CHANNEL_ID)
        if light_handler is None:
            _LOGGER.error(
                "[%s] No LightCallHandler for primary channel — cannot apply "
                "Light-Action",
                c.engine.area_id,
            )
            return
        if was_activated:
            c.swap_channel_handler(
                PRIMARY_CHANNEL_ID,
                light_handler,
                lambda grace_elapsed: light_handler.reapply(targets, action),
            )
        else:
            c.swap_channel_handler(
                PRIMARY_CHANNEL_ID,
                light_handler,
                lambda grace_elapsed: light_handler.start(targets, action),
            )


class BlockActionHandler(BaseActionHandler):
    """Handler that does not affect light states on start, keeping standard release."""

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Do nothing on start."""
        pass


class TurnOffActionHandler(BaseActionHandler):
    """Handler that turns off all channels on start."""

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Turn off all channels."""
        c = self._coordinator
        c.update_state(scene_activated_at=None)
        c.lux_manager.update_lux_state()
        c.turn_off_all_channels(transition_off=transition_off)


class PresenceSimulationActionHandler(BaseActionHandler):
    """Play back a template activity's light behaviour timed by a heatmap.

    This is the *one* real active activity (`pauses_slots=False`). An internal
    loop ticks at a fixed interval and rolls a simulated "motion" per tick from
    the heatmap buckets; an "on" step applies the template activity's `action`
    over the coordinator slot-primitives (never via the registry handlers), and
    a per-motion "off" timer with real
    retrigger semantics turns the light off via the template's `release_action`
    when it lapses — all without ever touching the real activity level.
    """

    @property
    def pauses_slots(self) -> bool:
        """The simulation must let automatic slot transitions run during "on"."""
        return False

    def __init__(self, coordinator: Coordinator) -> None:
        """Initialize the presence simulation handler."""
        super().__init__(coordinator)
        self._motion_buckets: dict[str, list[float]] = {}
        self._off_unsub: Callable[[], None] | None = None
        self._template: str | None = None
        self._lux_mode: str = SimLuxMode.DUSK_DAWN
        self._frequency_mode: str = SimFrequencyMode.NORMAL
        self._heatmap_profile_id: str | None = None
        self._started = False

    @property
    def started(self) -> bool:
        """Return True once start() has begun (set synchronously, before its first await).

        Unlike `is_running` (which only reflects `_timers`/`_tasks`), this stays
        accurate during `start()`'s synchronous prefix and its first `await` — the
        window where a concurrent start() call (e.g. boot-restore racing an
        input-triggered start while `_load_buckets()`'s Recorder query is in
        flight) would otherwise go undetected.
        """
        return self._started

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Load buckets and start the simulation loop."""
        if not isinstance(action, SimulationActionConfig):
            raise TypeError(
                f"PresenceSimulationActionHandler.start() requires a SimulationActionConfig, got {type(action).__name__}"
            )
        # Set synchronously, before the first await — see the `started` property.
        self._started = True
        # This handler is a static, reused instance (one per Coordinator,
        # see coordinator.py's _action_handlers dict) — cancel() leaves
        # _cancelled set so a re-armed timer from an in-flight tick's
        # finally block can't outlive teardown (see _start_timer's
        # docstring). Reset it here so the *next* start() (e.g. after a
        # reboot resumes the simulation, coordinator.py's
        # restore_active_handler) can arm timers again.
        self._cancelled = False
        self._template = action.template_activity
        c = self._coordinator
        if not simulation_template_eligible(c.engine.config, self._template):
            _LOGGER.warning(
                "[%s] Presence simulation: template_activity '%s' is missing or not "
                "a light-switching activity (slot/entity/light); nothing to play back",
                c.engine.area_id,
                self._template,
            )
            self._template = None
            self._started = False
            return
        self._lux_mode = action.lux_mode or SimLuxMode.DUSK_DAWN
        self._frequency_mode = action.frequency_mode or SimFrequencyMode.NORMAL
        self._heatmap_profile_id = action.heatmap_profile_id
        self._motion_buckets = await self._load_buckets(dynamic_fallback=True) or {}
        if self._cancelled:
            _LOGGER.debug(
                "[%s] Presence simulation start cancelled while loading buckets",
                c.engine.area_id,
            )
            return
        _LOGGER.info(
            "[%s] Presence simulation started: template=%s lux_mode=%s "
            "frequency_mode=%s weekdays_with_data=%s tick_interval=%.1fs",
            c.engine.area_id,
            self._template,
            self._lux_mode,
            self._frequency_mode,
            sorted(k for k, v in self._motion_buckets.items() if any(v)),
            self._get_tick_interval_seconds(),
        )
        # Tick once immediately so the simulation reacts at activation instead of
        # only after the first LOOP_TICK_S; the tick re-schedules the loop itself.
        await self._tick()

    async def _load_buckets(
        self, *, dynamic_fallback: bool
    ) -> dict[str, list[float]] | None:
        """Resolve presence buckets: saved profile if set, else dynamic recorder window.

        Reads a referenced profile straight from the store (`_store_profile_by_id`)
        rather than `engine.config.heatmap_profile_by_id()`. `engine.config` is
        parsed once at engine construction and never mutated —
        `twilight/heatmap/profile/save|delete` only writes the store, so a handler
        cached from `engine.config` would keep playing back a stale (or since-
        deleted) profile's buckets until the area's next `area/save` or an HA
        restart.

        `dynamic_fallback` controls the "no profile referenced" path:
        `async_compute_heatmap` runs a Recorder query, so it may only run once per
        occurrence — at `start()` (`dynamic_fallback=True`) and, once, right after
        a referenced profile is found deleted from the store (see
        `_refresh_buckets`). Re-running it on *every* tick's re-read would replace
        one performance bug (stale profile) with another (a Recorder query every
        ~60s); when `dynamic_fallback=False` and no profile is found, `None` is
        returned so the caller keeps the previously computed buckets instead.

        Uses `motion_presence_buckets` (fraction of days with *any* motion in
        the bucket) rather than `motion_buckets` (fraction of active seconds)
        as the trigger-probability basis — PIR sensors are only on for a few
        seconds per trigger, so the seconds-fraction is structurally tiny even
        during genuinely active hours and understates real presence. Profiles
        saved before this field existed fall back to `motion_buckets` so they
        keep working until recalculated.
        """
        c = self._coordinator
        try:
            profile = self._store_profile_by_id(self._heatmap_profile_id)
            if profile is not None:
                return dict(profile.motion_presence_buckets or profile.motion_buckets)
        except Exception:
            # A profile whose stored shape doesn't match HeatmapProfileConfig
            # (e.g. a bucket field holding a list instead of a dict after a
            # format change, restored via the official backup-import flow —
            # store.py's area normalization only checks "is a list", not each
            # profile's field shapes) must not raise out of start(): start()
            # sets _started=True before its first await, so an uncaught
            # exception here would leave the handler stuck "active" forever
            # with no loop/timer armed, and the boot restore guard
            # (coordinator.py's `not started`) would then never retry it.
            # Treat it like a deleted profile: forget the reference so the
            # caller stops retrying this same corrupt entry on every tick,
            # then fall through to the dynamic recorder fallback below.
            _LOGGER.exception(
                "[%s] Corrupt heatmap profile '%s' in store — "
                "falling back to dynamic recorder buckets",
                c.engine.area_id,
                self._heatmap_profile_id,
            )
            self._heatmap_profile_id = None
        if not dynamic_fallback:
            return None
        try:
            computed = await async_compute_heatmap(
                c.engine.hass,
                c.engine.config,
                resolution=SIM_DEFAULT_RESOLUTION,
                range_str=SIM_DEFAULT_RANGE,
            )
        except Exception:
            _LOGGER.exception(
                "[%s] Presence simulation: failed to compute motion buckets from "
                "recorder history; falling back to empty buckets",
                c.engine.area_id,
            )
            return {}
        return computed.motion_presence_buckets

    async def _refresh_buckets(self) -> None:
        """Re-read a referenced saved profile from the store before each tick.

        A profile that is still referenced but no longer found in the store (the
        user deleted it while the simulation was running) switches the
        simulation to the dynamic recorder fallback immediately, on the very
        next tick — matching what happens on a fresh `start()` instead of
        silently keeping the deleted profile's stale buckets until some later,
        unrelated restart (area/save, HA reboot, the activity re-triggering).
        That one-time dynamic computation is cheap to allow here (it happens
        once, right when the deletion is first observed) — see `_load_buckets`'s
        `dynamic_fallback` docstring for why it must not repeat on every tick.

        A no-op (keeps the existing `_motion_buckets`) when no profile was ever
        referenced in the first place — nothing changed, nothing to refresh.
        """
        if self._heatmap_profile_id is None:
            return
        profile_was_deleted = (
            self._store_profile_by_id(self._heatmap_profile_id) is None
        )
        buckets = await self._load_buckets(dynamic_fallback=profile_was_deleted)
        if profile_was_deleted:
            # Stop looking for a profile that's gone — otherwise every future
            # tick would re-trigger the (now pointless) store lookup and, worse,
            # the dynamic fallback again since profile_was_deleted would stay True.
            self._heatmap_profile_id = None
        if buckets is not None:
            self._motion_buckets = buckets

    def _store_profile_by_id(
        self, profile_id: str | None
    ) -> HeatmapProfileConfig | None:
        """Look up a saved heatmap profile fresh from the store, not `engine.config`.

        Falls back to the immutable `engine.config` copy if the store isn't
        registered yet (should not happen once the engine is running, but keeps
        this defensive rather than raising).
        """
        if not profile_id:
            return None
        c = self._coordinator
        store = get_store(c.engine.hass)
        if store is None:
            return c.engine.config.heatmap_profile_by_id(profile_id)
        area = store.get_area(c.engine.area_id)
        if area is None:
            return None
        for raw in area.get("heatmap_profiles") or []:
            if isinstance(raw, dict) and raw.get("id") == profile_id:
                return HeatmapProfileConfig.from_dict(raw)
        return None

    def _get_tick_interval_seconds(self) -> float:
        """Compute dynamic tick interval based on template auto_expire seconds (40% of expire duration)."""
        c = self._coordinator
        if not self._template:
            return SIM_LOOP_TICK_S
        expire_secs = c.get_activity_auto_expire_seconds(self._template)
        if not expire_secs:
            # None (auto_expire switched off) or 0 — no duration to derive a
            # tick from, fall back to the fixed loop tick.
            return SIM_LOOP_TICK_S
        return max(15.0, expire_secs * 0.4)

    def _schedule_tick(self) -> None:
        """Schedule the next simulation loop tick at a dynamic interval."""
        self._start_timer(self._get_tick_interval_seconds(), self._tick)

    def _current_probability(self) -> float:
        """The heatmap probability b for the current weekday and time window."""
        now = dt_util.now()
        buckets = self._motion_buckets.get(str(now.weekday()))
        if not buckets:
            return 0.0
        minute_of_day = now.hour * 60 + now.minute
        # buckets span the day evenly; map the minute to a bucket index
        idx = minute_of_day * len(buckets) // 1440
        if idx >= len(buckets):
            idx = len(buckets) - 1
        return buckets[idx]

    def _scaled_probability(self) -> float:
        """Probability scaled by ratio of tick interval to auto_expire duration and frequency mode."""
        b = self._current_probability()
        factor = SIM_FREQUENCY_FACTORS.get(self._frequency_mode, 1.0)
        c = self._coordinator
        if not self._template:
            return b * factor
        expire_secs = c.get_activity_auto_expire_seconds(self._template)
        if not expire_secs:
            return b * factor
        tick_secs = self._get_tick_interval_seconds()
        return min(1.0, b * factor * (tick_secs / expire_secs))

    async def _tick(self) -> None:
        """One loop tick: roll simulated motion, apply on-step + off-timer restart."""
        try:
            await self._refresh_buckets()
            prob = self._scaled_probability()
            roll = random.random()
            lux_ok = self._lux_allows_on()
            fires = roll < prob and lux_ok
            _LOGGER.debug(
                "[%s] Presence simulation tick: probability=%.4f roll=%.4f lux_ok=%s fires=%s",
                self._coordinator.engine.area_id,
                prob,
                roll,
                lux_ok,
                fires,
            )
            if fires:
                await self._on_step()
                self._restart_off_timer()
        except Exception:
            _LOGGER.exception(
                "[%s] Presence simulation tick failed", self._coordinator.engine.area_id
            )
        finally:
            # Always reschedule, even if the block above raised — otherwise the
            # simulation silently stalls until the activity is manually retriggered.
            self._schedule_tick()

    def _lux_allows_on(self) -> bool:
        """Evaluate lux_mode before an "on" step (the sim skips the input gate)."""
        c = self._coordinator
        if self._lux_mode == SimLuxMode.ALWAYS:
            return True
        if self._lux_mode == SimLuxMode.DUSK_DAWN:
            primary_slot = c.run_state.active_slots.get(PRIMARY_CHANNEL_ID)
            return primary_slot in TWILIGHT_SLOTS
        # THRESHOLD: real comparison against the configured lux threshold
        lux_threshold = c.engine.config.lux_threshold
        if lux_threshold is None:
            return True
        lux = c.lux_manager.get_current_lux()
        return lux is not None and lux <= lux_threshold

    async def _on_step(self) -> None:
        """Apply the template activity's start action over the slot-primitives."""
        c = self._coordinator
        action = c.resolve_action(cast(str, self._template))
        c.update_state(scene_activated_at=datetime.now(UTC))
        c.lux_manager.update_lux_state()
        t = action.type
        _LOGGER.info(
            "[%s] Presence simulation on-step: template=%s action_type=%s",
            c.engine.area_id,
            self._template,
            t,
        )
        if t == ActionType.SLOT:
            slot_action = (
                action
                if isinstance(action, SlotActionConfig)
                else SlotActionConfig(type=ActionType.SLOT)
            )
            apply_slot_action_over_channels(
                c,
                slot_action,
                c.run_state.active_slots,
                was_activated=False,
            )
        elif t == ActionType.ENTITY and isinstance(action, EntityActionConfig):
            entity_id = action.entity_id
            if entity_id:
                entity_handler = c.scene_handler(PRIMARY_CHANNEL_ID)
                if entity_handler is None:
                    _LOGGER.error(
                        "[%s] No SceneCallHandler for primary channel — cannot "
                        "apply presence-simulation Entity-Action",
                        c.engine.area_id,
                    )
                    return
                c.swap_channel_handler(
                    PRIMARY_CHANNEL_ID,
                    entity_handler,
                    lambda grace_elapsed: entity_handler.start(entity_id),
                )
        elif t == ActionType.LIGHT and isinstance(action, LightActionConfig):
            targets = list(action.targets)
            light_handler = c.light_handler(PRIMARY_CHANNEL_ID)
            if light_handler is None:
                _LOGGER.error(
                    "[%s] No LightCallHandler for primary channel — cannot apply "
                    "presence-simulation Light-Action",
                    c.engine.area_id,
                )
                return
            c.swap_channel_handler(
                PRIMARY_CHANNEL_ID,
                light_handler,
                lambda grace_elapsed: light_handler.start(targets, action),
            )

    def _restart_off_timer(self) -> None:
        """Cancel + restart the internal off-timer (real motion retrigger semantics)."""
        if self._off_unsub is not None:
            self._off_unsub()
            self._off_unsub = None
        c = self._coordinator
        template = cast(str, self._template)
        expire_secs = c.get_activity_auto_expire_seconds(template)
        if not expire_secs:
            return

        @ha_callback
        def _fire(_now: datetime) -> None:
            self._off_unsub = None
            self._start_task(self._off_step())

        self._off_unsub = async_call_later(self.hass, expire_secs, _fire)

    async def _off_step(self) -> None:
        """Off-timer lapsed: apply the template's release action (light only).

        The real "Presence Simulation" activity stays active — this never calls
        activity_released, only switches the light via the slot-primitives.
        """
        c = self._coordinator
        template = cast(str, self._template)
        release = c.resolve_release_action(template)
        transition_off = c.get_activity_transition_off_seconds(template)
        _LOGGER.info(
            "[%s] Presence simulation off-step: template=%s", c.engine.area_id, template
        )
        apply_release_over_channels(c, release, transition_off)

    async def cancel(self) -> None:
        """Cancel the loop, the internal off-timer, and all tracked tasks."""
        self._started = False
        if self._template is not None:
            _LOGGER.info(
                "[%s] Presence simulation cancelled: template=%s",
                self._coordinator.engine.area_id,
                self._template,
            )
        if self._off_unsub is not None:
            self._off_unsub()
            self._off_unsub = None
        await super().cancel()
