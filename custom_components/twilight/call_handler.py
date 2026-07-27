"""Call handlers for Twilight control logic, implementing execution, transitions, retries, and deviation tracking."""

from __future__ import annotations

import asyncio
import functools
import logging
from abc import ABC, abstractmethod
from collections.abc import Callable, Coroutine
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any

from homeassistant.components.light import get_supported_color_modes
from homeassistant.const import STATE_OFF, STATE_ON, STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Context, HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.event import async_call_later, async_track_state_change_event
from homeassistant.util.color import color_temperature_mired_to_kelvin

from .config_model import ActionConfig, LightActionConfig
from .const import CONTEXT_PREFIX, DEFAULT_RETRY_DELAYS, ECHO_SETTLE_WINDOW_SECONDS
from .deviation import check_entity_deviation, deviating_attrs
from .echo import is_own_echo
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
            if value and value > 0:
                service_data["color_temp_kelvin"] = color_temperature_mired_to_kelvin(
                    value
                )
            else:
                _LOGGER.warning("[%s] Invalid color_temp value %s", entity_id, value)
        else:
            service_data[color_attr] = value

    return service_data


class BaseCallHandler(ABC):
    """Abstract base class for service call execution, retries, and deviation watching."""

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
        context = Context(id=self._make_context_id(f"{context_prefix}{attempt}"))
        service_data: dict[str, Any]
        domain = entity_id.split(".", 1)[0]

        if style == "blind":
            if domain != "light":
                # Non-light entities (e.g. switch.*) have no brightness/color to
                # blind-reapply — always drive them via their own on/off service.
                service = "turn_on" if expected.get("state") == STATE_ON else "turn_off"
                call_domain = domain if domain in ("light", "switch") else "homeassistant"
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

        service = "turn_on" if expected.get("state") == STATE_ON else "turn_off"
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

    # ── Hooks ──

    def _should_retry(self) -> bool:
        """Return True if retries are active for this handler."""
        return True

    def _reapply_transition(self) -> int | None:
        """Return transition time in seconds for reapplied calls, or None."""
        return None

    def _retry_delays(self) -> list[float]:
        """Return delays in seconds between retry attempts."""
        return list(DEFAULT_RETRY_DELAYS)

    def _update_reaction_mode(self) -> None:  # noqa: B027 -- optional hook, no-op by default
        """Hook: subclasses may switch reaction mode off based on timing."""

    def _filter_entities(self, entities: list[str]) -> list[str]:
        """Filter entities before execution."""
        return entities

    def _context_suffix(self) -> str:
        """Return suffix for Twilight context ID."""
        return self.__class__.__name__

    @abstractmethod
    def _build_calls(
        self, entities: list[str], params: dict[str, Any] | ActionConfig | None
    ) -> list[CallSpec]:
        """Build the list of service calls to execute."""

    async def execute(
        self,
        entities: list[str],
        params: dict[str, Any] | ActionConfig | None = None,
        grace_elapsed: float = 0.0,
    ) -> None:
        """Execute the service calls and schedule retries if enabled."""
        self.cancel()
        self._reached_target_entities.clear()

        filtered = self._filter_entities(entities)
        self._setup_deviation_watcher(filtered)
        calls = self._build_calls(filtered, params)

        if not calls:
            _LOGGER.debug(
                "[%s] CallHandler (%s): No service calls generated for channel %s",
                self.engine.area_id,
                self.__class__.__name__,
                self.channel_id,
            )
            return

        context = Context(id=self._make_context_id(self._context_suffix()))

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
            except Exception as err:
                _LOGGER.error(
                    "[%s] CallHandler: Failed to call %s.%s: %s",
                    self.engine.area_id,
                    call.domain,
                    call.service,
                    err,
                )

        self._last_call_at = datetime.now(UTC)

        if self._should_retry():
            self._retry_active = True
            self._schedule_retries(filtered, params, grace_elapsed=grace_elapsed)

    def _setup_deviation_watcher(  # noqa: B027 -- optional hook, no-op by default
        self, entities: list[str]
    ) -> None:
        """Hook for subclasses to start deviation watcher on execution."""

    def _schedule_retries(
        self,
        entities: list[str],
        params: dict[str, Any] | ActionConfig | None,
        grace_elapsed: float = 0.0,
    ) -> None:
        """Schedule retry attempts using the unified loop."""
        delays = self._retry_delays()
        if delays and grace_elapsed > 0:
            first_delay = max(0.1, delays[0] - grace_elapsed)
            delays = [first_delay, *delays[1:]]
        for attempt, delay in enumerate(delays, start=1):
            self._start_timer(
                delay,
                functools.partial(
                    self._perform_retry_attempt, entities, params, attempt
                ),
            )

    def _perform_retry_attempt(
        self,
        entities: list[str],
        params: dict[str, Any] | ActionConfig | None,
        attempt: int,
    ) -> None:
        """Perform unified retry attempt checking state deviations or reactions."""
        self._update_reaction_mode()

        if not self._retry_active:
            return

        if self._reaction_mode:
            remaining = [e for e in entities if e not in self._reacted_entities]
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

        retry_trans = self._reapply_transition()
        retry_style = "blind" if self._reaction_mode else "check"

        for entity_id in remaining:
            expected = self._target_states.get(entity_id)
            if not expected:
                continue
            self._send_retry_call(
                entity_id, expected, attempt, retry_trans, retry_style
            )

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

            if self._reaction_mode:
                self._reacted_entities.add(entity_id)
            else:
                # On deviation we only LOG, never re-drive the entity: once the
                # retry loop has reached target and stopped, a later external
                # change (e.g. the user turns the lamp off by hand) is honoured,
                # not fought. Re-application happens on the next real trigger.
                deviates = check_entity_deviation(new_state, expected)
                if not deviates:
                    self._reached_target_entities.add(entity_id)
                elif not is_own_echo(context, self.engine.area_id):
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


class _SceneCallHandler(BaseCallHandler):
    """Shared base for handlers that steer a slot scene's extracted entities.

    Holds the common scene_info wiring: retries gated on extracted_entities, a
    deviation watcher built from expected_states, and per-entity light.turn_on
    calls. Subclasses differ only in construction, filtering, and transition.
    """

    scene_info: SlotSceneInfo | None

    def _should_retry(self) -> bool:
        return bool(self.scene_info and self.scene_info.extracted_entities)

    def _watched_target_states(self, entities: list[str]) -> dict[str, dict[str, Any]]:
        """Expected states of the given entities that have one defined."""
        if not self.scene_info:
            return {}
        return {
            entity_id: expected
            for entity_id in entities
            if (expected := self.scene_info.expected_states.get(entity_id))
        }

    def _build_scene_calls(
        self, entities: list[str], transition: int | None
    ) -> list[CallSpec]:
        """Per-entity light.turn_on/switch.turn_on|off to each entity's expected state."""
        if not self.scene_info:
            return []
        _, switches, _ = partition_by_domain(entities)
        switch_ids = set(switches)
        calls = []
        for entity_id in entities:
            expected = self.scene_info.expected_states.get(entity_id)
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


class SlotDirectCallHandler(_SceneCallHandler):
    """Call handler for input-triggered scene activations (motion/activity/button)."""

    def __init__(self, engine: TwilightEngine, channel_id: str, slot_id: str) -> None:
        super().__init__(engine, channel_id)
        self.slot_id = slot_id
        self.scene_info = get_slot_info(engine.scene_map, channel_id, slot_id)

    def _filter_entities(self, entities: list[str]) -> list[str]:
        """Fall back to the scene's own entities when the caller passes none.

        Callers that activate a whole slot scene pass `execute([])` — without
        this fallback the retry loop would have no entities to check and the
        scene would never be re-driven. An explicitly passed (sub)set is
        respected as-is.
        """
        if entities:
            return entities
        if not self.scene_info:
            return []
        return list(self.scene_info.extracted_entities)

    def _setup_deviation_watcher(self, entities: list[str]) -> None:
        if self.scene_info and self.scene_info.expected_states:
            self._start_deviation_watcher(dict(self.scene_info.expected_states))

    def _context_suffix(self) -> str:
        if self.slot_id and self.slot_id.startswith(("scene.", "script.")):
            return "direct"
        return self.slot_id or "direct"

    def _build_calls(
        self, entities: list[str], params: dict[str, Any] | ActionConfig | None
    ) -> list[CallSpec]:
        scene_id = None
        if self.scene_info and self.scene_info.scene_entity_id:
            scene_id = self.scene_info.scene_entity_id
        elif self.slot_id and "." in self.slot_id:
            scene_id = self.slot_id
        elif self.slot_id:
            slot = self.engine.config.slot(self.channel_id, self.slot_id)
            if slot:
                scene_id = slot.scene_entity_id

        if not scene_id or "." not in scene_id:
            return []

        domain, object_id = scene_id.split(".", 1)
        if domain == "script":
            return [CallSpec("script", object_id, {})]
        if domain == "scene":
            st = self.hass.states.get(scene_id)
            is_dynamic = bool(st and st.attributes.get("is_dynamic"))
            if (
                not is_dynamic
                and self.scene_info
                and self.scene_info.extracted_entities
            ):
                return self._build_scene_calls(
                    list(self.scene_info.extracted_entities), transition=None
                )
            return [CallSpec("scene", "turn_on", {"entity_id": scene_id})]
        if domain == "light":
            return [CallSpec("light", "turn_on", {"entity_id": scene_id})]
        return [CallSpec("homeassistant", "turn_on", {"entity_id": scene_id})]


class SlotTransitionCallHandler(_SceneCallHandler):
    """Call handler for astronomical slot transitions (respects manual-off and applies transition).

    Not a SlotDirectCallHandler: slot transitions never call scene.turn_on but
    steer each extracted entity individually.
    """

    def __init__(
        self,
        engine: TwilightEngine,
        channel_id: str,
        target_slot_id: str,
        target_slot_start: datetime,
    ) -> None:
        super().__init__(engine, channel_id)
        self.target_slot_id = target_slot_id
        self.target_slot_start = target_slot_start
        self.scene_info = get_slot_info(engine.scene_map, channel_id, target_slot_id)

    def _context_suffix(self) -> str:
        return self.target_slot_id

    def cancel(self) -> None:
        """Cancel all running tasks/timers and reset Phase A/B reaction state."""
        super().cancel()
        self._reaction_mode = False

    def _setup_deviation_watcher(self, entities: list[str]) -> None:
        target_states = self._watched_target_states(entities)
        if target_states:
            self._start_deviation_watcher(target_states)
            self._reaction_mode = True

    def _transition_on_seconds(self) -> int | None:
        # Dynamically calculate remaining transition until target_slot_start.
        # 0 once the slot start is reached (fade over → exact reapply, hard).
        now = datetime.now(UTC)
        target_utc = self.target_slot_start.astimezone(UTC)
        diff = (target_utc - now).total_seconds()
        return max(0, round(diff))

    def _reapply_transition(self) -> int | None:
        return self._transition_on_seconds()

    def _update_reaction_mode(self) -> None:
        # Once the target slot start is reached, the fade is over: leave reaction
        # mode so the final attempt enforces the exact target state.
        if self._reaction_mode:
            now = datetime.now(UTC)
            if now >= self.target_slot_start.astimezone(UTC):
                self._reaction_mode = False

    def _retry_delays(self) -> list[float]:
        lead = self._transition_on_seconds() or 0
        if lead <= 0:
            return [0.5, 1.0, 2.0, 4.0, 8.0]
        return [min(5.0, float(lead) / 3.0), float(lead) / 2.0, float(lead) + 2.0]

    def _filter_entities(self, entities: list[str]) -> list[str]:
        """Filter to entities currently 'on' and not 'unavailable'.

        Always derived from scene_info.extracted_entities — the entities
        argument passed by the caller is unused for this handler.
        """
        if not self.scene_info:
            return []
        out = []
        for entity_id in self.scene_info.extracted_entities:
            st = self.hass.states.get(entity_id)
            if st and st.state not in (STATE_OFF, STATE_UNAVAILABLE, STATE_UNKNOWN):
                out.append(entity_id)
        return out

    def _build_calls(
        self, entities: list[str], _params: dict[str, Any] | ActionConfig | None
    ) -> list[CallSpec]:
        return self._build_scene_calls(entities, self._transition_on_seconds())


class SlotChangeCallHandler(_SceneCallHandler):
    """Call handler for reapplying only the deviating entities of a slot scene."""

    def __init__(
        self,
        engine: TwilightEngine,
        channel_id: str,
        target_slot_id: str,
    ) -> None:
        super().__init__(engine, channel_id)
        self.target_slot_id = target_slot_id
        self.scene_info = get_slot_info(engine.scene_map, channel_id, target_slot_id)

    def _context_suffix(self) -> str:
        return f"{self.target_slot_id}_change"

    def _setup_deviation_watcher(self, entities: list[str]) -> None:
        target_states = self._watched_target_states(entities)
        if target_states:
            self._start_deviation_watcher(target_states)

    def _filter_entities(self, entities: list[str]) -> list[str]:
        """Filter to entities that currently deviate from expected states.

        Always derived from scene_info.extracted_entities — the entities
        argument passed by the caller is unused for this handler.
        """
        if not self.scene_info:
            return []
        out = []
        for entity_id in self.scene_info.extracted_entities:
            expected = self.scene_info.expected_states.get(entity_id)
            if not expected:
                continue
            st = self.hass.states.get(entity_id)
            if check_entity_deviation(st, expected):
                out.append(entity_id)
        return out

    def _build_calls(
        self, entities: list[str], _params: dict[str, Any] | ActionConfig | None
    ) -> list[CallSpec]:
        return self._build_scene_calls(entities, None)


class LightDirectCallHandler(BaseCallHandler):
    """Call handler for direct light parameter actions (set_lights)."""

    def _should_retry(self) -> bool:
        return False

    def _context_suffix(self) -> str:
        return "direct_light"

    def _build_calls(
        self, entities: list[str], params: dict[str, Any] | ActionConfig | None
    ) -> list[CallSpec]:
        if not isinstance(params, LightActionConfig):
            return []
        targets = list(params.targets) or entities
        if not targets:
            return []
        light_params: dict[str, Any] = {}
        if params.brightness is not None:
            light_params["brightness"] = params.brightness
        if params.color_temp is not None:
            light_params["color_temp"] = params.color_temp
        if params.rgb_color is not None:
            light_params["rgb_color"] = params.rgb_color
        return [CallSpec("light", "turn_on", {"entity_id": targets, **light_params})]


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

    def _should_retry(self) -> bool:
        return True

    def _reapply_transition(self) -> int | None:
        return self.transition_off

    def _context_suffix(self) -> str:
        active_slot = self.engine.run_state.active_slots.get(self.channel_id)
        return f"{active_slot}_off" if active_slot else "turn_off"

    def _setup_deviation_watcher(self, entities: list[str]) -> None:
        if entities:
            self._start_deviation_watcher(
                {ent: {"state": STATE_OFF} for ent in entities}
            )

    def _build_calls(
        self, entities: list[str], params: dict[str, Any] | ActionConfig | None
    ) -> list[CallSpec]:
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
