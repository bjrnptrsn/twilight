"""Call handlers for Twilight control logic, implementing execution, transitions, retries, and deviation tracking."""

from __future__ import annotations

import asyncio
import functools
import logging
from collections.abc import Callable, Coroutine, Iterable, Sequence
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any

from homeassistant.components.light import get_supported_color_modes
from homeassistant.const import STATE_OFF, STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Context, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
from homeassistant.util.color import color_temperature_mired_to_kelvin

from .const import (
    CONTEXT_PREFIX,
    DEFAULT_RETRY_DELAYS,
    ECHO_SETTLE_WINDOW_SECONDS,
    HARD_CALL_RESENDS,
    LEAD_CALL_MAX_WAIT_SECONDS,
)
from .deviation import check_entity_deviation, deviating_attrs
from .echo import identify_echo
from .helpers import (
    create_tracked_task,
    enforced_scene_states,
    get_slot_info,
    is_dynamic_slot,
    partition_by_domain,
)
from .state import SlotSceneInfo

if TYPE_CHECKING:
    from .engine import TwilightEngine

_LOGGER = logging.getLogger(__name__)


@dataclass
class CallSpec:
    """Specification for a Home Assistant service call."""

    domain: str
    service: str
    service_data: dict[str, Any]
    # Sent ahead of all non-lead calls, which wait until the lead calls have
    # completed (bounded by LEAD_CALL_MAX_WAIT_SECONDS) — for calls that must
    # reach the device before the rest (see _build_dynamic_enter_calls).
    lead: bool = False


def build_light_service_data(
    hass: HomeAssistant,
    entity_id: str,
    expected: dict[str, Any],
    color_modes_cache: dict[str, set[str]],
    transition: int | None = None,
) -> dict[str, Any]:
    """Build service_data for light.turn_on based on expected state and supported color modes."""
    # A hard call says 0: without a duration the Hue Bridge applies its own
    # default, and a lamp that runs one transition at a time then drops the
    # brightness when the colour command follows.
    service_data: dict[str, Any] = {"entity_id": entity_id, "transition": transition or 0}

    if entity_id not in color_modes_cache:
        try:
            modes = get_supported_color_modes(hass, entity_id) or set()
        except HomeAssistantError:
            # Entity has neither a state nor an entity registry entry
            # (e.g. removed/renamed while still referenced by a scene).
            modes = set()
        color_modes_cache[entity_id] = modes
    supported_modes: set[str] = color_modes_cache[entity_id]

    def supports(mode: str) -> bool:
        return mode in supported_modes if supported_modes else False

    supports_brightness = not supported_modes or any(
        m != "onoff" for m in supported_modes
    )
    if (
        supports_brightness
        and "brightness" in expected
        and expected["brightness"] is not None
    ):
        service_data["brightness"] = expected["brightness"]

    color_mode = expected.get("color_mode")
    color_attr: str | None = None

    if color_mode in ("color_temp", "color_temp_kelvin") and supports("color_temp"):
        color_attr = (
            "color_temp_kelvin"
            if expected.get("color_temp_kelvin") is not None
            else "color_temp"
        )
    elif color_mode == "xy" and supports("xy"):
        color_attr = "xy_color"
    elif color_mode == "hs" and supports("hs"):
        color_attr = "hs_color"
    elif color_mode in ("rgb", "rgbw", "rgbww"):
        if supports("rgb") and expected.get("rgb_color") is not None:
            color_attr = "rgb_color"
        elif supports("rgbw") and expected.get("rgbw_color") is not None:
            color_attr = "rgbw_color"
        elif supports("rgbww") and expected.get("rgbww_color") is not None:
            color_attr = "rgbww_color"
        elif supports("xy") and expected.get("xy_color") is not None:
            color_attr = "xy_color"
        elif supports("hs") and expected.get("hs_color") is not None:
            color_attr = "hs_color"

    if color_attr is None or expected.get(color_attr) is None:
        candidates = [
            ("xy_color", "xy"),
            ("rgb_color", "rgb"),
            ("hs_color", "hs"),
            ("color_temp_kelvin", "color_temp"),
            ("color_temp", "color_temp"),
            ("rgbw_color", "rgbw"),
            ("rgbww_color", "rgbww"),
        ]
        for attr_key, mode_key in candidates:
            if expected.get(attr_key) is not None and supports(mode_key):
                color_attr = attr_key
                break

    if color_attr and expected.get(color_attr) is not None:
        value = expected[color_attr]
        if color_attr == "color_temp":
            try:
                temp_val = int(value) if value is not None else 0
                if temp_val > 0:
                    service_data["color_temp_kelvin"] = (
                        color_temperature_mired_to_kelvin(temp_val)
                    )
                else:
                    _LOGGER.warning("[%s] Invalid color_temp value %s", entity_id, value)
            except (TypeError, ValueError, ZeroDivisionError):
                _LOGGER.warning("[%s] Invalid color_temp value %s", entity_id, value)
        else:
            service_data[color_attr] = value

    return service_data


class BaseCallHandler:
    """Base class for service call execution, retries, and deviation watching.

    Long-lived: one instance per (channel_id, call-art) is built once by the
    Coordinator and reused for the engine's lifetime (see coordinator.py). Every
    public entry point (`start`/`fade`/`complete_fade`/`reapply` on
    SceneCallHandler, `execute` on TurnOffCallHandler) must therefore begin with
    the same reset —
    see `_run()`.
    """

    def __init__(self, engine: TwilightEngine, channel_id: str) -> None:
        """Initialize the call handler."""
        self.engine = engine
        self.channel_id = channel_id
        self.hass: HomeAssistant = engine.hass
        self._timers: list[Callable[[], None]] = []
        self._tasks: set[asyncio.Task[Any]] = set()
        self._unsub_deviation: Callable[[], None] | None = None
        self._reached_target_entities: set[str] = set()
        self._target_states: dict[str, dict[str, Any]] = {}
        self._retry_active: bool = False
        self._last_call_at: datetime | None = None
        self._color_modes_cache: dict[str, set[str]] = {}
        self._reaction_mode: bool = False
        self._reacted_entities: set[str] = set()
        # Retry attempts up to this number resend without checking (see _run()).
        self._forced_resends: int = 0
        # The running call's transition, set by _run(): retries firing later via
        # timers need it for their transition and delays. Not a stored method
        # context — which method runs is still decided by the entry point.
        self._run_transition: int | None = None
        # Set by _run() for the duration of one execution; retry callbacks
        # (_perform_retry_attempt -> _send_retry_call) fire later via timers
        # and need the same suffix the initial call used.
        self._active_context_suffix: str = self.__class__.__name__

    @property
    def elapsed_since_last_call(self) -> float | None:
        """Seconds since the last service call was sent, or None if none was sent yet."""
        if self._last_call_at is None:
            return None
        return (datetime.now(UTC) - self._last_call_at).total_seconds()

    @property
    def is_busy(self) -> bool:
        """True if the handler is actively retrying or sent a call within the settle window."""
        if self._retry_active:
            return True
        elapsed = self.elapsed_since_last_call
        return elapsed is not None and elapsed < ECHO_SETTLE_WINDOW_SECONDS

    def _make_context_id(self, suffix: str) -> str:
        """Build a Twilight context ID for service calls."""
        return f"{CONTEXT_PREFIX}{self.engine.area_id}_{self.channel_id}_{suffix}"

    def _create_task(self, coro: Coroutine[Any, Any, Any]) -> asyncio.Task[Any] | None:
        """Create a tracked task to prevent unhandled task garbage collection."""
        return create_tracked_task(self.hass, coro, self._tasks)

    def _start_timer(self, delay: float, callback_func: Callable[[], Any]) -> None:
        """Schedule a timer in the event loop."""

        @callback
        def _fire(_now: datetime) -> None:
            if unsub in self._timers:
                self._timers.remove(unsub)
            callback_func()

        unsub = async_call_later(self.hass, delay, _fire)
        self._timers.append(unsub)

    def _cancel_timers(self) -> None:
        """Cancel all pending retry timers."""
        for unsub in self._timers:
            unsub()
        self._timers.clear()

    def cancel(self) -> None:
        """Cancel all running tasks, timers, retries and deviation watcher."""
        self._cancel_timers()

        for task in list(self._tasks):
            if not task.done():
                task.cancel()
        self._tasks.clear()

        self._retry_active = False
        self._reaction_mode = False
        self._forced_resends = 0
        self._stop_deviation_watcher()

    def _send_retry_call(
        self,
        entity_id: str,
        expected: dict[str, Any],
        attempt: int,
        transition: int | None,
    ) -> None:
        """Send a single retry call for one entity (shared send code).

        Outside reaction mode a "check" retry (context id prefix `check_retry_`,
        allows turn_off for non-light entities/state); in reaction mode a "blind"
        one (context id prefix `retry_`, always a light.turn_on).
        """
        blind = self._reaction_mode
        context_prefix = "retry_" if blind else "check_retry_"
        context = Context(
            id=self._make_context_id(
                f"{self._active_context_suffix}_{context_prefix}{attempt}"
            )
        )
        service_data: dict[str, Any]
        domain = entity_id.split(".", 1)[0]

        if blind:
            if domain != "light":
                # Non-light entities (e.g. switch.*) have no brightness/color to
                # blind-reapply — always drive them via their own on/off service.
                service = "turn_on" if expected.get("state") == STATE_ON else "turn_off"
                call_domain = (
                    domain if domain in ("light", "switch") else "homeassistant"
                )
                self._create_task(
                    self.hass.services.async_call(
                        call_domain,
                        service,
                        {"entity_id": entity_id},
                        context=context,
                    )
                )
                return
            service_data = build_light_service_data(
                self.hass,
                entity_id,
                expected,
                self._color_modes_cache,
                transition=transition,
            )
            self._create_task(
                self.hass.services.async_call(
                    "light", "turn_on", service_data, context=context
                )
            )
            return

        service = "turn_off" if expected.get("state") == STATE_OFF else "turn_on"
        if domain == "light" and service == "turn_on":
            service_data = build_light_service_data(
                self.hass,
                entity_id,
                expected,
                self._color_modes_cache,
                transition=transition,
            )
        else:
            # Non-light entities (e.g. switch.*) and turn_off calls get a minimal
            # payload — light-only attributes like brightness/color_temp would be
            # meaningless (turn_off) or unsupported (switch.turn_on) here.
            service_data = {"entity_id": entity_id}
            if domain == "light" and service == "turn_off" and transition:
                service_data["transition"] = transition
        call_domain = domain if domain in ("light", "switch") else "homeassistant"
        self._create_task(
            self.hass.services.async_call(
                call_domain, service, service_data, context=context
            )
        )

    def _reaction_deadline_reached(self) -> bool:
        """Hook: True once a running reaction-mode window (a fade) is over.

        Only `fade()` puts the handler into reaction mode in the first place
        (via the `reaction_mode=True` argument to `_run()`); this hook is what
        lets the retry loop notice, attempt by attempt, that the fade's target
        time has since passed and switch to a hard check. Handlers that never
        run in reaction mode never have this called.
        """
        return False

    def _current_reapply_transition(self) -> int | None:
        """Hook: the transition this retry attempt should send right now.

        Called on every attempt, check or blind. `fade()` passes the lead
        time computed once at call time as the run's transition; a retry
        firing partway through the fade must instead resend with the
        *remaining* time — 0 once the target time has passed, so a hard
        check-retry after the deadline is an exact correction, not another
        full-length fade. Handlers with no such deadline keep the run's
        transition on every attempt; TurnOffCallHandler retries hard instead.
        """
        return self._run_transition

    def _retry_delays(self) -> list[float]:
        """Hook: when the retry attempts of the current run fire."""
        return list(DEFAULT_RETRY_DELAYS)

    async def _run(
        self,
        calls: list[CallSpec],
        *,
        context_suffix: str,
        transition: int | None = None,
        retry_entities: Sequence[str] | None = None,
        deviation_targets: dict[str, dict[str, Any]] | None = None,
        reaction_mode: bool = False,
        grace_elapsed: float = 0.0,
    ) -> None:
        """Shared execution routine: reset, send calls, arm retries/deviation watch.

        Called by each public method (`start`/`fade`/`complete_fade`/`reapply` on
        SceneCallHandler, `execute` on TurnOffCallHandler) with values it has
        already worked out for itself — this routine never inspects which of
        them called it, it only uses what was handed in. `calls` is the fully
        built list of service calls; `retry_entities` is what the retry loop
        checks against `_target_states` (populated by `deviation_targets`),
        defaulting to all of `deviation_targets`. `transition` is this run's
        transition: it decides the forced resends, the retry timing
        (`_retry_delays()`) and what each retry sends
        (`_current_reapply_transition()`).
        """
        self.cancel()
        self._reached_target_entities.clear()
        self._reaction_mode = reaction_mode
        self._reacted_entities = set()
        # Without a transition the lamp's report proves nothing for the first
        # attempts — they resend to every retry entity without checking.
        self._forced_resends = 0 if transition else HARD_CALL_RESENDS
        self._run_transition = transition
        self._active_context_suffix = context_suffix
        if retry_entities is None:
            retry_entities = list(deviation_targets or ())

        if deviation_targets:
            self._start_deviation_watcher(deviation_targets)

        if not calls:
            _LOGGER.debug(
                "[%s] CallHandler (%s): No service calls generated for channel %s",
                self.engine.area_id,
                self.__class__.__name__,
                self.channel_id,
            )
            self._stop_deviation_watcher()
            return

        context = Context(id=self._make_context_id(context_suffix))
        # Per-entity, not a single batch-wide bool: `calls` can carry one CallSpec
        # per entity (see _build_scene_calls()), and a ServiceValidationError on
        # one call must not also cancel the retry window for the entities of the
        # other calls in the same batch.
        permanent_failure_entities: set[str] = set()

        lead_tasks = [
            task
            for call in calls
            if call.lead
            and (
                task := self._create_task(
                    self._dispatch(
                        call, context, permanent_failure_entities, blocking=True
                    )
                )
            )
        ]
        if lead_tasks:
            # Bounded, not a plain blocking call: the Hue integration retries an
            # overloaded Bridge without a timeout, and one stuck lamp must not
            # hold back the remaining calls indefinitely.
            _, pending = await asyncio.wait(lead_tasks, timeout=LEAD_CALL_MAX_WAIT_SECONDS)
            if pending:
                _LOGGER.debug(
                    "[%s] CallHandler (%s): %d lead call(s) still pending after %.1fs, "
                    "sending the remaining calls anyway",
                    self.engine.area_id,
                    self.__class__.__name__,
                    len(pending),
                    LEAD_CALL_MAX_WAIT_SECONDS,
                )

        for call in calls:
            if not call.lead:
                await self._dispatch(call, context, permanent_failure_entities)

        self._last_call_at = datetime.now(UTC)

        surviving_retry_entities = [
            e for e in retry_entities if e not in permanent_failure_entities
        ]
        if surviving_retry_entities:
            self._retry_active = True
            self._schedule_retries(
                surviving_retry_entities,
                # A resend pulled forward by the grace would reach a lamp
                # switched on from off before it is on, and miss again.
                grace_elapsed=0.0 if self._forced_resends else grace_elapsed,
            )

    async def _dispatch(
        self,
        call: CallSpec,
        context: Context,
        permanent_failure_entities: set[str],
        *,
        blocking: bool = False,
    ) -> None:
        """Send one service call, recording entities whose call can never succeed."""
        try:
            _LOGGER.debug(
                "[%s] CallHandler: Calling %s.%s (%s)",
                self.engine.area_id,
                call.domain,
                call.service,
                call.service_data,
            )
            await self.hass.services.async_call(
                call.domain,
                call.service,
                call.service_data,
                blocking=blocking,
                context=context,
            )
        except ServiceValidationError as err:
            # Invalid call (e.g. ServiceNotFound/ServiceNotSupported — a missing
            # entity only gets logged by HA, it raises nothing) — retrying sends
            # the exact same call again and can never succeed, so retries are
            # skipped instead of running unnoticed through every attempt, for
            # every entity this call targeted; other calls are unaffected.
            call_entities = call.service_data.get("entity_id")
            if isinstance(call_entities, str):
                permanent_failure_entities.add(call_entities)
            elif isinstance(call_entities, list):
                permanent_failure_entities.update(call_entities)
            _LOGGER.error(
                "[%s] CallHandler: Permanently failed to call %s.%s, "
                "skipping retries: %s",
                self.engine.area_id,
                call.domain,
                call.service,
                err,
            )
        except Exception as err:
            _LOGGER.error(
                "[%s] CallHandler: Failed to call %s.%s: %s",
                self.engine.area_id,
                call.domain,
                call.service,
                err,
            )

    def _schedule_retries(
        self, entities: list[str], *, grace_elapsed: float = 0.0
    ) -> None:
        """Schedule retry attempts using the unified loop."""
        delays = self._retry_delays()
        total_attempts = len(delays)
        if delays and grace_elapsed > 0:
            first_delay = max(0.1, delays[0] - grace_elapsed)
            delays = [first_delay, *delays[1:]]
        for attempt, delay in enumerate(delays, start=1):
            self._start_timer(
                delay,
                functools.partial(
                    self._perform_retry_attempt, entities, attempt, total_attempts
                ),
            )

    def _perform_retry_attempt(
        self, entities: list[str], attempt: int, total_attempts: int
    ) -> None:
        """Perform unified retry attempt checking state deviations or reactions."""
        if self._reaction_mode and self._reaction_deadline_reached():
            # Once the target slot start is reached, the fade is over: leave
            # reaction mode so this attempt enforces the exact target state.
            self._reaction_mode = False

        if not self._retry_active:
            return

        if self._reaction_mode:
            # Entities with no _target_states entry (e.g. a Hue scene whose
            # `actions` cover only a subset of the group's lights) are never
            # watched by _start_deviation_watcher() and can never "react" —
            # without this filter they stay in `remaining` forever, keeping
            # _retry_active True and the handler permanently is_busy.
            remaining = [
                e
                for e in entities
                if e not in self._reacted_entities and e in self._target_states
            ]
        elif attempt <= self._forced_resends:
            # The reported state proves nothing yet: the Bridge reports the
            # commanded value before the lamp has confirmed it.
            remaining = [e for e in entities if e in self._target_states]
        else:
            remaining = []
            for entity_id in entities:
                if entity_id in self._reached_target_entities:
                    continue

                expected = self._target_states.get(entity_id)
                if not expected:
                    continue

                ha_state = self.hass.states.get(entity_id)
                deviation = deviating_attrs(ha_state, expected)

                if not deviation:
                    self._reached_target_entities.add(entity_id)
                else:
                    remaining.append(entity_id)
                _LOGGER.debug(
                    "[%s] CallHandler (%s) retry %d/%d check %s: %s",
                    self.engine.area_id,
                    self.__class__.__name__,
                    attempt,
                    total_attempts,
                    entity_id,
                    f"deviates {deviation}" if deviation else "matches target",
                )

        if not remaining:
            _LOGGER.debug(
                "[%s] CallHandler (%s): All entities reached target state, stopping retries.",
                self.engine.area_id,
                self.__class__.__name__,
            )
            self._retry_active = False
            return

        _LOGGER.debug(
            "[%s] CallHandler (%s) retry %d: remaining=%s, reaction_mode=%s, forced=%s",
            self.engine.area_id,
            self.__class__.__name__,
            attempt,
            remaining,
            self._reaction_mode,
            attempt <= self._forced_resends,
        )

        transition = self._current_reapply_transition()

        for entity_id in remaining:
            expected = self._target_states.get(entity_id)
            if not expected:
                continue
            self._send_retry_call(entity_id, expected, attempt, transition)

        if attempt >= total_attempts:
            _LOGGER.debug(
                "[%s] CallHandler (%s): Retry attempts exhausted (%d/%d), stopping retries.",
                self.engine.area_id,
                self.__class__.__name__,
                attempt,
                total_attempts,
            )
            self._retry_active = False

    # ── Deviation Watcher ──

    def _start_deviation_watcher(
        self, target_states: dict[str, dict[str, Any]]
    ) -> None:
        """Subscribe to state change events of target entities."""
        self._stop_deviation_watcher()
        self._target_states = target_states
        entities = list(target_states.keys())
        if not entities:
            return

        # Perform initial passive check for entities already in target state
        for ent in entities:
            st = self.hass.states.get(ent)
            if st and not check_entity_deviation(st, target_states[ent]):
                self._reached_target_entities.add(ent)
                if self._reaction_mode:
                    self._reacted_entities.add(ent)

        @callback
        def _on_state_change(event: Any) -> None:
            entity_id = event.data.get("entity_id")
            if not isinstance(entity_id, str):
                return
            new_state = event.data.get("new_state")
            context = event.context

            expected = self._target_states.get(entity_id)
            if not expected or not new_state:
                return

            deviates = check_entity_deviation(new_state, expected)

            if self._reaction_mode and not deviates:
                self._reacted_entities.add(entity_id)
            elif not self._reaction_mode and not deviates:
                self._reached_target_entities.add(entity_id)
            elif (
                identify_echo(
                    context,
                    self.engine.area_id,
                    self.engine.channel_id_set,
                )
                is None
            ):
                # External deviation (not our own echo) — e.g. the user turns
                # the lamp off by hand. This applies during a fade
                # (_reaction_mode) just as much as afterwards: counting it as
                # a "reaction" there would let the post-fade check-mode pass
                # treat the entity as done and re-drive it back to the
                # expected state, overriding the manual change instead of
                # honouring it. We only LOG, never re-drive the entity —
                # re-application happens on the next real trigger.
                # context_id lets the change be traced to its origin (HA logbook).
                if self._retry_active:
                    _LOGGER.info(
                        "[%s] External deviation detected on %s: %s (stopping retries, context_id=%s)",
                        self.engine.area_id,
                        entity_id,
                        deviating_attrs(new_state, expected),
                        context.id,
                    )
                    self._retry_active = False
                    self._cancel_timers()
                else:
                    _LOGGER.debug(
                        "[%s] External deviation detected on %s: %s (retries already stopped, context_id=%s)",
                        self.engine.area_id,
                        entity_id,
                        deviating_attrs(new_state, expected),
                        context.id,
                    )
            else:
                # A deviating report carrying our own context — HA stamps every
                # state write within 5 s of our call with it, e.g. a lamp polled
                # mid-transition. It supersedes an earlier match, so the next
                # retry check must look at the lamp again instead of skipping it.
                self._reached_target_entities.discard(entity_id)

        self._unsub_deviation = async_track_state_change_event(
            self.hass, entities, _on_state_change
        )

    def _stop_deviation_watcher(self) -> None:
        """Unsubscribe from state change events."""
        if self._unsub_deviation:
            self._unsub_deviation()
            self._unsub_deviation = None
        self._target_states.clear()


class SceneCallHandler(BaseCallHandler):
    """Steers a channel's slot scene through four execution contexts.

    One instance per channel, built once by the Coordinator and reused for the
    engine's lifetime (see coordinator.py). The public method the caller picks
    *is* the context — there is no stored context field to branch on later:

    - `start(slot_id, ...)` — enter right now (input/activity). No transition
      (a fade would wake a manually-off lamp). Whole-scene entity filter.
    - `fade(slot_id, target_slot_start)` — anticipatory slot transition.
      Transition/retry-delays/reaction-end all derive from the one remaining-
      time computation against `target_slot_start`. Filters to entities
      currently on.
    - `complete_fade(slot_id)` — Stage 2 of a fade into a dynamic slot: the
      lamps that can't rotate, hard, without a second recall.
    - `reapply(slot_id)` — correction while the activity stays active
      (re-trigger sees a deviating light). No transition. Filters to
      currently-deviating entities.

    What's shared across all four (scene-type detection, the dynamic-Hue
    guard, building per-entity calls) lives in private helpers below — none of
    them branch on which public method is running.
    """

    def __init__(self, engine: TwilightEngine, channel_id: str) -> None:
        super().__init__(engine, channel_id)
        # Set at the start of fade() and read back by _reaction_deadline_reached(),
        # which the retry loop calls on every attempt while reaction_mode is on —
        # not a stored "which method am I" context, just the one time value a
        # running fade's retry callbacks need to keep re-checking.
        self._fade_target_slot_start: datetime | None = None

    def cancel(self) -> None:
        super().cancel()
        self._fade_target_slot_start = None

    def _reaction_deadline_reached(self) -> bool:
        if self._fade_target_slot_start is None:
            return True
        return datetime.now(UTC) >= self._fade_target_slot_start.astimezone(UTC)

    def _current_reapply_transition(self) -> int | None:
        """Remaining time to target_slot_start, not the lead time fade() started with."""
        if self._fade_target_slot_start is None:
            return super()._current_reapply_transition()
        remaining = (
            self._fade_target_slot_start.astimezone(UTC) - datetime.now(UTC)
        ).total_seconds()
        return max(0, round(remaining))

    def _retry_delays(self) -> list[float]:
        """Fade timing for a run with transition; without, the default timing."""
        transition = self._run_transition
        if not transition:
            return super()._retry_delays()
        return [
            min(5.0, float(transition) / 3.0),
            float(transition) / 2.0,
            float(transition) + 2.0,
        ]

    def _scene_info(self, slot_id: str) -> SlotSceneInfo | None:
        return get_slot_info(self.engine.scene_map, self.channel_id, slot_id)

    def is_dynamic_slot(self, slot_id: str, scene_info: SlotSceneInfo | None) -> bool:
        """True if the slot runs Bridge-side dynamic playback (see helpers.is_dynamic_slot).

        Also used by SlotCoordinator so that Stage 2 of a dynamic fade does not
        recall the scene again, which would restart the running rotation.
        """
        return is_dynamic_slot(
            self.engine.config.slot(self.channel_id, slot_id), scene_info
        )

    def _enforced_states(
        self, slot_id: str, scene_info: SlotSceneInfo
    ) -> dict[str, dict[str, Any]]:
        """Expected states retries/reapply may check and re-drive for this slot.

        Dynamic slots retry too: this leaves the rotating lamps out and keeps
        the others in full.
        """
        return enforced_scene_states(
            scene_info, self.is_dynamic_slot(slot_id, scene_info)
        )

    def _dynamic_scene_call(
        self,
        slot_id: str,
        scene_info: SlotSceneInfo | None,
        transition: int | None = None,
    ) -> CallSpec | None:
        """Build the hue.activate_scene call for a slot opted into dynamic playback.

        Returns None if the slot is not configured for dynamic playback or its
        scene is not a scene entity. `transition` lets the Bridge fade into the
        scene itself instead of Twilight stepping the lights individually.
        """
        if not self.is_dynamic_slot(slot_id, scene_info):
            return None
        slot = self.engine.config.slot(self.channel_id, slot_id)
        if not slot:
            return None

        scene_id = slot.scene_entity_id
        if scene_info and scene_info.scene_entity_id:
            scene_id = scene_info.scene_entity_id
        if not scene_id or not scene_id.startswith("scene."):
            return None

        sdata: dict[str, Any] = {"entity_id": scene_id, "dynamic": True}
        if slot.hue_dynamic_speed is not None:
            sdata["speed"] = slot.hue_dynamic_speed
        # 0 for a hard recall, for the same reason as build_light_service_data().
        sdata["transition"] = transition or 0
        return CallSpec("hue", "activate_scene", sdata)

    @staticmethod
    def _select_states(
        states: dict[str, dict[str, Any]], entities: Iterable[str]
    ) -> dict[str, dict[str, Any]]:
        """The given entities' entries in `states` that are defined and non-empty."""
        return {
            entity_id: expected
            for entity_id in entities
            if (expected := states.get(entity_id))
        }

    def _build_scene_calls(
        self,
        targets: dict[str, dict[str, Any]],
        transition: int | None,
        *,
        lead: bool = False,
    ) -> list[CallSpec]:
        """Per-entity light.turn_on/switch.turn_on|off to each entity's target state."""
        _, switches, _ = partition_by_domain(list(targets))
        switch_ids = set(switches)
        calls: list[CallSpec] = []
        for entity_id, expected in targets.items():
            if not expected:
                continue
            is_off = expected.get("state") == STATE_OFF
            if entity_id in switch_ids:
                service = "turn_off" if is_off else "turn_on"
                calls.append(
                    CallSpec("switch", service, {"entity_id": entity_id}, lead=lead)
                )
                continue
            if is_off:
                sdata: dict[str, Any] = {"entity_id": entity_id}
                if transition is not None and transition > 0:
                    sdata["transition"] = transition
                calls.append(CallSpec("light", "turn_off", sdata, lead=lead))
                continue
            sdata = build_light_service_data(
                self.hass,
                entity_id,
                expected,
                self._color_modes_cache,
                transition=transition,
            )
            calls.append(CallSpec("light", "turn_on", sdata, lead=lead))
        return calls

    def _build_dynamic_enter_calls(
        self,
        dynamic_call: CallSpec,
        scene_info: SlotSceneInfo,
        entities: Iterable[str],
        transition: int | None,
    ) -> list[CallSpec]:
        """The Bridge recall, preceded by static values for lamps that can't rotate.

        Lamps without dynamics (GLEDOPTO, IKEA) take only a static value from the
        recall, and often miss its group message. They get their full static
        state per light first, as lead calls the recall waits for.
        """
        static = self._select_states(
            scene_info.expected_states,
            (e for e in entities if e not in scene_info.dynamic_entities),
        )
        return [*self._build_scene_calls(static, transition, lead=True), dynamic_call]

    def _resolve_scene_id(
        self, slot_id: str, scene_info: SlotSceneInfo | None
    ) -> str | None:
        """The scene/script/light entity id a (possibly synthetic) slot_id resolves to.

        `slot_id` is either a real slot id (looked up in config), or — for the
        Entity-Action/presence-simulation "direct" callers — the scene/script
        entity id itself (contains a dot, no scene_info exists for it).
        """
        if scene_info and scene_info.scene_entity_id:
            return scene_info.scene_entity_id
        if "." in slot_id:
            return slot_id
        slot = self.engine.config.slot(self.channel_id, slot_id)
        return slot.scene_entity_id if slot else None

    def _build_enter_calls(
        self,
        slot_id: str,
        scene_info: SlotSceneInfo | None,
        transition: int | None,
    ) -> list[CallSpec]:
        """Calls to fully (re-)enter a slot's scene — shared by start() and fade()."""
        scene_id = self._resolve_scene_id(slot_id, scene_info)
        if not scene_id or "." not in scene_id:
            return []

        domain, object_id = scene_id.split(".", 1)
        if domain == "script":
            return [CallSpec("script", object_id, {})]
        if domain == "scene":
            # HA's `is_dynamic` on a Hue scene only means "palette with more than
            # one color" and plain scene.turn_on never starts dynamics anyway, so
            # every extractable scene runs per light unless the slot opted in.
            if scene_info and scene_info.extracted_entities and scene_info.expected_states:
                if dynamic_call := self._dynamic_scene_call(slot_id, scene_info, transition):
                    return self._build_dynamic_enter_calls(
                        dynamic_call, scene_info, scene_info.extracted_entities, transition
                    )
                return self._build_scene_calls(
                    self._select_states(
                        scene_info.expected_states, scene_info.extracted_entities
                    ),
                    transition,
                )
            if dynamic_call := self._dynamic_scene_call(slot_id, scene_info, transition):
                return [dynamic_call]
            return [CallSpec("scene", "turn_on", {"entity_id": scene_id})]
        if domain == "light":
            return [CallSpec("light", "turn_on", {"entity_id": scene_id})]
        return [CallSpec("homeassistant", "turn_on", {"entity_id": scene_id})]

    async def start(self, slot_id: str, entities: list[str] | None = None) -> None:
        """Enter a slot's scene right now (input/activity). No transition.

        `entities`, if given, restricts which extracted entities are steered
        (used by the retry/deviation loop); otherwise falls back to the
        scene's own extracted_entities so the retry loop has something to
        check. `slot_id` may be a real slot id or a scene/script entity id
        (Entity-Action, presence-simulation "direct" path).
        """
        scene_info = self._scene_info(slot_id)
        target_entities = (
            entities
            if entities
            else (list(scene_info.extracted_entities) if scene_info else [])
        )

        calls = self._build_enter_calls(slot_id, scene_info, transition=None)

        context_suffix = (
            "direct" if not slot_id or "." in slot_id else slot_id
        )
        deviation_targets = (
            dict(self._enforced_states(slot_id, scene_info))
            if scene_info and scene_info.expected_states
            else None
        )

        await self._run(
            calls,
            context_suffix=context_suffix,
            retry_entities=[e for e in target_entities if e in (deviation_targets or {})],
            deviation_targets=deviation_targets,
        )

    async def fade(
        self, slot_id: str, target_slot_start: datetime, grace_elapsed: float = 0.0
    ) -> None:
        """Anticipatory slot transition: fade extracted entities to the target scene.

        Remaining time to `target_slot_start` is computed once here and drives
        transition seconds, retry delays, and the reaction-mode deadline — no
        separate re-derivation elsewhere. Only lamps that are on are faded, so a
        lamp switched off by hand stays off — except in a dynamic slot, whose
        Bridge recall switches the whole scene on regardless.
        """
        scene_info = self._scene_info(slot_id)

        now = datetime.now(UTC)
        transition = max(0, round((target_slot_start.astimezone(UTC) - now).total_seconds()))

        target_entities = []
        if scene_info:
            for entity_id in scene_info.extracted_entities:
                st = self.hass.states.get(entity_id)
                if st and st.state not in (STATE_OFF, STATE_UNAVAILABLE, STATE_UNKNOWN):
                    target_entities.append(entity_id)

        calls: list[CallSpec] = []
        deviation_targets: dict[str, dict[str, Any]] = {}
        if scene_info:
            if dynamic_call := self._dynamic_scene_call(slot_id, scene_info, transition):
                # The Bridge recall switches the whole scene on, including lamps
                # that are off right now — the "a fade never wakes an off lamp"
                # rule cannot hold for a dynamic slot. So the non-rotating lamps
                # follow the scene too: otherwise one that was off and misses the
                # group message would stay dark until Stage 2.
                target_entities = list(scene_info.extracted_entities)
                calls = self._build_dynamic_enter_calls(
                    dynamic_call, scene_info, target_entities, transition
                )
            else:
                calls = self._build_scene_calls(
                    self._select_states(scene_info.expected_states, target_entities),
                    transition,
                )
            deviation_targets = self._select_states(
                self._enforced_states(slot_id, scene_info), target_entities
            )

        # With a lead of 0 this is a hard call like start(): same timing, same
        # resends — both follow from the transition in _run().
        await self._run(
            calls,
            context_suffix=slot_id,
            transition=transition,
            deviation_targets=deviation_targets or None,
            reaction_mode=transition > 0 and bool(deviation_targets),
            grace_elapsed=grace_elapsed,
        )
        # Set only after _run() returns: _run() starts with self.cancel(), which
        # clears this field — setting it before _run() would have the deadline
        # wiped before the retry loop it drives ever gets scheduled.
        self._fade_target_slot_start = target_slot_start

    async def complete_fade(self, slot_id: str) -> None:
        """Stage 2 of a fade into a dynamic slot: resend the non-rotating lamps hard.

        No recall — the fade's recall already runs the rotation, and a second
        one would restart it. The lamps that can't rotate get their full target
        without transition: one that runs a single transition at a time keeps
        its old brightness when brightness and colour fade together, and one
        that missed the recall's group message is still off. Same lamps as the
        dynamic fade (its recall switched the whole scene on), minus those
        marked manual-off while Respect Manual Off holds.
        """
        scene_info = self._scene_info(slot_id)
        targets: dict[str, dict[str, Any]] = {}
        if scene_info:
            coordinator = self.engine.coordinator
            skip = (
                coordinator.run_state.manual_off_entities
                if coordinator.is_respect_manual_off_active()
                else frozenset()
            )
            targets = self._select_states(
                self._enforced_states(slot_id, scene_info),
                (e for e in scene_info.extracted_entities if e not in skip),
            )
        await self._run(
            self._build_scene_calls(targets, None),
            context_suffix=f"{slot_id}_complete",
            deviation_targets=targets or None,
        )

    async def reapply(self, slot_id: str, grace_elapsed: float = 0.0) -> None:
        """Correct only the currently-deviating entities of an active slot's scene.

        No transition. If the slot's scene is not per-entity extractable (a
        Hue Smart-Scene, an Entity-Action scene, or the primary channel's
        fallback), there is nothing to compare per-entity — re-trigger the
        whole scene via `start()`'s call-building instead, skipping scripts
        (not idempotent — a script re-run could have side effects beyond
        restoring light state).

        Manual-off marking: if the active SlotAction has `respect_manual_off`
        set (opt-in, off by
        default), entities in `run_state.manual_off_entities` (turned off
        externally, marked by `LightStateInputHandler`) are skipped — the
        automation does not pull them back on slot changes. Re-triggers clear
        the set beforehand (`activity_requested()`), so the filter never
        applies there. Only meaningful for real slots —
        Entity-Action scenes have no per-entity target to apply it to.
        """
        scene_info = self._scene_info(slot_id)

        # Per-entity deviation reapply (the common case): scene exists and is
        # extractable.
        if scene_info and scene_info.extracted_entities and scene_info.expected_states:
            # In a dynamic slot this leaves the rotating lamps to the Bridge
            # and corrects the others in full.
            enforced = self._enforced_states(slot_id, scene_info)
            coordinator = self.engine.coordinator
            respect_manual_off = coordinator.is_respect_manual_off_active()
            manual_off = coordinator.run_state.manual_off_entities

            deviation_targets: dict[str, dict[str, Any]] = {}
            for entity_id in scene_info.extracted_entities:
                if respect_manual_off and entity_id in manual_off:
                    continue
                expected = enforced.get(entity_id)
                if not expected:
                    continue
                st = self.hass.states.get(entity_id)
                if check_entity_deviation(st, expected):
                    deviation_targets[entity_id] = expected

            await self._run(
                self._build_scene_calls(deviation_targets, None),
                context_suffix=f"{slot_id}_change",
                deviation_targets=deviation_targets or None,
                grace_elapsed=grace_elapsed,
            )
            return

        # No per-entity comparison possible (Smart-Scene, Entity-Action scene,
        # primary-channel fallback): re-trigger the whole scene. Scripts are
        # skipped — a re-run could have side effects beyond light state.
        scene_id = self._resolve_scene_id(slot_id, scene_info)
        if scene_id and scene_id.startswith("script."):
            _LOGGER.debug(
                "[%s] SceneCallHandler (%s): reapply for script slot %s skipped — "
                "re-running a script is not idempotent",
                self.engine.area_id,
                self.channel_id,
                slot_id,
            )
            return
        calls = self._build_enter_calls(slot_id, scene_info, transition=None)
        await self._run(
            calls,
            context_suffix=f"{slot_id}_change" if "." not in slot_id else "direct_change",
            grace_elapsed=grace_elapsed,
        )


class TurnOffCallHandler(BaseCallHandler):
    """Call handler for turning off entities."""

    def __init__(
        self,
        engine: TwilightEngine,
        channel_id: str,
        transition_off: int | None = None,
    ) -> None:
        super().__init__(engine, channel_id)
        self.transition_off = transition_off

    def _retry_delays(self) -> list[float]:
        """Delay the retry loop past the fade instead of firing during it.

        A light stays `on` for the whole `transition` duration, so the default
        delays (1.2–6.0s) all land mid-fade, see a deviation from the {"state":
        "off"} target, and the hard retry would cut the fade short. Shifting the
        whole schedule past the fade means the first check happens once the
        light has actually had time to reach off. Zero/absent transition keeps
        the default timing.
        """
        delays = list(DEFAULT_RETRY_DELAYS)
        fade = self.transition_off or 0
        if fade <= 0:
            return delays
        return [fade + delay for delay in delays]

    def _current_reapply_transition(self) -> int | None:
        """Retries fire after the fade (see _retry_delays()), so they correct hard."""
        return None

    def _build_calls(self, entities: list[str]) -> list[CallSpec]:
        if not entities:
            return []

        lights, switches, others = partition_by_domain(entities)

        calls = []
        # A lamp already off gets no transition: an IKEA behind the Hue Bridge
        # that receives a soft turn-off while off is reported on at its last
        # brightness seconds later, though it stays dark.
        already_off = (
            [e for e in lights if (s := self.hass.states.get(e)) and s.state == STATE_OFF]
            if self.transition_off
            else []
        )
        fading = [e for e in lights if e not in already_off]
        if fading:
            sdata: dict[str, Any] = {"entity_id": fading}
            if self.transition_off is not None:
                sdata["transition"] = self.transition_off
            calls.append(CallSpec("light", "turn_off", sdata))
        if already_off:
            calls.append(CallSpec("light", "turn_off", {"entity_id": already_off}))
        if switches:
            calls.append(CallSpec("switch", "turn_off", {"entity_id": switches}))
        if others:
            calls.append(CallSpec("homeassistant", "turn_off", {"entity_id": others}))

        return calls

    async def execute(self, entities: list[str]) -> None:
        """Turn off the given entities, with retries gated on reaching 'off'.

        Takes no handoff grace: a hard turn-off's forced resends ignore it, and a
        soft one's first check must stay behind its own fade, since it corrects hard.
        """
        active_slot = self.engine.run_state.active_slots.get(self.channel_id)
        context_suffix = f"{active_slot}_off" if active_slot else "turn_off"

        await self._run(
            self._build_calls(entities),
            context_suffix=context_suffix,
            # A soft turn-off gets no forced resends: one would cut its fade short.
            transition=self.transition_off,
            deviation_targets={ent: {"state": STATE_OFF} for ent in entities}
            if entities
            else None,
        )
