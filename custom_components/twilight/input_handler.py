"""Input handler layer — normalizes HA sensor events for the Twilight engine."""

from __future__ import annotations

import logging
import time
from collections.abc import Callable
from typing import TYPE_CHECKING, Any, TypeVar, cast

from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import callback
from homeassistant.helpers.event import (
    async_call_later,
    async_track_state_change_event,
    async_track_time_change,
)

from .const import (
    ACTIVE_STATES,
    ALL_IGNORE_SLOTS,
    DEFAULT_LUX_IGNORE_ACTIVE,
    DEFAULT_LUX_IGNORE_SCOPE,
    DEFAULT_LUX_THRESHOLD,
    DEFAULT_LUX_WATCH_WINDOW,
    MOTION_ACTIVE_STATES,
    PRIMARY_CHANNEL_ID,
    TWILIGHT_SLOTS,
    InputType,
    LuxIgnoreScope,
    RetriggerMode,
    SensorType,
)
from .echo import is_own_echo
from .helpers import (
    aggregate_active,
    get_config_value,
    parse_hms_parts,
    resolve_aggregation,
    resolve_retrigger,
)

if TYPE_CHECKING:
    from .config_model import (
        EventInputConfig,
        InputConfig,
        MotionInputConfig,
        TimerInputConfig,
    )
    from .engine import TwilightEngine

_LOGGER = logging.getLogger(__name__)

T = TypeVar("T")


class BaseInputHandler:
    """Base class for all Twilight input handlers."""

    #: Human-readable label used in the setup debug logs (e.g. "Illuminance").
    #: State-change handlers that use the standard ``async_setup`` template set
    #: this; handlers with their own setup (Timer) leave it empty.
    STATE_LABEL: str = ""

    def __init__(self, engine: TwilightEngine) -> None:
        """Initialize the input handler."""
        self.engine = engine
        self.listeners: list[Any] = []

    async def async_setup(self, *args: Any, **kwargs: Any) -> None:
        """Register a state-change listener for this handler's tracked entities.

        Template method for the state-change input handlers (Lux/Event/Motion):
        collect the entities (``_tracked_entities`` hook), bail out if none are
        configured, register ``_on_state_changed``, then run an optional
        post-setup step (``_after_listener_setup`` hook). Handlers whose setup
        does not fit this shape (Binary's ordered initial sync, Timer's
        time-change scheduling) override ``async_setup`` directly.
        """
        entities = self._tracked_entities()
        if not entities:
            _LOGGER.debug(
                "[%s] %s: nothing configured",
                self.engine.area_id,
                self.STATE_LABEL or self.__class__.__name__,
            )
            return
        self.listeners.append(
            async_track_state_change_event(
                self.engine.hass, entities, self._on_state_changed
            )
        )
        _LOGGER.debug(
            "[%s] %s: listening on %s",
            self.engine.area_id,
            self.STATE_LABEL or self.__class__.__name__,
            entities,
        )
        self._after_listener_setup(entities)

    def _tracked_entities(self) -> list[str]:
        """Hook: the entities this handler's ``async_setup`` template listens on.

        Empty by default (base handler and non-template handlers register
        nothing via the template).
        """
        return []

    def _on_state_changed(self, event: Any) -> None:
        """Hook: handle a state-change event for a tracked entity."""

    def _after_listener_setup(self, entities: list[str]) -> None:
        """Hook: optional step run after the listener is registered (e.g. seed state)."""

    async def async_teardown(self) -> None:
        """Tear down the event listeners."""
        _LOGGER.debug(
            "[%s] %s teardown — unsubscribing %d listener(s)",
            self.engine.area_id,
            self.__class__.__name__,
            len(self.listeners),
        )
        for unsub in self.listeners:
            unsub()
        self.listeners.clear()

    def _is_disabled(self, inp_id: str | None) -> bool:
        """Return True if the input is currently suppressed by a disabler."""
        if not isinstance(inp_id, str):
            return False
        return bool(self.engine.run_state.inputs_disabled_by.get(inp_id))

    @callback
    def _log_state_changed(self, event: Any, sensor_type: str) -> None:
        """Callback when an entity state changes."""
        entity_id = event.data.get("entity_id", None)
        new_state = event.data.get("new_state")
        old_state = event.data.get("old_state", None)
        _LOGGER.debug(
            "[%s] %s sensor: %s  %s → %s",
            self.engine.area_id,
            sensor_type,
            entity_id,
            old_state.state if old_state else None,
            new_state.state if new_state else None,
        )


class LuxInputHandler(BaseInputHandler):
    """Handles lux sensor changes and forwards them to the coordinator."""

    STATE_LABEL = "Illuminance"

    def _tracked_entities(self) -> list[str]:
        """The illuminance sensor entities configured for this area."""
        from .config_model import IlluminanceSensorConfig

        sensors: list[str] = []
        for s in self.engine.config.sensors_of_type(SensorType.ILLUMINANCE):
            if isinstance(s, IlluminanceSensorConfig):
                sensors.extend(s.entity_ids)
        return sensors

    @callback
    def _on_state_changed(self, event: Any) -> None:
        """Callback when a lux sensor changes state."""
        super()._log_state_changed(event, "Illuminance")
        new_state = event.data.get("new_state")

        if not new_state:
            return

        self.engine.coordinator.lux_changed()


class EventInputHandler(BaseInputHandler):
    """Handles event signals from buttons and switches to request activities."""

    STATE_LABEL = "Event"

    def _tracked_entities(self) -> list[str]:
        """The entities of all event inputs configured for this area."""
        return [
            ent
            for inp in self.engine.config.inputs_of_type(InputType.EVENT)
            for ent in inp.entity_ids
            if ent
        ]

    @callback
    def _on_state_changed(self, event: Any) -> None:
        """Callback when an event entity state changes."""
        super()._log_state_changed(event, "Event")
        entity_id = event.data.get("entity_id")
        new_state = event.data.get("new_state")
        old_state = event.data.get("old_state")

        if not entity_id or not new_state:
            return

        if new_state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return

        # Ignore state restoration or online/offline transitions at startup/reload
        if (
            old_state is None
            or old_state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN)
        ):
            return

        old_event_type = old_state.attributes.get("event_type")
        new_event_type = new_state.attributes.get("event_type")
        if old_state.state == new_state.state and old_event_type == new_event_type:
            return

        # Find the activities mapped to this event entity_id and event_type
        event_type = new_state.attributes.get("event_type")
        _LOGGER.debug(
            "[%s] Event sensor: %s  event_type=%s",
            self.engine.area_id,
            entity_id,
            event_type,
        )

        for inp in cast(
            "tuple[EventInputConfig, ...]",
            self.engine.config.inputs_of_type(InputType.EVENT),
        ):
            if entity_id not in inp.entity_ids:
                continue

            if inp.event_type and inp.event_type != event_type:
                continue

            if inp.activity:
                if self._is_disabled(inp.id):
                    _LOGGER.debug(
                        "[%s] Event sensor: %s event ignored because input %s is disabled",
                        self.engine.area_id,
                        entity_id,
                        inp.id,
                    )
                    continue
                self.engine.coordinator.activity_requested(
                    inp.activity,
                    input_id=inp.id,
                    input_type="event",
                    entity_id=entity_id,
                )


class BinaryInputHandler(BaseInputHandler):
    """Handles state signals from binary sensors (doors/windows) to request/release activities."""

    def __init__(self, engine: TwilightEngine) -> None:
        """Initialize the BinaryInputHandler."""
        super().__init__(engine)
        self.entity_active: dict[str, bool] = {}

    def _resolve_aggregation(self, inp: InputConfig) -> tuple[str, int | None]:
        """Resolve (mode, count) for a binary input via area → global → const fallback."""
        return resolve_aggregation(
            self.engine.hass, inp, self.engine.config, InputType.BINARY
        )

    async def async_setup(self) -> None:
        """Set up binary sensor listeners."""
        binary_inputs = self.engine.config.inputs_of_type(InputType.BINARY)
        binary_entities = [
            ent for inp in binary_inputs for ent in inp.entity_ids if ent
        ]

        if not binary_entities:
            _LOGGER.debug(
                "[%s] BinaryInputHandler: no binary inputs configured",
                self.engine.area_id,
            )
            return

        # Sync initial state
        for inp in binary_inputs:
            for ent in inp.entity_ids:
                if not ent:
                    continue
                state_obj = self.engine.hass.states.get(ent)
                if state_obj and state_obj.state not in (
                    STATE_UNAVAILABLE,
                    STATE_UNKNOWN,
                ):
                    self.entity_active[ent] = state_obj.state in ACTIVE_STATES
                else:
                    self.entity_active[ent] = False

        for inp in binary_inputs:
            if not inp.entity_ids or not inp.activity:
                continue

            active_flags = [
                self.entity_active.get(ent, False) for ent in inp.entity_ids if ent
            ]
            agg_mode, agg_count = self._resolve_aggregation(inp)
            active = aggregate_active(active_flags, agg_mode, agg_count)

            if inp.id:
                self.engine.coordinator.update_input_active(inp.id, active)

            # Check disabler list
            if self._is_disabled(inp.id):
                _LOGGER.debug(
                    "[%s] Initial sync for binary input %s ignored (disabled)",
                    self.engine.area_id,
                    inp.id,
                )
                continue

            if active:
                trigger_entity = next(
                    (ent for ent in inp.entity_ids if self.entity_active.get(ent)),
                    None,
                )
                if not trigger_entity and inp.entity_ids:
                    trigger_entity = inp.entity_ids[0]
                self.engine.coordinator.activity_requested(
                    inp.activity,
                    input_id=inp.id,
                    input_type="binary",
                    entity_id=trigger_entity,
                )
            else:
                self.engine.coordinator.activity_released(inp.activity)

        self.listeners.append(
            async_track_state_change_event(
                self.engine.hass, binary_entities, self._on_state_changed
            )
        )
        _LOGGER.debug(
            "[%s] BinaryInputHandler: listening on %s",
            self.engine.area_id,
            binary_entities,
        )

    @callback
    def _on_state_changed(self, event: Any) -> None:
        """Callback when a binary input state changes."""
        super()._log_state_changed(event, "Binary")
        entity_id = event.data.get("entity_id")
        new_state = event.data.get("new_state")

        if not entity_id or not new_state:
            return

        if new_state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return

        # Find all binary inputs mapped to this entity_id
        matched_inputs = [
            inp
            for inp in self.engine.config.inputs_of_type(InputType.BINARY)
            if entity_id in inp.entity_ids
        ]
        if not matched_inputs:
            return

        active = new_state.state in ACTIVE_STATES
        self.entity_active[entity_id] = active

        for inp in matched_inputs:
            agg_mode, agg_count = self._resolve_aggregation(inp)

            # Calculate old aggregation state
            old_state = event.data.get("old_state")
            old_entity_active = (
                old_state.state in ACTIVE_STATES
                if old_state
                and old_state.state not in (STATE_UNAVAILABLE, STATE_UNKNOWN)
                else False
            )
            old_flags = [
                (
                    old_entity_active
                    if ent == entity_id
                    else self.entity_active.get(ent, False)
                )
                for ent in inp.entity_ids
                if ent
            ]
            old_agg_active = aggregate_active(old_flags, agg_mode, agg_count)

            # Calculate new aggregation state
            new_flags = [
                self.entity_active.get(ent, False) for ent in inp.entity_ids if ent
            ]
            new_agg_active = aggregate_active(new_flags, agg_mode, agg_count)

            # Update physical active state in coordinator (never suppress tracking to
            # avoid drift, even for disabled/activity-less inputs)
            if inp.id:
                self.engine.coordinator.update_input_active(inp.id, new_agg_active)

            if not inp.activity:
                continue

            # Check if disabled before calling coordinator request/release
            if inp.id and self._is_disabled(inp.id):
                _LOGGER.debug(
                    "[%s] Binary input %s state change ignored because input is disabled",
                    self.engine.area_id,
                    inp.id,
                )
                continue

            if old_agg_active != new_agg_active:
                if new_agg_active:
                    self.engine.coordinator.activity_requested(
                        inp.activity,
                        input_id=inp.id,
                        input_type="binary",
                        entity_id=entity_id,
                    )
                else:
                    self.engine.coordinator.activity_released(inp.activity)


class LightStateInputHandler(BaseInputHandler):
    """Watches light entity state changes and distinguishes Twilight's own echoes
    from external changes."""

    ENABLED = True

    def __init__(self, engine: TwilightEngine) -> None:
        super().__init__(engine)
        self.watched_entities: set[str] = set()

    async def async_setup(self, watched_entities: set[str] | None = None) -> None:
        """Set up state change tracking for the union of all slot extracted entities."""
        await self.async_teardown()

        if not self.ENABLED:
            return

        if watched_entities is None:
            watched_entities = set()
            for slot_info in self.engine.scene_map.values():
                watched_entities.update(slot_info.extracted_entities)

        self.watched_entities = watched_entities
        if not self.watched_entities:
            _LOGGER.debug(
                "[%s] LightStateInputHandler: no entities to watch", self.engine.area_id
            )
            return

        self.listeners.append(
            async_track_state_change_event(
                self.engine.hass, list(self.watched_entities), self._on_state_changed
            )
        )
        _LOGGER.debug(
            "[%s] LightStateInputHandler: watching %d entities: %s",
            self.engine.area_id,
            len(self.watched_entities),
            self.watched_entities,
        )

    @callback
    def _on_state_changed(self, event: Any) -> None:
        entity_id = event.data.get("entity_id")
        new_state = event.data.get("new_state")

        if not entity_id or not new_state:
            return

        if new_state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return

        if is_own_echo(event.context, self.engine.area_id):
            _LOGGER.debug(
                "[%s] LightStateInputHandler: %s → %s (own echo)",
                self.engine.area_id,
                entity_id,
                new_state.state,
            )
            return

        _LOGGER.info(
            "[%s] LightStateInputHandler: external change detected: %s → %s",
            self.engine.area_id,
            entity_id,
            new_state.state,
        )


class TimerInputHandler(BaseInputHandler):
    """Fires an activity request daily at a configured local time."""

    async def async_setup(self) -> None:
        """Set up timer listeners."""
        for inp in cast(
            "tuple[TimerInputConfig, ...]",
            self.engine.config.inputs_of_type(InputType.TIMER),
        ):
            time_str = inp.trigger_time
            activity = inp.activity
            inp_id = inp.id

            if not time_str or not activity or not isinstance(inp_id, str):
                continue

            parsed = parse_hms_parts(time_str)
            if parsed is None:
                _LOGGER.warning(
                    "[%s] Invalid timer time format: %s",
                    self.engine.area_id,
                    time_str,
                )
                continue
            h, m, s = parsed

            def make_callback(act: str, i_id: str) -> Callable[[Any], None]:
                @callback
                def _fire_timer(_now: Any) -> None:
                    # Check if disabled
                    if self._is_disabled(i_id):
                        _LOGGER.debug(
                            "[%s] Timer trigger %s ignored because input is disabled",
                            self.engine.area_id,
                            i_id,
                        )
                        return
                    _LOGGER.info(
                        "[%s] Timer input %s triggered activity: %s",
                        self.engine.area_id,
                        i_id,
                        act,
                    )
                    self.engine.coordinator.activity_requested(
                        act,
                        input_id=i_id,
                        input_type="timer",
                        entity_id=None,
                    )

                return _fire_timer

            unsub = async_track_time_change(
                self.engine.hass,
                make_callback(activity, inp_id),
                hour=h,
                minute=m,
                second=s,
            )
            self.listeners.append(unsub)
            _LOGGER.debug(
                "[%s] TimerInputHandler: scheduled timer %s for %s to trigger activity: %s",
                self.engine.area_id,
                inp_id,
                time_str,
                activity,
            )


# ── Motion / Lux Handlers ──

POLL_INTERVAL = 1  # seconds


class LuxWatchHandler:
    """Evaluates lux levels periodically within a time window after motion is detected."""

    def __init__(
        self,
        hass: Any,
        evaluate_fn: Callable[[], bool],
        on_success_fn: Callable[[], None],
        on_expiry_fn: Callable[[], None],
        window_seconds: int,
    ) -> None:
        """Initialize the LuxWatchHandler."""
        self._hass = hass
        self._evaluate_fn = evaluate_fn
        self._on_success_fn = on_success_fn
        self._on_expiry_fn = on_expiry_fn
        self._window = window_seconds
        self._deadline: float = 0.0
        self._unsub: Callable[[], None] | None = None

    def start(self) -> None:
        """Start polling, or extend the deadline if already running."""
        self._deadline = time.monotonic() + self._window
        if self._unsub:
            return
        self._unsub = async_call_later(self._hass, POLL_INTERVAL, self._poll)

    def stop(self) -> None:
        """Stop polling."""
        if self._unsub:
            self._unsub()
            self._unsub = None

    @callback
    def _poll(self, _now: Any) -> None:
        """Poll evaluation function."""
        self._unsub = None
        try:
            success = self._evaluate_fn()
        except Exception:
            _LOGGER.exception("Error evaluating lux watch condition")
            self._on_expiry_fn()  # give up, don't hang the poll chain
            return
        if success:
            self._on_success_fn()  # success!
            return
        if time.monotonic() >= self._deadline:
            self._on_expiry_fn()  # window expired, give up
            return
        # continue polling
        self._unsub = async_call_later(self._hass, POLL_INTERVAL, self._poll)


class MotionInputHandler(BaseInputHandler):
    """Evaluates motion inputs based on state changes and lux thresholds."""

    def __init__(self, engine: TwilightEngine) -> None:
        """Initialize the MotionInputHandler."""
        super().__init__(engine)
        self.active_entities: set[str] = set()
        self.lux_watches: dict[str, LuxWatchHandler] = {}
        self._last_trigger_entity: dict[str, str] = {}

    def _resolve_retrigger(self, inp: InputConfig) -> str:
        """Resolve the re-trigger mode ("every"/"first") for a motion input.

        "every" re-triggers on each motion event (restarting the auto-expire
        timer); "first" only triggers on the input's off→on activation. This is
        not a multi-entity aggregation — any active entity keeps the input active.
        """
        return resolve_retrigger(self.engine.hass, inp, self.engine.config)

    STATE_LABEL = "Motion"

    def _tracked_entities(self) -> list[str]:
        """The entities of all motion inputs configured for this area."""
        return [
            ent
            for inp in cast(
                "tuple[MotionInputConfig, ...]",
                self.engine.config.inputs_of_type(InputType.MOTION),
            )
            for ent in inp.entity_ids
            if ent
        ]

    def _after_listener_setup(self, entities: list[str]) -> None:
        """Seed ``active_entities`` from the current state of the motion sensors.

        Populating a set has no side effects, so doing it after the listener is
        registered (rather than before, as the pre-template code did) is safe:
        no ``activity_requested`` is issued here, unlike Binary's ordered sync.
        """
        for ent in entities:
            state_obj = self.engine.hass.states.get(ent)
            if state_obj and state_obj.state in MOTION_ACTIVE_STATES:
                self.active_entities.add(ent)

    async def async_teardown(self) -> None:
        """Tear down listeners and lux watch timers."""
        for watch in self.lux_watches.values():
            watch.stop()
        self.lux_watches.clear()
        self._last_trigger_entity.clear()
        await super().async_teardown()

    @callback
    def _on_state_changed(self, event: Any) -> None:
        """Callback when a motion sensor changes state."""
        super()._log_state_changed(event, "Motion")
        entity_id = event.data.get("entity_id")
        new_state = event.data.get("new_state")

        if not entity_id or not new_state:
            return

        if new_state.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return

        active = new_state.state in MOTION_ACTIVE_STATES
        old_active = entity_id in self.active_entities

        if active == old_active:
            return

        if active:
            self.active_entities.add(entity_id)
        else:
            self.active_entities.discard(entity_id)

        # Update physical active state and trigger evaluation for all matching motion inputs
        matched = False
        for inp in cast(
            "tuple[MotionInputConfig, ...]",
            self.engine.config.inputs_of_type(InputType.MOTION),
        ):
            if entity_id not in inp.entity_ids:
                continue

            inp_active = any(ent in self.active_entities for ent in inp.entity_ids)

            if inp.id:
                self.engine.coordinator.update_input_active(inp.id, inp_active)
                matched = True

            if not active and not inp_active and inp.id in self.lux_watches:
                # No entity of this input is active anymore — stop polling for a
                # lux drop rather than waiting out the full lux_watch_window.
                self.lux_watches.pop(inp.id).stop()

            if active:
                if inp.id and self._is_disabled(inp.id):
                    _LOGGER.debug(
                        "[%s] Motion input %s trigger ignored because input is disabled",
                        self.engine.area_id,
                        inp.id,
                    )
                    continue

                # In "first" mode, only the input's off→on activation triggers:
                # suppress the re-trigger if another entity is already active.
                if self._resolve_retrigger(inp) == RetriggerMode.FIRST:
                    other_active = any(
                        ent in self.active_entities
                        for ent in inp.entity_ids
                        if ent != entity_id
                    )
                    if other_active:
                        _LOGGER.debug(
                            "[%s] Motion input %s re-trigger suppressed (retrigger=first, other entity active)",
                            self.engine.area_id,
                            inp.id,
                        )
                        continue

                # Save the specific entity that triggered this motion
                if inp.id:
                    self._last_trigger_entity[inp.id] = entity_id

                self.on_motion_active(inp, entity_id)

        if not matched:
            self.engine.coordinator.update_input_active(None, active)

    def _get_value(self, input_config: MotionInputConfig, key: str, default: T) -> T:
        return cast(
            T,
            get_config_value(
                self.engine.hass, [input_config, self.engine.config], key, default
            ),
        )

    def _should_ignore_lux(self, input_config: MotionInputConfig) -> bool:
        """Return True if lux check should be skipped for the current engine state."""
        from .config_model import IlluminanceSensorConfig

        illuminance_sensors = self.engine.config.sensors_of_type(SensorType.ILLUMINANCE)
        if not any(
            isinstance(s, IlluminanceSensorConfig) and s.entity_ids
            for s in illuminance_sensors
        ):
            # No illuminance sensor configured (or configured with no entity_ids,
            # as in the default area template) — never gate motion on a lux
            # reading that can never be produced.
            return True

        lux_ignore_active = self._get_value(
            input_config, "lux_ignore_active", DEFAULT_LUX_IGNORE_ACTIVE
        )
        lux_ignore_scope = self._get_value(
            input_config, "lux_ignore_scope", DEFAULT_LUX_IGNORE_SCOPE
        )

        if (
            lux_ignore_active
            and self.engine.coordinator.run_state.scene_activated_at is not None
        ):
            return True
        # Twilight-slot test uses the Primary channel: it carries the astral zones
        # and represents the room's day/night phase.
        primary_slot = self.engine.coordinator.run_state.active_slots.get(
            PRIMARY_CHANNEL_ID
        )
        if lux_ignore_scope == LuxIgnoreScope.TWILIGHT_SLOTS:
            return primary_slot in TWILIGHT_SLOTS
        if lux_ignore_scope == LuxIgnoreScope.ALL_SLOTS:
            return primary_slot in ALL_IGNORE_SLOTS
        return False

    def _evaluate(
        self, input_config: MotionInputConfig, ignore_lux: bool = False
    ) -> bool:
        if not any(ent in self.active_entities for ent in input_config.entity_ids):
            return False
        lux_threshold = self._get_value(
            input_config, "lux_threshold", DEFAULT_LUX_THRESHOLD
        )
        # Note: a `null` lux_threshold never disables the gate — get_config_value
        # treats None as "unset" and falls through to DEFAULT_LUX_THRESHOLD. The
        # gate is disabled via _should_ignore_lux() (no illuminance sensor, or the
        # lux_ignore_active/scope options), not by clearing the threshold.
        if ignore_lux or self._should_ignore_lux(input_config):
            return True
        lux = self._read_lux()
        return lux is not None and lux <= lux_threshold

    def get_motion_state(
        self, input_config: MotionInputConfig, ignore_lux: bool = False
    ) -> bool:
        """Check if motion is active."""
        return self._evaluate(input_config, ignore_lux)

    def has_active_motion_for_activity(
        self, activity_name: str, ignore_lux: bool = False
    ) -> bool:
        """Check if any enabled motion input triggering this activity is currently active."""
        for inp in cast(
            "tuple[MotionInputConfig, ...]",
            self.engine.config.inputs_of_type(InputType.MOTION),
        ):
            if inp.activity != activity_name:
                continue
            if self._is_disabled(inp.id):
                continue
            if self.get_motion_state(inp, ignore_lux=ignore_lux):
                return True
        return False

    def on_motion_active(self, input_config: MotionInputConfig, entity_id: str) -> None:
        """Triggered when motion state becomes active."""
        input_id = input_config.id
        activity = input_config.activity
        if not input_id or not activity:
            return
        lux_watch_window = self._get_value(
            input_config, "lux_watch_window", DEFAULT_LUX_WATCH_WINDOW
        )

        if self._is_disabled(input_id):
            return

        if self._evaluate(input_config):
            if input_id in self.lux_watches:
                self.lux_watches[input_id].stop()
                del self.lux_watches[input_id]
            self.engine.coordinator.activity_requested(
                activity,
                input_id=input_id,
                input_type="motion",
                entity_id=entity_id,
            )
        elif lux_watch_window:
            watch = self.lux_watches.get(input_id)
            if watch is None:
                watch = LuxWatchHandler(
                    hass=self.engine.hass,
                    evaluate_fn=lambda: self._evaluate(input_config),
                    on_success_fn=lambda: self._on_lux_success(input_config),
                    on_expiry_fn=lambda: self._on_lux_expiry(input_config),
                    window_seconds=lux_watch_window,
                )
                self.lux_watches[input_id] = watch
            watch.start()

    def _on_lux_success(self, input_config: MotionInputConfig) -> None:
        input_id = input_config.id
        activity = input_config.activity
        if input_id in self.lux_watches:
            del self.lux_watches[input_id]

        if not input_id or not activity:
            return

        if self._is_disabled(input_id):
            _LOGGER.debug(
                "[%s] Lux success for motion input %s ignored because input is disabled",
                self.engine.area_id,
                input_id,
            )
            return

        trigger_entity = self._last_trigger_entity.get(input_id) if input_id else None
        if not trigger_entity and input_config.entity_ids:
            trigger_entity = input_config.entity_ids[0]

        self.engine.coordinator.activity_requested(
            activity,
            input_id=input_id,
            input_type="motion",
            entity_id=trigger_entity,
        )

    def _on_lux_expiry(self, input_config: MotionInputConfig) -> None:
        input_id = input_config.id
        if input_id in self.lux_watches:
            del self.lux_watches[input_id]

    def _read_lux(self) -> float | None:
        """Read the aggregated lux value."""
        return self.engine.coordinator.lux_manager.get_current_lux()


class ButtonInputHandler(BaseInputHandler):
    """Handles manually triggered button inputs (no HA entity required)."""

    async def async_setup(self) -> None:
        pass

    def _resolve_button_activity(self, input_id: str, kind: str) -> str | None:
        """Shared guard for trigger/toggle: return the activity, or None to skip.

        Returns None (and logs) when the input is disabled or has no activity
        configured. `kind` ("trigger"/"toggle") only labels the debug log.
        """
        if self._is_disabled(input_id):
            _LOGGER.debug(
                "[%s] Button %s %s ignored because input is disabled",
                self.engine.area_id,
                kind,
                input_id,
            )
            return None

        inp = self.engine.config.input_by_id(input_id)
        activity = inp.activity if inp else None
        if not activity:
            _LOGGER.warning(
                "[%s] Button %s has no activity configured",
                self.engine.area_id,
                input_id,
            )
            return None
        return activity

    def trigger(self, input_id: str) -> None:
        """Fire a click-mode button — activity_requested, no state change."""
        activity = self._resolve_button_activity(input_id, "trigger")
        if not activity:
            return

        self.engine.coordinator.activity_requested(
            name=activity,
            input_id=input_id,
            input_type="button",
        )

    def toggle(self, input_id: str, active: bool) -> None:
        """Set toggle-mode button state — activity_requested or activity_released."""
        activity = self._resolve_button_activity(input_id, "toggle")
        if not activity:
            return

        self.engine.coordinator.update_input_active(input_id, active)

        if active:
            self.engine.coordinator.activity_requested(
                name=activity,
                input_id=input_id,
                input_type="button",
            )
        else:
            self.engine.coordinator.activity_released(activity)
