"""Call handlers for Twilight control logic, implementing execution, transitions, retries, and deviation tracking."""

from __future__ import annotations

import asyncio
import functools
import logging
from collections.abc import Callable, Coroutine
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any

from homeassistant.components.light import get_supported_color_modes
from homeassistant.const import STATE_OFF, STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Context, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
from homeassistant.util.color import color_temperature_mired_to_kelvin

from .config_model import LightActionConfig
from .const import CONTEXT_PREFIX, DEFAULT_RETRY_DELAYS, ECHO_SETTLE_WINDOW_SECONDS
from .deviation import check_entity_deviation, deviating_attrs
from .echo import identify_echo
from .helpers import (
    create_tracked_task,
    get_slot_info,
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


def build_light_service_data(
    hass: HomeAssistant,
    entity_id: str,
    expected: dict[str, Any],
    color_modes_cache: dict[str, set[str]],
    transition: int | None = None,
) -> dict[str, Any]:
    """Build service_data for light.turn_on based on expected state and supported color modes."""
    service_data: dict[str, Any] = {"entity_id": entity_id}

    if transition is not None and transition > 0:
        service_data["transition"] = transition

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
    public entry point (`start`/`fade`/`reapply` on SceneCallHandler/LightCallHandler,
    `execute` on TurnOffCallHandler) must therefore begin with the same reset —
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
        self._stop_deviation_watcher()

    def _send_retry_call(
        self,
        entity_id: str,
        expected: dict[str, Any],
        attempt: int,
        transition: int | None,
        style: str,
    ) -> None:
        """Send a single retry call for one entity (shared send code).

        `style` is "check" (context id prefix `check_retry_`, allows turn_off for
        non-light entities/state) or "blind" (context id prefix `retry_`, always a
        light.turn_on — used by the blind-retry and reaction-retry paths).
        """
        context_prefix = "check_retry_" if style == "check" else "retry_"
        context = Context(
            id=self._make_context_id(
                f"{self._active_context_suffix}_{context_prefix}{attempt}"
            )
        )
        service_data: dict[str, Any]
        domain = entity_id.split(".", 1)[0]

        if style == "blind":
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

    def _current_reapply_transition(self, reapply_transition: int | None) -> int | None:
        """Hook: the transition this retry attempt should send right now.

        Called on every attempt, check or blind. `fade()` passes the lead
        time computed once at call time as `reapply_transition`; a retry
        firing partway through the fade must instead resend with the
        *remaining* time — 0 once the target time has passed, so a hard
        check-retry after the deadline is an exact correction, not another
        full-length fade. Handlers with no such deadline (e.g. TurnOffCallHandler)
        don't override this — their transition is static regardless of attempt.
        """
        return reapply_transition

    async def _run(
        self,
        calls: list[CallSpec],
        *,
        context_suffix: str,
        retry_entities: list[str],
        should_retry: bool,
        retry_delays: list[float],
        reapply_transition: int | None,
        reaction_mode: bool = False,
        deviation_targets: dict[str, dict[str, Any]] | None = None,
        grace_elapsed: float = 0.0,
    ) -> None:
        """Shared execution routine: reset, send calls, arm retries/deviation watch.

        Called by each public method (`start`/`fade`/`reapply` on SceneCallHandler/
        LightCallHandler, `execute` on TurnOffCallHandler) with values it has
        already worked out for itself — this routine never inspects which of
        them called it, it only uses what was handed in. `calls` is the fully
        built list of service calls; `retry_entities` is what the retry loop
        checks against `_target_states` (populated by `deviation_targets`).
        """
        self.cancel()
        self._reached_target_entities.clear()
        self._reaction_mode = reaction_mode
        self._reacted_entities = set()
        self._active_context_suffix = context_suffix

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
        # one entity's call (e.g. removed while still referenced by a scene) must
        # not also cancel the retry window for other entities in the same batch
        # that succeeded or failed for an unrelated, possibly transient reason.
        permanent_failure_entities: set[str] = set()

        for call in calls:
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
                    context=context,
                )
            except ServiceValidationError as err:
                # Invalid service/entity (e.g. removed while still referenced by a
                # scene) — retrying sends the exact same call again and can never
                # succeed, so retries are skipped instead of running unnoticed
                # through every attempt, but only for the entities this specific
                # call targeted — other calls in the same batch are unaffected.
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

        self._last_call_at = datetime.now(UTC)

        if should_retry:
            surviving_retry_entities = [
                e for e in retry_entities if e not in permanent_failure_entities
            ]
            if surviving_retry_entities:
                self._retry_active = True
                self._schedule_retries(
                    surviving_retry_entities,
                    retry_delays=retry_delays,
                    reapply_transition=reapply_transition,
                    grace_elapsed=grace_elapsed,
                )

    def _schedule_retries(
        self,
        entities: list[str],
        *,
        retry_delays: list[float],
        reapply_transition: int | None,
        grace_elapsed: float = 0.0,
    ) -> None:
        """Schedule retry attempts using the unified loop."""
        delays = list(retry_delays)
        total_attempts = len(delays)
        if delays and grace_elapsed > 0:
            first_delay = max(0.1, delays[0] - grace_elapsed)
            delays = [first_delay, *delays[1:]]
        for attempt, delay in enumerate(delays, start=1):
            self._start_timer(
                delay,
                functools.partial(
                    self._perform_retry_attempt,
                    entities,
                    attempt,
                    reapply_transition,
                    total_attempts,
                ),
            )

    def _perform_retry_attempt(
        self,
        entities: list[str],
        attempt: int,
        reapply_transition: int | None,
        total_attempts: int,
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
        else:
            remaining = []
            for entity_id in entities:
                if entity_id in self._reached_target_entities:
                    continue

                expected = self._target_states.get(entity_id)
                if not expected:
                    continue

                ha_state = self.hass.states.get(entity_id)
                deviates = check_entity_deviation(ha_state, expected)

                if not deviates:
                    self._reached_target_entities.add(entity_id)
                else:
                    remaining.append(entity_id)

        if not remaining:
            _LOGGER.debug(
                "[%s] CallHandler (%s): All entities reached target state, stopping retries.",
                self.engine.area_id,
                self.__class__.__name__,
            )
            self._retry_active = False
            return

        _LOGGER.debug(
            "[%s] CallHandler (%s) retry %d: remaining=%s, reaction_mode=%s",
            self.engine.area_id,
            self.__class__.__name__,
            attempt,
            remaining,
            self._reaction_mode,
        )

        retry_style = "blind" if self._reaction_mode else "check"
        transition = self._current_reapply_transition(reapply_transition)

        for entity_id in remaining:
            expected = self._target_states.get(entity_id)
            if not expected:
                continue
            self._send_retry_call(
                entity_id, expected, attempt, transition, retry_style
            )

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
                if self._retry_active:
                    _LOGGER.info(
                        "[%s] External deviation detected on %s: %s (stopping retries)",
                        self.engine.area_id,
                        entity_id,
                        deviating_attrs(new_state, expected),
                    )
                    self._retry_active = False
                    self._cancel_timers()
                else:
                    _LOGGER.debug(
                        "[%s] External deviation detected on %s: %s (retries already stopped)",
                        self.engine.area_id,
                        entity_id,
                        deviating_attrs(new_state, expected),
                    )

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
    """Steers a channel's slot scene through three execution contexts.

    One instance per channel, built once by the Coordinator and reused for the
    engine's lifetime (see coordinator.py). The public method the caller picks
    *is* the context — there is no stored context field to branch on later:

    - `start(slot_id, ...)` — enter right now (input/activity). No transition
      (a fade would wake a manually-off lamp). Whole-scene entity filter.
    - `fade(slot_id, target_slot_start)` — anticipatory slot transition.
      Transition/retry-delays/reaction-end all derive from the one remaining-
      time computation against `target_slot_start`. Filters to entities
      currently on.
    - `reapply(slot_id)` — correction while the activity stays active
      (re-trigger sees a deviating light). No transition. Filters to
      currently-deviating entities.

    What's shared across all three (scene-type detection, the dynamic-Hue
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

    def _current_reapply_transition(self, reapply_transition: int | None) -> int | None:
        """Remaining time to target_slot_start, not the lead time fade() started with."""
        if self._fade_target_slot_start is None:
            return reapply_transition
        remaining = (
            self._fade_target_slot_start.astimezone(UTC) - datetime.now(UTC)
        ).total_seconds()
        return max(0, round(remaining))

    def _scene_info(self, slot_id: str) -> SlotSceneInfo | None:
        return get_slot_info(self.engine.scene_map, self.channel_id, slot_id)

    def _is_dynamic_slot(self, slot_id: str, scene_info: SlotSceneInfo | None) -> bool:
        """True if the slot is opted into Bridge-side dynamic playback.

        Requires both the opt-in AND a scene that actually supports it: the
        UI only offers the toggle for dynamic-capable Hue scenes, but the WS
        schema accepts the flag on any slot. Without this guard a flag set via
        the API on a plain HA scene would produce a failing hue.activate_scene
        call and silently skip the normal per-light path.
        """
        slot = self.engine.config.slot(self.channel_id, slot_id)
        if not slot or not slot.hue_activate_dynamic:
            return False
        return bool(scene_info and scene_info.supports_dynamic)

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
        if not self._is_dynamic_slot(slot_id, scene_info):
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
        if transition is not None and transition > 0:
            sdata["transition"] = transition
        return CallSpec("hue", "activate_scene", sdata)

    def _watched_target_states(
        self, scene_info: SlotSceneInfo, entities: list[str]
    ) -> dict[str, dict[str, Any]]:
        """Expected states of the given entities that have one defined."""
        return {
            entity_id: expected
            for entity_id in entities
            if (expected := scene_info.expected_states.get(entity_id))
        }

    def _build_scene_calls(
        self,
        scene_info: SlotSceneInfo,
        entities: list[str],
        transition: int | None,
    ) -> list[CallSpec]:
        """Per-entity light.turn_on/switch.turn_on|off to each entity's expected state."""
        _, switches, _ = partition_by_domain(entities)
        switch_ids = set(switches)
        calls: list[CallSpec] = []
        for entity_id in entities:
            expected = scene_info.expected_states.get(entity_id)
            if not expected:
                continue
            is_off = expected.get("state") == STATE_OFF
            if entity_id in switch_ids:
                service = "turn_off" if is_off else "turn_on"
                calls.append(CallSpec("switch", service, {"entity_id": entity_id}))
                continue
            if is_off:
                sdata: dict[str, Any] = {"entity_id": entity_id}
                if transition is not None and transition > 0:
                    sdata["transition"] = transition
                calls.append(CallSpec("light", "turn_off", sdata))
                continue
            sdata = build_light_service_data(
                self.hass,
                entity_id,
                expected,
                self._color_modes_cache,
                transition=transition,
            )
            calls.append(CallSpec("light", "turn_on", sdata))
        return calls

    def _is_ha_dynamic_scene(self, scene_id: str | None) -> bool:
        """Whether the scene entity is a HA dynamic scene (`is_dynamic` attribute).

        HA marks scenes whose lights animate (light effects) as dynamic. A
        retry or per-light reapply would re-send static values and fight that
        animation — same reasoning as the dynamic-Hue guard in
        `_is_dynamic_slot`/`_can_retry`.
        """
        if not scene_id:
            return False
        st = self.hass.states.get(scene_id)
        return bool(st and st.attributes.get("is_dynamic"))

    def is_dynamic_slot(self, slot_id: str, scene_info: SlotSceneInfo | None) -> bool:
        """Public combination of the Hue-dynamic and HA-dynamic-scene checks.

        Used by SlotCoordinator to decide whether a Stage-2 slot-change
        re-call would restart an already-running Bridge/HA-side rotation
        (see `_is_dynamic_slot`/`_is_ha_dynamic_scene` for why retries and
        reapply already avoid these slots).
        """
        return self._is_dynamic_slot(slot_id, scene_info) or self._is_ha_dynamic_scene(
            self._resolve_scene_id(slot_id, scene_info)
        )

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
            if dynamic_call := self._dynamic_scene_call(slot_id, scene_info, transition):
                return [dynamic_call]

            if (
                not self._is_ha_dynamic_scene(scene_id)
                and scene_info
                and scene_info.extracted_entities
                and scene_info.expected_states
            ):
                return self._build_scene_calls(
                    scene_info, list(scene_info.extracted_entities), transition
                )
            return [CallSpec("scene", "turn_on", {"entity_id": scene_id})]
        if domain == "light":
            return [CallSpec("light", "turn_on", {"entity_id": scene_id})]
        return [CallSpec("homeassistant", "turn_on", {"entity_id": scene_id})]

    def _can_retry(self, slot_id: str, scene_info: SlotSceneInfo | None) -> bool:
        # Central dynamic guards: retries always re-send per-light calls
        # (see _send_retry_call), which would drag a Bridge-side rotation or a
        # HA dynamic scene's animation back onto static values.
        if self._is_dynamic_slot(slot_id, scene_info):
            return False
        if self._is_ha_dynamic_scene(self._resolve_scene_id(slot_id, scene_info)):
            return False
        return bool(scene_info and scene_info.extracted_entities and scene_info.expected_states)

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
            dict(scene_info.expected_states)
            if scene_info and scene_info.expected_states
            else None
        )

        await self._run(
            calls,
            context_suffix=context_suffix,
            retry_entities=target_entities,
            should_retry=self._can_retry(slot_id, scene_info),
            retry_delays=list(DEFAULT_RETRY_DELAYS),
            reapply_transition=None,
            deviation_targets=deviation_targets,
        )

    async def fade(
        self, slot_id: str, target_slot_start: datetime, grace_elapsed: float = 0.0
    ) -> None:
        """Anticipatory slot transition: fade extracted entities to the target scene.

        Remaining time to `target_slot_start` is computed once here and drives
        transition seconds, retry delays, and the reaction-mode deadline — no
        separate re-derivation elsewhere.
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

        if dynamic_call := self._dynamic_scene_call(slot_id, scene_info, transition):
            calls: list[CallSpec] = [dynamic_call]
        else:
            calls = (
                self._build_scene_calls(scene_info, target_entities, transition)
                if scene_info
                else []
            )

        deviation_targets = (
            self._watched_target_states(scene_info, target_entities)
            if scene_info
            else {}
        )

        if transition <= 0:
            retry_delays = [0.5, 1.0, 2.0, 4.0, 8.0]
        else:
            retry_delays = [
                min(5.0, float(transition) / 3.0),
                float(transition) / 2.0,
                float(transition) + 2.0,
            ]

        await self._run(
            calls,
            context_suffix=slot_id,
            retry_entities=target_entities,
            should_retry=self._can_retry(slot_id, scene_info),
            retry_delays=retry_delays,
            reapply_transition=transition,
            reaction_mode=transition > 0 and bool(deviation_targets),
            deviation_targets=deviation_targets or None,
            grace_elapsed=grace_elapsed,
        )
        # Set only after _run() returns: _run() starts with self.cancel(), which
        # clears this field — setting it before _run() would have the deadline
        # wiped before the retry loop it drives ever gets scheduled.
        self._fade_target_slot_start = target_slot_start

    async def reapply(self, slot_id: str, grace_elapsed: float = 0.0) -> None:
        """Correct only the currently-deviating entities of an active slot's scene.

        No transition. If the slot's scene is not per-entity extractable (a
        Hue Smart-Scene, an Entity-Action scene, or the primary channel's
        fallback), there is nothing to compare per-entity — re-trigger the
        whole scene via `start()`'s call-building instead (§4.4 second
        bullet), skipping scripts (not idempotent — a script re-run could
        have side effects beyond restoring light state).

        Manual-off marking: if the active SlotAction has `respect_manual_off`
        set (opt-in, off by
        default), entities in `run_state.manual_off_entities` (turned off
        externally, marked by `LightStateInputHandler`) are skipped — the
        automation does not pull them back on slot changes. Re-triggers clear
        the set beforehand (`activity_requested()`), so the filter never
        applies there. Only meaningful for real slots (§6 point 5) —
        Entity-Action scenes have no per-entity target to apply it to.
        """
        scene_info = self._scene_info(slot_id)

        # Per-entity deviation reapply (the common case): scene exists and is
        # extractable.
        if scene_info and scene_info.extracted_entities and scene_info.expected_states:
            if self._is_dynamic_slot(slot_id, scene_info) or self._is_ha_dynamic_scene(
                self._resolve_scene_id(slot_id, scene_info)
            ):
                # §3: a dynamic slot (Hue Bridge rotation or HA is_dynamic
                # animation) is neither retried nor reapplied — a static
                # per-light call would drag the rotation back to frame 1,
                # same reasoning as the retry guard in _can_retry().
                return
            coordinator = self.engine.coordinator
            respect_manual_off = coordinator.is_respect_manual_off_active()
            manual_off = coordinator.run_state.manual_off_entities

            deviating = []
            for entity_id in scene_info.extracted_entities:
                if respect_manual_off and entity_id in manual_off:
                    continue
                expected = scene_info.expected_states.get(entity_id)
                if not expected:
                    continue
                st = self.hass.states.get(entity_id)
                if check_entity_deviation(st, expected):
                    deviating.append(entity_id)

            calls = self._build_scene_calls(scene_info, deviating, None)
            deviation_targets = self._watched_target_states(scene_info, deviating)

            await self._run(
                calls,
                context_suffix=f"{slot_id}_change",
                retry_entities=deviating,
                should_retry=self._can_retry(slot_id, scene_info),
                retry_delays=list(DEFAULT_RETRY_DELAYS),
                reapply_transition=None,
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
            retry_entities=[],
            should_retry=False,
            retry_delays=[],
            reapply_transition=None,
            grace_elapsed=grace_elapsed,
        )


class LightCallHandler(BaseCallHandler):
    """Direct light.turn_on parameter calls for Light-Actions (no scene involved).

    One instance per channel (in practice: only the primary channel, see
    action_handler.py). `start()`/`reapply()` mirror SceneCallHandler's
    pattern; there is no `fade()` — an anticipatory slot-transition fade is
    exclusively a Scene-slot concept (SlotConfig stays scene-only).
    """

    def _light_params(self, action: LightActionConfig) -> dict[str, Any]:
        light_params: dict[str, Any] = {}
        if action.brightness is not None:
            light_params["brightness"] = action.brightness
        if action.color_temp is not None:
            light_params["color_temp"] = action.color_temp
        if action.rgb_color is not None:
            light_params["rgb_color"] = action.rgb_color
        return light_params

    async def start(self, targets: list[str], action: LightActionConfig) -> None:
        """Apply direct light parameters. No retry (partial target, see §5 V4)."""
        all_targets = list(action.targets) or targets
        calls: list[CallSpec] = []
        if all_targets:
            sdata: dict[str, Any] = {
                "entity_id": all_targets,
                **self._light_params(action),
            }
            if action.transition is not None and action.transition > 0:
                sdata["transition"] = action.transition
            calls = [CallSpec("light", "turn_on", sdata)]

        await self._run(
            calls,
            context_suffix="direct_light",
            retry_entities=[],
            should_retry=False,
            retry_delays=[],
            reapply_transition=None,
        )

    async def reapply(self, targets: list[str], action: LightActionConfig) -> None:
        """Re-send only targets whose live state deviates from the configured parameters."""
        all_targets = list(action.targets) or targets
        light_params = self._light_params(action)
        expected = {"state": STATE_ON, **light_params}

        deviating = []
        for entity_id in all_targets:
            st = self.hass.states.get(entity_id)
            if check_entity_deviation(st, expected):
                deviating.append(entity_id)

        calls: list[CallSpec] = []
        if deviating:
            sdata: dict[str, Any] = {"entity_id": deviating, **light_params}
            calls = [CallSpec("light", "turn_on", sdata)]

        await self._run(
            calls,
            context_suffix="direct_light_change",
            retry_entities=[],
            should_retry=False,
            retry_delays=[],
            reapply_transition=None,
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
        "off"} target, and re-send turn_off with a *fresh* full transition —
        restarting the fade on every attempt. Shifting the whole schedule past
        the fade means the first check happens once the light has actually had
        time to reach off. Zero/absent transition keeps the default timing.
        """
        delays = list(DEFAULT_RETRY_DELAYS)
        fade = self.transition_off or 0
        if fade <= 0:
            return delays
        return [fade + delay for delay in delays]

    def _build_calls(self, entities: list[str]) -> list[CallSpec]:
        if not entities:
            return []

        lights, switches, others = partition_by_domain(entities)

        calls = []
        if lights:
            sdata: dict[str, Any] = {"entity_id": lights}
            if self.transition_off is not None:
                sdata["transition"] = self.transition_off
            calls.append(CallSpec("light", "turn_off", sdata))
        if switches:
            calls.append(CallSpec("switch", "turn_off", {"entity_id": switches}))
        if others:
            calls.append(CallSpec("homeassistant", "turn_off", {"entity_id": others}))

        return calls

    async def execute(self, entities: list[str], grace_elapsed: float = 0.0) -> None:
        """Turn off the given entities, with retries gated on reaching 'off'."""
        active_slot = self.engine.run_state.active_slots.get(self.channel_id)
        context_suffix = f"{active_slot}_off" if active_slot else "turn_off"

        await self._run(
            self._build_calls(entities),
            context_suffix=context_suffix,
            retry_entities=entities,
            should_retry=bool(entities),
            retry_delays=self._retry_delays(),
            reapply_transition=self.transition_off,
            deviation_targets={ent: {"state": STATE_OFF} for ent in entities}
            if entities
            else None,
            grace_elapsed=grace_elapsed,
        )
