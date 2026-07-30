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
from homeassistant.helpers.event import async_call_later
from homeassistant.util import dt as dt_util

from .call_handler import (
    BaseCallHandler,
    LightDirectCallHandler,
    SlotDirectCallHandler,
    TurnOffCallHandler,
)
from .config_model import (
    ActionConfig,
    EntityActionConfig,
    LightActionConfig,
    SimulationActionConfig,
    SlotActionConfig,
)
from .const import (
    PRIMARY_CHANNEL_ID,
    SIM_DEFAULT_RANGE,
    SIM_DEFAULT_RESOLUTION,
    SIM_LOOP_TICK_S,
    TWILIGHT_SLOTS,
    ActionType,
    SimLuxMode,
)
from .deviation import check_entity_deviation
from .heatmap import async_compute_heatmap
from .helpers import (
    channel_entities,
    create_tracked_task,
    get_slot_info,
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
    types.ts; the UI offers only these). The else branch handles ``none`` —
    whose correct behaviour is to do nothing to the lights (just clear
    scene_activated_at, no service call). entity/light can never be a release
    type, so "the else issues no call" is intended, not a bug.
    """
    t = release.type or ActionType.TURN_OFF
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
    action: ActionConfig,
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
    default_excluded = cast(SlotActionConfig, action).excluded_slots or {}
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
        elif not was_activated:
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

    @property
    def pauses_slots(self) -> bool:
        """Return True if this handler overrides/pauses default slot scheduling."""
        return True

    def _start_timer(self, delay: float, callback: Callable[[], Any]) -> None:
        """Start a timer in the event loop that schedules a coroutine callback."""

        def _fire(_now: datetime) -> None:
            self._start_task(callback())

        unsub = async_call_later(self.hass, delay, _fire)
        self._timers.append(unsub)

    def _start_task(self, coro: Coroutine[Any, Any, Any]) -> asyncio.Task[Any] | None:
        """Start an asynchronous task and track it for cancellation."""
        return create_tracked_task(self.hass, coro, self._tasks)

    def cancel(self) -> None:
        """Cancel all running timers and tasks."""
        for unsub in self._timers:
            unsub()
        for t in list(self._tasks):
            t.cancel()
        self._timers.clear()
        self._tasks.clear()

    def _before_start(self) -> bool:
        """Lifecycle hook run before action starts."""
        return True

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
        self.cancel()
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
        """Apply a scene or script."""
        c = self._coordinator
        entity_action = cast(EntityActionConfig, action)
        entity_id = entity_action.entity_id
        if entity_id:
            c.update_state(scene_activated_at=datetime.now(UTC))
            c.lux_manager.update_lux_state()
            handler = SlotDirectCallHandler(c.engine, PRIMARY_CHANNEL_ID, entity_id)
            c.swap_channel_handler(PRIMARY_CHANNEL_ID, handler, [])


class LightActionHandler(BaseActionHandler):
    """Handler that sets direct light parameters on the primary channel."""

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Apply direct light settings."""
        c = self._coordinator
        c.update_state(scene_activated_at=datetime.now(UTC))
        c.lux_manager.update_lux_state()
        light_action = cast(LightActionConfig, action)
        targets = list(light_action.targets)
        if light_action.state == STATE_OFF:
            handler: BaseCallHandler = TurnOffCallHandler(
                c.engine, PRIMARY_CHANNEL_ID, transition_off=transition_off
            )
            c.swap_channel_handler(PRIMARY_CHANNEL_ID, handler, targets)
            return
        handler = LightDirectCallHandler(c.engine, PRIMARY_CHANNEL_ID)
        c.swap_channel_handler(PRIMARY_CHANNEL_ID, handler, targets, action)


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
    over the coordinator slot-primitives (never via the registry handlers, see
    PRESENCE_SIMULATION_PLAN.md §5.4), and a per-motion "off" timer with real
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

    async def start(
        self,
        action: ActionConfig,
        active_slots: dict[str, str],
        transition_off: int | None = None,
    ) -> None:
        """Load buckets and start the simulation loop."""
        if not self._before_start():
            return
        sim = cast(SimulationActionConfig, action)
        self._template = sim.template_activity
        c = self._coordinator
        if not simulation_template_eligible(c.engine.config, self._template):
            _LOGGER.warning(
                "[%s] Presence simulation: template_activity '%s' is missing or not "
                "a light-switching activity (slot/entity/light); nothing to play back",
                c.engine.area_id,
                self._template,
            )
            self._template = None
            return
        self._lux_mode = sim.lux_mode or SimLuxMode.DUSK_DAWN
        self._motion_buckets = await self._load_buckets(sim)
        # Tick once immediately so the simulation reacts at activation instead of
        # only after the first LOOP_TICK_S; the tick re-schedules the loop itself.
        await self._tick()

    async def _load_buckets(
        self, sim: SimulationActionConfig
    ) -> dict[str, list[float]]:
        """Resolve motion buckets once: saved profile if set, else dynamic recorder window."""
        c = self._coordinator
        profile = c.engine.config.heatmap_profile_by_id(sim.heatmap_profile_id)
        if profile is not None:
            return dict(profile.motion_buckets)
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
        return computed.motion_buckets

    def _get_tick_interval_seconds(self) -> float:
        """Compute dynamic tick interval based on template auto_expire seconds (40% of expire duration)."""
        c = self._coordinator
        if not self._template:
            return SIM_LOOP_TICK_S
        expire_secs = c._get_activity_auto_expire_seconds(self._template)
        if expire_secs <= 0:
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
        """Probability scaled by ratio of tick interval to auto_expire duration."""
        b = self._current_probability()
        c = self._coordinator
        if not self._template:
            return b
        expire_secs = c._get_activity_auto_expire_seconds(self._template)
        if expire_secs <= 0:
            return b
        tick_secs = self._get_tick_interval_seconds()
        return min(1.0, b * (tick_secs / expire_secs))

    async def _tick(self) -> None:
        """One loop tick: roll simulated motion, apply on-step + off-timer restart."""
        try:
            if random.random() < self._scaled_probability() and self._lux_allows_on():
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
        action = c._resolve_action(cast(str, self._template))
        c.update_state(scene_activated_at=datetime.now(UTC))
        c.lux_manager.update_lux_state()
        t = action.type or ActionType.SLOT
        if t == ActionType.SLOT:
            apply_slot_action_over_channels(
                c,
                action,
                c.run_state.active_slots,
                was_activated=False,
            )
        elif t == ActionType.ENTITY:
            entity_id = cast(EntityActionConfig, action).entity_id
            if entity_id:
                entity_handler = SlotDirectCallHandler(
                    c.engine, PRIMARY_CHANNEL_ID, entity_id
                )
                c.swap_channel_handler(PRIMARY_CHANNEL_ID, entity_handler, [])
        elif t == ActionType.LIGHT:
            light_action = cast(LightActionConfig, action)
            targets = list(light_action.targets)
            light_handler = LightDirectCallHandler(c.engine, PRIMARY_CHANNEL_ID)
            c.swap_channel_handler(PRIMARY_CHANNEL_ID, light_handler, targets, action)

    def _restart_off_timer(self) -> None:
        """Cancel + restart the internal off-timer (real motion retrigger semantics)."""
        if self._off_unsub is not None:
            self._off_unsub()
            self._off_unsub = None
        c = self._coordinator
        template = cast(str, self._template)
        expire_secs = c._get_activity_auto_expire_seconds(template)
        if expire_secs <= 0:
            return

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
        release = c._resolve_release_action(template)
        transition_off = c._get_activity_transition_off_seconds(template)
        apply_release_over_channels(c, release, transition_off)

    def cancel(self) -> None:
        """Cancel the loop, the internal off-timer, and all tracked tasks."""
        if self._off_unsub is not None:
            self._off_unsub()
            self._off_unsub = None
        super().cancel()
