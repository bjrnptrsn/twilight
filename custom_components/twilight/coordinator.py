"""Coordinator for Twilight control logic."""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Callable, Coroutine
from datetime import UTC, datetime, timedelta
from typing import TYPE_CHECKING, Any, Literal

from homeassistant.core import callback
from homeassistant.helpers.event import async_call_later
from homeassistant.util import dt as dt_util

from .action_handler import (
    BaseActionHandler,
    BlockActionHandler,
    EntityActionHandler,
    LightActionHandler,
    PresenceSimulationActionHandler,
    SlotActionHandler,
    TurnOffActionHandler,
)
from .call_handler import (
    BaseCallHandler,
    SlotChangeCallHandler,
    SlotDirectCallHandler,
    SlotTransitionCallHandler,
    TurnOffCallHandler,
)
from .config_model import (
    ActionConfig,
    ActivityConfig,
    ButtonInputConfig,
    ResetActionConfig,
)
from .const import (
    DEFAULT_AUTO_EXPIRE,
    DEFAULT_TRANSITION_OFF_SECONDS,
    ActionType,
    InputType,
    RuleAutoExpireMode,
)
from .helpers import (
    channel_entities,
    create_tracked_task,
    dispatch_entity_target,
    get_slot_info,
    get_store,
    is_slot_excluded_effective,
    parse_hms,
)
from .input_state_manager import InputStateManager
from .lux_manager import LuxManager
from .rule_manager import RuleManager
from .state import ActivityTrigger, RunState

if TYPE_CHECKING:
    from .engine import TwilightEngine

_LOGGER = logging.getLogger(__name__)


class Coordinator:
    """Orchestrates control logic and actions for a Twilight area engine."""

    def __init__(self, engine: TwilightEngine) -> None:
        """Initialize the coordinator."""
        self.engine = engine
        self._tasks: set[asyncio.Task[Any]] = set()

        # Channel call handlers (only for enabled channels — a disabled channel
        # only gets an entry if it's later re-enabled and swap_channel_handler()
        # below writes self._handlers[channel_id] = handler; all reads elsewhere
        # in this class go through .get(), so a missing key is safe)
        self._handlers: dict[str, BaseCallHandler | None] = {
            channel_id: TurnOffCallHandler(self.engine, channel_id)
            for channel_id, channel in self.engine.config.channels.items()
            if channel.enabled
        }
        # Per-channel grace_elapsed rescued from a handler cancelled by
        # cancel_all_handlers() before swap_channel_handler() runs and can no
        # longer see it via self._handlers (already cleared). Consumed and
        # cleared by swap_channel_handler() on the next call for that channel.
        self._pending_grace: dict[str, float] = {}

        # Sub-managers for specialized business logics
        self.lux_manager = LuxManager(self)
        self.input_manager = InputStateManager(self)
        self.rule_manager = RuleManager(self)

        # Statically instantiated Action Handlers
        self._action_handlers: dict[str, BaseActionHandler] = {
            ActionType.SLOT: SlotActionHandler(self),
            ActionType.ENTITY: EntityActionHandler(self),
            ActionType.LIGHT: LightActionHandler(self),
            ActionType.BLOCK: BlockActionHandler(self),
            ActionType.TURN_OFF: TurnOffActionHandler(self),
            ActionType.SIMULATION: PresenceSimulationActionHandler(self),
        }
        self._active_handler: BaseActionHandler | None = None

        # Timer for activity auto expiration
        self._auto_expire_unsub: Callable[[], None] | None = None
        self.unsub_state: Callable[[], None] | None = (
            self.engine.state_manager.add_listener(self._on_state_changed)
        )

    @property
    def channel_ids(self) -> list[str]:
        """All configured channel ids for this area."""
        return list(self.engine.config.channels)

    def cancel_all_handlers(self) -> None:
        """Cancel all channel handlers and clear dictionary.

        Rescues each cancelled handler's grace_elapsed into _pending_grace
        first — a handler still settling (is_busy) loses its entry in
        self._handlers here, so swap_channel_handler() could otherwise never
        see it and grace_elapsed would silently stay 0 for the channel's next
        handler.
        """
        for channel_id, handler in self._handlers.items():
            if handler and handler.is_busy:
                elapsed = handler.elapsed_since_last_call
                if elapsed is not None:
                    self._pending_grace[channel_id] = max(0.0, elapsed)
            if handler:
                handler.cancel()
        self._handlers.clear()

    async def async_teardown(self) -> None:
        """Tear down the coordinator and clean up all channel handlers."""
        self._cancel_auto_expire_timer()
        if self._active_handler:
            self._active_handler.cancel()
            self._active_handler = None
        if self.unsub_state is not None:
            self.unsub_state()
            self.unsub_state = None

        # Cancel all tracked background tasks
        pending = [task for task in self._tasks if not task.done()]
        for task in pending:
            task.cancel()
        if pending:
            await asyncio.gather(*pending, return_exceptions=True)
        self._tasks.clear()

        # Teardown all channel handlers
        self.cancel_all_handlers()

    def _create_task(self, coro: Coroutine[Any, Any, Any]) -> asyncio.Task[Any] | None:
        """Create a tracked task to prevent fire-and-forget memory leak or unhandled exceptions."""
        return create_tracked_task(self.engine.hass, coro, self._tasks)

    def _on_state_changed(self, old_state: RunState, new_state: RunState) -> None:
        """Handle state changes and persist to store if relevant.

        activity_expire_frozen_seconds is part of the trigger condition and the
        payload: while a rule freezes the timer it is the *only* record of the
        pending duration (activity_expires_at is deliberately None then, see
        activity_requested()). Without it a restart restored the activity with
        neither a timer nor a freeze, so it never expired on its own.
        """
        if (
            old_state.activity_expires_at != new_state.activity_expires_at
            or old_state.active_activity != new_state.active_activity
            or old_state.activity_expire_frozen_seconds != new_state.activity_expire_frozen_seconds
            or old_state.activity_expire_source != new_state.activity_expire_source
        ):
            store = get_store(self.engine.hass)
            if not store:
                _LOGGER.warning(
                    "[%s] Store not found, cannot persist state",
                    self.engine.area_id,
                )
                return

            state_dict = {
                "activity_expires_at": new_state.activity_expires_at.isoformat()
                if new_state.activity_expires_at
                else None,
                "active_activity": new_state.active_activity,
                "activity_expire_frozen_seconds": (
                    new_state.activity_expire_frozen_seconds
                ),
                "activity_expire_source": new_state.activity_expire_source,
                "last_seen": datetime.now(UTC).timestamp(),
            }
            store.save_area_state(self.engine.area_id, state_dict)

    @property
    def run_state(self) -> RunState:
        """Helper to get current run state."""
        return self.engine.state_manager.state

    def update_state(self, **kwargs: Any) -> RunState:
        """Helper to update run state.

        Folding the activity and rule-based disabler recalculation into the same
        update() call (instead of a separate follow-up update_state() call)
        keeps this a single state write / single listener notification —
        callers that also pass inputs_disabled_by explicitly are left as-is.
        """
        if "active_activity" in kwargs and "inputs_disabled_by" not in kwargs:
            kwargs = dict(kwargs)
            kwargs["inputs_disabled_by"] = self.input_manager.compute_disablers(
                kwargs["active_activity"],
                kwargs.get("active_rules", self.run_state.active_rules),
            )
        elif "active_rules" in kwargs and "inputs_disabled_by" not in kwargs:
            kwargs = dict(kwargs)
            kwargs["inputs_disabled_by"] = self.input_manager.compute_disablers(
                kwargs.get("active_activity", self.run_state.active_activity),
                kwargs["active_rules"],
            )
        return self.engine.state_manager.update(**kwargs)

    def initialize_inputs(self) -> None:
        """Delegated helper to initialize inputs disablers and active states."""
        self.input_manager.initialize_inputs()

    def update_input_active(self, input_id: str | None, active: bool) -> None:
        """Delegated helper to update the physical active state of an input."""
        self.input_manager.update_input_active(input_id, active)

    def reapply_active_activity_rules(self) -> None:
        """Re-apply rules for the currently active activity if running."""
        active_act_id = self.run_state.active_activity
        if not active_act_id or not self._active_handler:
            return

        act = self.engine.config.activity_by_id(active_act_id)
        if not act:
            return

        action = self._coerce_action(act.action)
        if action.type == ActionType.SLOT:
            _LOGGER.debug(
                "[%s] Re-applying active activity rules for slot activity: %s",
                self.engine.area_id,
                active_act_id,
            )
            transition_off = self.get_activity_transition_off_seconds(active_act_id)
            self._create_task(
                self._active_handler.start(
                    action, self.run_state.active_slots, transition_off=transition_off
                )
            )

    def _slot_active_entities(self, channel_id: str) -> list[str]:
        """Entities to turn off for the active slot of a single channel."""
        slot_id = self.run_state.active_slots.get(channel_id)
        scene_info = get_slot_info(self.engine.scene_map, channel_id, slot_id)
        if not scene_info:
            return []
        if self.engine.config.manual_only:
            return list(scene_info.configured_entities)
        return list(
            set(scene_info.extracted_entities) | set(scene_info.configured_entities)
        )

    def activity_requested(
        self,
        name: str,
        input_id: str | None = None,
        input_type: str | None = None,
        entity_id: str | None = None,
    ) -> None:
        """Request/activate an activity in the area."""
        _LOGGER.debug(
            "[%s] Activity requested: %s (input_id=%s)",
            self.engine.area_id,
            name,
            input_id,
        )

        if input_id:
            disablers = self.run_state.inputs_disabled_by.get(input_id, [])
            if disablers:
                _LOGGER.debug(
                    "[%s] Input %s is disabled by %s. Ignoring request for activity %s",
                    self.engine.area_id,
                    input_id,
                    disablers,
                    name,
                )
                return

        self._cancel_auto_expire_timer()

        action = self.resolve_action(name)

        if action.type == ActionType.RESET:
            _LOGGER.info(
                "[%s] Reset triggered by activity '%s'", self.engine.area_id, name
            )
            if self._active_handler:
                self._active_handler.cancel()
                self._active_handler = None
            self.cancel_all_handlers()
            self.update_state(
                active_activity=None,
                activity_trigger=None,
                activity_expires_at=None,
                activity_expire_frozen_seconds=None,
                activity_expire_source=None,
                scene_activated_at=None,
            )
            self.lux_manager.update_lux_state()
            self.turn_off_all_channels()
            if isinstance(action, ResetActionConfig) and action.entity_targets:
                for target in action.entity_targets:
                    create_tracked_task(
                        self.engine.hass,
                        dispatch_entity_target(
                            self.engine.hass,
                            self.engine.area_id,
                            target.entity_id,
                            target.action,
                        ),
                        self._tasks,
                    )
            return

        expire_secs = self._get_effective_expire_seconds(name)
        native_secs = self.get_activity_auto_expire_seconds(name)
        source: Literal["activity", "rule"] | None = (
            "activity"
            if native_secs is not None
            else ("rule" if expire_secs is not None else None)
        )
        effective_mode = self._get_effective_rule_auto_expire_mode(name)
        is_frozen = (
            effective_mode != RuleAutoExpireMode.NONE
            or self.run_state.activity_expire_frozen_seconds is not None
        )

        if is_frozen:
            was_already_frozen = self.run_state.activity_expire_frozen_seconds is not None
            if was_already_frozen:
                # Re-trigger while a rule is already freezing the timer: always
                # reset to the full duration regardless of mode (plan §1) — a
                # fresh trigger must not leave the activity fated to expire
                # instantly just because the active rule happens to be SUSPEND.
                frozen_secs: float | None = (
                    float(expire_secs) if expire_secs is not None else None
                )
            else:
                frozen_secs = (
                    0.0
                    if effective_mode == RuleAutoExpireMode.SUSPEND
                    else (float(expire_secs) if expire_secs is not None else None)
                )
            # While frozen, activity_expire_frozen_seconds is the source of
            # truth (frontend + async_setup restore both key off it) —
            # activity_expires_at must not carry a live-ticking value here.
            expires_at = None
        else:
            frozen_secs = None
            expires_at = (
                dt_util.utcnow() + timedelta(seconds=expire_secs)
                if expire_secs is not None
                else None
            )

        # Guard (Fix 1): If the same activity is re-requested while any channel
        # handler is still busy/retrying or settling, refresh the expire timer
        # and skip _apply_action() to avoid tearing down active call handlers.
        is_same_activity = self.run_state.active_activity == name
        has_busy_handler = any(
            h.is_busy for h in self._handlers.values() if h is not None
        )

        if is_same_activity and has_busy_handler:
            _LOGGER.debug(
                "[%s] Activity '%s' re-requested while call handler is busy; refreshing timer without re-applying action",
                self.engine.area_id,
                name,
            )
            self.update_state(
                activity_trigger=ActivityTrigger(
                    input_id=input_id,
                    input_type=input_type,
                    entity_id=entity_id,
                    triggered_at=dt_util.utcnow(),
                ),
                activity_expires_at=expires_at,
                activity_expire_frozen_seconds=frozen_secs,
                activity_expire_source=source if not is_frozen else None,
            )
            self.lux_manager.update_lux_state()
            if is_frozen:
                self._cancel_auto_expire_timer()
            elif expire_secs is not None:
                self._start_auto_expire_timer(name, expire_secs)
            return

        self.update_state(
            active_activity=name,
            activity_trigger=ActivityTrigger(
                input_id=input_id,
                input_type=input_type,
                entity_id=entity_id,
                triggered_at=dt_util.utcnow(),
            ),
            activity_expires_at=expires_at,
            activity_expire_frozen_seconds=frozen_secs,
            activity_expire_source=source if not is_frozen else None,
        )

        self._apply_action(action, name)

        if is_frozen:
            self._cancel_auto_expire_timer()
        elif expire_secs is not None:
            self._start_auto_expire_timer(name, expire_secs)
        else:
            self.update_state(activity_expires_at=None, activity_expire_source=None)

    def activity_released(self, name: str) -> None:
        """Release/deactivate an activity in the area.

        Called on a real end signal — a binary sensor's off-edge ("door
        closed"), a toggle button going off, or the auto-expire timer firing.
        Motion inputs deliberately never call this: a PIR going quiet only
        means "stopped triggering" (see MotionInputHandler._on_state_changed).

        Only releases if no other input still holds the activity open — e.g. a
        binary sensor's off-edge must not end an activity that a motion input
        is still actively holding.
        """
        _LOGGER.debug("[%s] Activity released: %s", self.engine.area_id, name)
        if self.run_state.active_activity != name:
            return

        if self._check_still_active(name):
            _LOGGER.debug(
                "[%s] Activity '%s' release skipped — another input still active",
                self.engine.area_id,
                name,
            )
            return

        self._cancel_auto_expire_timer()
        self.update_state(
            activity_expire_frozen_seconds=None,
            activity_expires_at=None,
            activity_expire_source=None,
        )
        self._apply_release_action(self.resolve_release_action(name), name)

    # ── Activity resolution API ──
    # Public on purpose: the Action Handlers (action_handler.py, notably
    # PresenceSimulationActionHandler) resolve an activity's action, release
    # action and timings through these. They were underscore-private while
    # being called from another module, which hid that coupling — renaming
    # them makes the actual interface visible. A future coordinator split
    # (docs/architecture/coordinator_split_plan.md) should keep them together.

    def get_activity_auto_expire_seconds(self, name: str) -> int | None:
        """Get the auto expire duration in seconds, or None if disabled.

        None means "no timer at all" (auto_expire_enabled is False) — the
        activity then ends only when a triggering input goes off, or never on
        its own if it was started by an input without an off state.

        0 is a real duration: the activity expires immediately, subject to the
        usual `_check_still_active()` prolongation.
        """
        cfg = self.get_activity_config(name)
        if cfg and not cfg.auto_expire_enabled:
            return None
        auto_expire = cfg.auto_expire if cfg else None
        if auto_expire is None:
            auto_expire = DEFAULT_AUTO_EXPIRE
        parsed = parse_hms(auto_expire)
        if parsed is None:
            # A malformed value (e.g. "abc", "99:99") used to collapse to 0 via
            # `or 0`, which is a *valid* duration meaning "expire immediately" —
            # so a typo silently turned the light off right after every trigger.
            # Fall back to the default instead, and say so.
            _LOGGER.warning(
                "[%s] Activity '%s' has an invalid auto_expire value %r — "
                "falling back to the default (%s)",
                self.engine.area_id,
                name,
                auto_expire,
                DEFAULT_AUTO_EXPIRE,
            )
            return parse_hms(DEFAULT_AUTO_EXPIRE) or 0
        return parsed

    def get_activity_transition_off_seconds(self, name: str | None) -> int:
        """Get the transition off duration in seconds for an activity."""
        if not name:
            return DEFAULT_TRANSITION_OFF_SECONDS
        cfg = self.get_activity_config(name)
        if cfg and cfg.action and cfg.action.type in (ActionType.BLOCK, ActionType.RESET):
            return 0
        val = cfg.transition_off_seconds if cfg else None
        if val is None:
            return DEFAULT_TRANSITION_OFF_SECONDS
        return val

    def _check_still_active(self, activity_name: str) -> bool:
        """Check if any input holding this activity is still active.

        Covers the three input kinds that carry a lasting "still on" state:
        motion, binary, and toggle-mode buttons. Click-mode buttons are
        deliberately excluded — they fire and forget, they never hold an
        activity open.
        """
        if self.engine.motion_handler.has_active_motion_for_activity(
            activity_name
        ):
            return True

        for inp in self.engine.config.inputs_of_type(InputType.BINARY):
            if inp.activity != activity_name or not inp.id:
                continue
            if self._is_input_disabled(inp.id):
                continue
            if self.run_state.inputs_active.get(inp.id):
                return True

        # A toggle button that is still switched on holds the activity exactly
        # like an open door does — without this the HA switch stays visibly on
        # while its activity has already expired underneath it.
        for inp in self.engine.config.inputs_of_type(InputType.BUTTON):
            if inp.activity != activity_name or not inp.id:
                continue
            if not isinstance(inp, ButtonInputConfig):
                continue
            if (inp.button_mode or "click") != "toggle":
                continue
            if self._is_input_disabled(inp.id):
                continue
            if self.run_state.inputs_active.get(inp.id):
                return True
        return False

    def _is_input_disabled(self, input_id: str | None) -> bool:
        """Check whether an input is currently disabled/suppressed."""
        if not input_id:
            return False
        return bool(self.run_state.inputs_disabled_by.get(input_id))

    def _get_effective_rule_auto_expire_mode(
        self, activity_name: str
    ) -> RuleAutoExpireMode:
        """Calculate effective rule auto_expire mode for an activity among active rules."""
        effective = RuleAutoExpireMode.NONE
        for rule in self.engine.config.rules:
            if not rule.enabled or not rule.id:
                continue
            if activity_name not in rule.applied_activities:
                continue
            if not self.run_state.active_rules.get(rule.id, False):
                continue
            mode = rule.auto_expire_mode
            if mode == RuleAutoExpireMode.NONE:
                continue
            if mode == RuleAutoExpireMode.RESTART:
                return RuleAutoExpireMode.RESTART
            elif mode == RuleAutoExpireMode.PAUSE:
                effective = RuleAutoExpireMode.PAUSE
            elif (
                mode == RuleAutoExpireMode.SUSPEND
                and effective == RuleAutoExpireMode.NONE
            ):
                effective = RuleAutoExpireMode.SUSPEND
        return effective

    def _get_effective_expire_seconds(self, name: str) -> int | None:
        """Get effective auto_expire duration for an activity (seconds), resolving native vs borrowed timer.

        Priority:
        1. Native activity auto_expire_seconds (if auto_expire_enabled is True)
        2. Longest borrowed duration among active matching rules with auto_expire_enabled=True
        3. None
        """
        native_secs = self.get_activity_auto_expire_seconds(name)
        if native_secs is not None:
            return native_secs

        act = self.engine.config.activity_by_id(name)
        if not act or (act.action and act.action.type == ActionType.RESET):
            return None

        borrowed_durations: list[int] = []
        for rule in self.engine.config.rules:
            if not rule.enabled or not self.run_state.active_rules.get(rule.id, False):
                continue
            if name not in rule.applied_activities:
                continue
            if rule.auto_expire_enabled is True:
                dur = parse_hms(rule.auto_expire) if rule.auto_expire else parse_hms(DEFAULT_AUTO_EXPIRE)
                if dur is None:
                    # Mirrors get_activity_auto_expire_seconds(): a malformed value
                    # must not silently drop the loan — fall back to the default
                    # and say so, instead of leaving the activity un-timed.
                    _LOGGER.warning(
                        "[%s] Rule '%s' has an invalid auto_expire value %r — "
                        "falling back to the default (%s)",
                        self.engine.area_id,
                        rule.id,
                        rule.auto_expire,
                        DEFAULT_AUTO_EXPIRE,
                    )
                    dur = parse_hms(DEFAULT_AUTO_EXPIRE)
                if dur is not None:
                    borrowed_durations.append(dur)

        if borrowed_durations:
            return max(borrowed_durations)

        return None

    def update_rule_auto_expire_timer(self) -> None:
        """Update auto_expire timer state based on active rules for current activity."""
        active_act = self.run_state.active_activity
        if not active_act:
            if self.run_state.activity_expire_frozen_seconds is not None:
                self.update_state(activity_expire_frozen_seconds=None)
            return

        mode = self._get_effective_rule_auto_expire_mode(active_act)

        if mode == RuleAutoExpireMode.NONE:
            if self.run_state.activity_expire_frozen_seconds is not None:
                frozen_seconds = self.run_state.activity_expire_frozen_seconds
                self.update_state(activity_expire_frozen_seconds=None)
                if frozen_seconds > 0:
                    expires_at = dt_util.utcnow() + timedelta(seconds=frozen_seconds)
                    native_secs = self.get_activity_auto_expire_seconds(active_act)
                    source: Literal["activity", "rule"] = (
                        "activity" if native_secs is not None else "rule"
                    )
                    self.update_state(
                        activity_expires_at=expires_at, activity_expire_source=source
                    )
                    self._start_auto_expire_timer(active_act, round(frozen_seconds))
                else:
                    self.update_state(
                        activity_expires_at=None, activity_expire_source=None
                    )
                    self._on_auto_expire(active_act)
                return

            # Check for borrowed timer from active rule when activity has auto_expire_enabled=False.
            # Only (re-)arm if no borrowed timer is already running — otherwise every
            # unrelated rule state change (e.g. a sibling rule's excluded_slots toggling)
            # would reset an already-running loan back to its full duration.
            if (
                self.get_activity_auto_expire_seconds(active_act) is None
                and self.run_state.activity_expire_source != "rule"
            ):
                borrowed_secs = self._get_effective_expire_seconds(active_act)
                if borrowed_secs is not None:
                    expires_at = dt_util.utcnow() + timedelta(seconds=borrowed_secs)
                    self.update_state(
                        activity_expires_at=expires_at,
                        activity_expire_source="rule",
                    )
                    self._start_auto_expire_timer(active_act, borrowed_secs)
            return

        expire_secs = self.get_activity_auto_expire_seconds(active_act)
        if expire_secs is None:
            # auto_expire is switched off for this activity — there is no timer
            # to pause, suspend or restart.
            return

        if self.run_state.activity_expire_frozen_seconds is None:
            if mode == RuleAutoExpireMode.RESTART:
                frozen_seconds = float(expire_secs)
            elif mode == RuleAutoExpireMode.PAUSE:
                if self.run_state.activity_expires_at:
                    rem = (
                        self.run_state.activity_expires_at - dt_util.utcnow()
                    ).total_seconds()
                    frozen_seconds = max(0.0, rem)
                else:
                    frozen_seconds = float(expire_secs)
            else:  # SUSPEND
                frozen_seconds = 0.0

            self._cancel_auto_expire_timer()
            self.update_state(activity_expire_frozen_seconds=frozen_seconds)
        else:
            if mode == RuleAutoExpireMode.RESTART:
                self.update_state(activity_expire_frozen_seconds=float(expire_secs))
            elif mode == RuleAutoExpireMode.SUSPEND:
                self.update_state(activity_expire_frozen_seconds=0.0)

    def _start_auto_expire_timer(self, name: str, seconds: int) -> None:
        """Start auto expire timer for the active activity."""
        self._cancel_auto_expire_timer()

        @callback
        def _on_expire(_now: datetime) -> None:
            self._on_auto_expire(name)

        self._auto_expire_unsub = async_call_later(
            self.engine.hass, seconds, _on_expire
        )

    def _cancel_auto_expire_timer(self) -> None:
        """Cancel auto expire timer."""
        if self._auto_expire_unsub:
            self._auto_expire_unsub()
            self._auto_expire_unsub = None

    @callback
    def _on_auto_expire(self, name: str) -> None:
        """Triggered when activity timer expires."""
        self._auto_expire_unsub = None
        if self.run_state.active_activity != name:
            return

        if self._check_still_active(name):
            _LOGGER.info(
                "[%s] Activity '%s' auto-expire postponed — input still active",
                self.engine.area_id,
                name,
            )
            expire_secs = self._get_effective_expire_seconds(name)

            if expire_secs:
                native_secs = self.get_activity_auto_expire_seconds(name)
                source: Literal["activity", "rule"] = (
                    "activity" if native_secs is not None else "rule"
                )
                expires_at = dt_util.utcnow() + timedelta(seconds=expire_secs)
                self.update_state(
                    activity_expires_at=expires_at,
                    activity_expire_source=source,
                )
                self._start_auto_expire_timer(name, expire_secs)
            else:
                self.update_state(activity_expires_at=None, activity_expire_source=None)
            return

        _LOGGER.info(
            "[%s] Activity '%s' expired automatically",
            self.engine.area_id,
            name,
        )
        self.activity_released(name)

    def _make_scene_handler(
        self, channel_id: str, slot_id: str, target_slot_start: datetime
    ) -> BaseCallHandler:
        """Select SlotTransitionCallHandler or SlotDirectCallHandler based on extracted_entities."""
        scene_info = get_slot_info(self.engine.scene_map, channel_id, slot_id)
        if scene_info and scene_info.extracted_entities:
            return SlotTransitionCallHandler(
                self.engine, channel_id, slot_id, target_slot_start
            )
        return SlotDirectCallHandler(self.engine, channel_id, slot_id)

    def slots_changed(
        self, active_slots: dict[str, str], is_boot: bool = False
    ) -> None:
        """Signal that the active time slots (per channel) have changed."""
        now = datetime.now(UTC)
        old_slots = self.run_state.active_slots
        changed = {
            ch: sid for ch, sid in active_slots.items() if old_slots.get(ch) != sid
        }

        if changed:
            _LOGGER.info("[%s] Active slots changed: %s", self.engine.area_id, changed)
            # Only advance active_slot_start on a real slot change. Setting it to
            # now() on every call made the RunState differ each time, firing state
            # listeners (WS push + disk write) needlessly and skewing the
            # "slot started X min ago" display.
            self.update_state(active_slots=dict(active_slots), active_slot_start=now)
        else:
            self.update_state(active_slots=dict(active_slots))
        self.lux_manager.update_lux_state()

        # Boot deliberately switches NO light: on startup we only restore which
        # slot each channel is in (active_slots above), never activate a scene —
        # Twilight lights up on real activity, not merely because it booted into
        # a slot. Same when no scene is active (scene_activated_at is None).
        if is_boot or self.run_state.scene_activated_at is None:
            return

        if self._active_handler and self._active_handler.pauses_slots:
            return

        for channel_id, slot_id in changed.items():
            if is_slot_excluded_effective(
                self.engine.config,
                self.run_state,
                self.rule_manager,
                channel_id,
                slot_id,
            ):
                self.turn_off_channel(channel_id)
                continue

            # Stage-2 invariant: if the matching SlotTransitionCallHandler is already
            # running, let the fade continue undisturbed.
            existing_handler = self._handlers.get(channel_id)
            if (
                isinstance(existing_handler, SlotTransitionCallHandler)
                and existing_handler.target_slot_id == slot_id
            ):
                _LOGGER.debug(
                    "[%s] Target slot handler for channel %s and slot %s already active; continuing fade",
                    self.engine.area_id,
                    channel_id,
                    slot_id,
                )
                continue

            self.apply_channel_slot(channel_id, slot_id)

    async def async_start_slot_fade(
        self, channel_id: str, target_slot_id: str, target_slot_start: datetime
    ) -> bool:
        """Start slot fade if slots are not paused for this channel and scene is active."""
        if self._active_handler and self._active_handler.pauses_slots:
            _LOGGER.debug(
                "[%s] Skipping slot fade for channel %s: slots are paused by active activity %s",
                self.engine.area_id,
                channel_id,
                self.run_state.active_activity,
            )
            return False

        if self.run_state.scene_activated_at is None:
            return False

        if is_slot_excluded_effective(
            self.engine.config,
            self.run_state,
            self.rule_manager,
            channel_id,
            target_slot_id,
        ):
            return False

        scene_info = get_slot_info(self.engine.scene_map, channel_id, target_slot_id)
        if not scene_info or not scene_info.extracted_entities:
            # No anticipatory fade possible (null scene, script, HUE_SMART_SCENE) —
            # Stage 2 handles the transition (TurnOffCallHandler / SlotDirectCallHandler).
            return False

        handler = SlotTransitionCallHandler(
            self.engine,
            channel_id=channel_id,
            target_slot_id=target_slot_id,
            target_slot_start=target_slot_start,
        )
        # SlotTransitionCallHandler._filter_entities() ignores the entities argument and
        # filters scene_info.extracted_entities directly — no list needed here.
        self.swap_channel_handler(channel_id, handler, [])
        return True

    def _channel_slot_scene(self, channel_id: str, slot_id: str) -> str | None:
        """The configured scene_entity_id of a (channel, slot), from config."""
        slot = self.engine.config.slot(channel_id, slot_id)
        return slot.scene_entity_id if slot else None

    def swap_channel_handler(
        self,
        channel_id: str,
        handler: BaseCallHandler,
        entities: list[str],
        params: dict[str, Any] | ActionConfig | None = None,
    ) -> None:
        """Cancel current channel handler, replace with new handler, and execute."""
        existing = self._handlers.get(channel_id)
        grace_elapsed = self._pending_grace.pop(channel_id, 0.0)
        if existing:
            if existing.is_busy:
                elapsed = existing.elapsed_since_last_call
                if elapsed is not None:
                    grace_elapsed = max(grace_elapsed, elapsed)
            existing.cancel()
        self._handlers[channel_id] = handler
        self._create_task(
            handler.execute(entities, params or {}, grace_elapsed=grace_elapsed)
        )

    def reapply_deviating_slot(self, channel_id: str, slot_id: str) -> None:
        """Re-apply only the deviating entities of a slot scene, or fallback to full apply."""
        # Guard: If a SlotTransitionCallHandler is already running for this target slot,
        # do not interrupt the fade.
        existing = self._handlers.get(channel_id)
        if (
            isinstance(existing, SlotTransitionCallHandler)
            and existing.target_slot_id == slot_id
        ):
            _LOGGER.debug(
                "[%s] Target slot transition handler for channel %s and slot %s already active; skipping reapply to keep fade",
                self.engine.area_id,
                channel_id,
                slot_id,
            )
            return

        if not self._channel_slot_scene(channel_id, slot_id):
            self.apply_channel_slot(channel_id, slot_id, direct=True)
            return

        scene_info = get_slot_info(self.engine.scene_map, channel_id, slot_id)
        if scene_info and scene_info.extracted_entities and scene_info.expected_states:
            handler = SlotChangeCallHandler(
                self.engine,
                channel_id=channel_id,
                target_slot_id=slot_id,
            )
            self.swap_channel_handler(
                channel_id, handler, list(scene_info.extracted_entities)
            )
        else:
            self.apply_channel_slot(channel_id, slot_id, direct=True)

    def turn_off_channel(
        self, channel_id: str, transition_off: int | None = None
    ) -> None:
        """Turn off a single channel's active-slot entities via TurnOffCallHandler."""
        entities = list(
            channel_entities(
                self.engine.scene_map,
                channel_id,
                self.engine.config.manual_only,
            )
        )
        if entities:
            handler = TurnOffCallHandler(
                self.engine, channel_id, transition_off=transition_off
            )
            self.swap_channel_handler(channel_id, handler, entities)

    def apply_channel_slot(
        self, channel_id: str, slot_id: str, direct: bool = False
    ) -> None:
        """Apply a single channel into its slot: scene if set, else turn the channel off."""
        if self._channel_slot_scene(channel_id, slot_id):
            entities = self._slot_active_entities(channel_id)
            handler: BaseCallHandler = (
                SlotDirectCallHandler(self.engine, channel_id, slot_id)
                if direct
                # Stage 2 fallback (no anticipatory fade ran) — apply immediately.
                else self._make_scene_handler(channel_id, slot_id, datetime.now(UTC))
            )
            self.swap_channel_handler(channel_id, handler, entities)
        else:
            self.turn_off_channel(channel_id)

    def apply_all_channels_slots(self, direct: bool = False) -> None:
        """Re-apply every channel into its current active slot (scene or off)."""
        for channel_id in self.channel_ids:
            slot_id = self.run_state.active_slots.get(channel_id)
            if slot_id:
                self.apply_channel_slot(channel_id, slot_id, direct=direct)

    def turn_off_all_channels(self, transition_off: int | None = None) -> None:
        """Turn off every channel's active-slot entities via TurnOffCallHandler."""
        for channel_id in self.channel_ids:
            self.turn_off_channel(channel_id, transition_off=transition_off)

    @staticmethod
    def _coerce_action(
        action: dict[str, Any] | ActionConfig | None,
    ) -> ActionConfig:
        """Normalize a missing or dict action into a typed ActionConfig. No implicit type default."""
        if isinstance(action, ActionConfig):
            return action
        if isinstance(action, dict):
            return ActionConfig.from_dict(action)
        return ActionConfig.from_dict({"type": None})

    def _apply_action(
        self, action: dict[str, Any] | ActionConfig | None, name: str | None = None
    ) -> None:
        """Apply the configured start action for the activity via ActionHandlers."""
        action = self._coerce_action(action)

        if self._active_handler:
            self._active_handler.cancel()

        self.cancel_all_handlers()

        t = action.type
        if t is None or t not in self._action_handlers:
            _LOGGER.debug(
                "[%s] No/unrecognized action type '%s' — activity does nothing.",
                self.engine.area_id,
                t,
            )
            self._active_handler = None
            return
        self._active_handler = self._action_handlers[t]
        transition_off = self.get_activity_transition_off_seconds(name)
        self._create_task(
            self._active_handler.start(
                action, self.run_state.active_slots, transition_off=transition_off
            )
        )

    def _apply_release_action(
        self, release: dict[str, Any] | ActionConfig | None, name: str | None = None
    ) -> None:
        """Apply the configured release action for the activity via ActionHandlers."""
        release = self._coerce_action(release)

        handler = self._active_handler
        self._active_handler = None

        transition_off = self.get_activity_transition_off_seconds(name)

        self.update_state(
            active_activity=None,
            activity_trigger=None,
            activity_expires_at=None,
            activity_expire_frozen_seconds=None,
            activity_expire_source=None,
        )

        if handler is not None:
            self._create_task(handler.stop(release, transition_off=transition_off))

    def get_activity_config(self, name: str) -> ActivityConfig | None:
        """Get the typed config for an activity, or None if not configured."""
        cfg = self.engine.config.activity_by_id(name)
        if cfg is None:
            _LOGGER.warning(
                "[%s] No activity config found for '%s' — falling back to defaults",
                self.engine.area_id,
                name,
            )
        return cfg

    def resolve_action(self, name: str) -> ActionConfig:
        """Resolve the start action for an activity. No implicit type default."""
        cfg = self.get_activity_config(name)
        return self._coerce_action(cfg.action if cfg else None)

    def resolve_release_action(self, name: str) -> ActionConfig:
        """Resolve the release action for an activity. No implicit type default."""
        cfg = self.get_activity_config(name)
        return self._coerce_action(cfg.release_action if cfg else None)

    def _restore_active_handler(self, name: str) -> None:
        """Restore _active_handler after a restart based on the activity's resolved action.

        For most handler types, restoring just the reference is enough — their
        start() only (re-)applies a light state that the next real event
        reapplies anyway. PresenceSimulationActionHandler is the one exception:
        it owns a self-scheduling tick loop (async_call_later) that only exists
        while start() is running. cancel() (called by async_teardown() right
        before this) tears that loop down without clearing active_activity — by
        design, so a reboot can resume it — but with only the reference
        restored, no timer would ever fire again until a real input re-triggers
        the activity. So the simulation alone gets started for real here.
        """
        action = self.resolve_action(name)
        t = action.type
        if t is None or t not in self._action_handlers:
            _LOGGER.debug(
                "[%s] No/unrecognized action type '%s' during restore of activity '%s' — no handler.",
                self.engine.area_id,
                t,
                name,
            )
            self._active_handler = None
            return
        self._active_handler = self._action_handlers[t]
        if t == ActionType.SIMULATION:
            transition_off = self.get_activity_transition_off_seconds(name)
            self._create_task(
                self._active_handler.start(
                    action, self.run_state.active_slots, transition_off=transition_off
                )
            )

    async def async_setup(self) -> None:
        """Set up the coordinator and restore timers."""
        self.lux_manager.update_lux_state()

        motion_active = bool(self.engine.motion_handler.active_entities)

        frozen_secs = self.run_state.activity_expire_frozen_seconds
        expires_at = self.run_state.activity_expires_at
        if frozen_secs is not None and self.run_state.active_activity:
            _LOGGER.info(
                "[%s] Restoring auto_expire frozen state of %.1fs for activity '%s'",
                self.engine.area_id,
                frozen_secs,
                self.run_state.active_activity,
            )
            self.input_manager.recalculate_disablers(
                self.run_state.active_activity, self.run_state.active_rules
            )
            self._restore_active_handler(self.run_state.active_activity)
        elif expires_at:
            now = dt_util.utcnow()
            delay = (expires_at - now).total_seconds()
            if delay > 0:
                _LOGGER.info(
                    "[%s] Restoring auto_expire timer with remaining delay of %.1fs",
                    self.engine.area_id,
                    delay,
                )
                if self.run_state.active_activity:
                    self._start_auto_expire_timer(
                        self.run_state.active_activity, int(delay)
                    )
                    self.input_manager.recalculate_disablers(
                        self.run_state.active_activity, self.run_state.active_rules
                    )
                    self._restore_active_handler(self.run_state.active_activity)
            elif self.run_state.active_activity and self._check_still_active(
                self.run_state.active_activity
            ):
                # Same prolongation the live path applies (_on_auto_expire): an
                # input still holding the activity open must not lose its light
                # just because the timer lapsed while HA was down. Without this,
                # motion in an occupied room during downtime still went dark on
                # boot.
                name = self.run_state.active_activity
                _LOGGER.info(
                    "[%s] Persisted activity '%s' expired during downtime, but an "
                    "input is still active — prolonging instead of turning off",
                    self.engine.area_id,
                    name,
                )
                self.input_manager.recalculate_disablers(
                    name, self.run_state.active_rules
                )
                self._restore_active_handler(name)
                expire_secs = self._get_effective_expire_seconds(name)
                if expire_secs:
                    native_secs = self.get_activity_auto_expire_seconds(name)
                    source: Literal["activity", "rule"] = (
                        "activity" if native_secs is not None else "rule"
                    )
                    self.update_state(
                        activity_expires_at=dt_util.utcnow()
                        + timedelta(seconds=expire_secs),
                        activity_expire_source=source,
                    )
                    self._start_auto_expire_timer(name, expire_secs)
                else:
                    self.update_state(
                        activity_expires_at=None, activity_expire_source=None
                    )
            else:
                _LOGGER.info(
                    "[%s] Persisted activity expired during downtime.",
                    self.engine.area_id,
                )
                self.update_state(
                    activity_expires_at=None,
                    activity_trigger=None,
                    active_activity=None,
                    scene_activated_at=None,
                )
                self.lux_manager.update_lux_state()
                self.turn_off_all_channels()
        elif self.run_state.active_activity:
            self.input_manager.recalculate_disablers(
                self.run_state.active_activity, self.run_state.active_rules
            )
            self._restore_active_handler(self.run_state.active_activity)

        self.update_state(
            motion_active=motion_active,
        )

    def lux_changed(self) -> None:
        """Signal that lux value has changed."""
        self.lux_manager.update_lux_state()
