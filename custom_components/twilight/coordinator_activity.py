"""Activity coordinator for Twilight control logic."""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Callable
from datetime import timedelta
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
from .config_model import (
    ActionConfig,
    ActivityConfig,
    ResetActionConfig,
    SlotActionConfig,
)
from .const import (
    DEFAULT_AUTO_EXPIRE,
    DEFAULT_TRANSITION_OFF_SECONDS,
    ActionType,
    InputType,
    RuleAutoExpireMode,
)
from .helpers import (
    coerce_action,
    create_tracked_task,
    dispatch_entity_target,
    parse_hms,
)
from .state import ActivityTrigger

if TYPE_CHECKING:
    from .coordinator import Coordinator

_LOGGER = logging.getLogger(__name__)


class ActivityCoordinator:
    """Orchestrates activity lifecycle, auto-expire timers, and action dispatching."""

    def __init__(self, coordinator: Coordinator) -> None:
        """Initialize the activity coordinator."""
        self.coordinator = coordinator

        # Statically instantiated Action Handlers — passed the coordinator facade
        self._action_handlers: dict[str, BaseActionHandler] = {
            ActionType.SLOT: SlotActionHandler(self.coordinator),
            ActionType.ENTITY: EntityActionHandler(self.coordinator),
            ActionType.LIGHT: LightActionHandler(self.coordinator),
            ActionType.BLOCK: BlockActionHandler(self.coordinator),
            ActionType.TURN_OFF: TurnOffActionHandler(self.coordinator),
            ActionType.SIMULATION: PresenceSimulationActionHandler(self.coordinator),
        }
        self._active_handler: BaseActionHandler | None = None
        self._pending_handler_cancel: asyncio.Task[None] | None = None
        self._pending_handler_start: asyncio.Task[None] | None = None

        # Timer for activity auto expiration
        self._auto_expire_unsub: Callable[[], None] | None = None

    @property
    def pauses_slots(self) -> bool:
        """True if current active handler pauses slot fades/changes."""
        return bool(self._active_handler and self._active_handler.pauses_slots)

    def is_respect_manual_off_active(self) -> bool:
        """Return True if the active activity uses a SlotAction with respect_manual_off enabled or enforced by active rule."""
        active_act = self.coordinator.run_state.active_activity
        if not active_act:
            return False
        action = self.resolve_action(active_act)
        default = isinstance(action, SlotActionConfig) and action.respect_manual_off
        return self.coordinator.rule_manager.get_effective_respect_manual_off(default)

    def reapply_active_activity_rules(self) -> None:
        """Re-apply rules for the currently active activity if running."""
        active_act_id = self.coordinator.run_state.active_activity
        if not active_act_id or not self._active_handler:
            return

        act = self.coordinator.engine.config.activity_by_id(active_act_id)
        if not act:
            return

        action = coerce_action(act.action)
        if action.type == ActionType.SLOT:
            _LOGGER.debug(
                "[%s] Re-applying active activity rules for slot activity: %s",
                self.coordinator.engine.area_id,
                active_act_id,
            )
            transition_off = self.get_activity_transition_off_seconds(active_act_id)
            self.coordinator._create_task(
                self._active_handler.start(
                    action,
                    self.coordinator.run_state.active_slots,
                    transition_off=transition_off,
                )
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
            self.coordinator.engine.area_id,
            name,
            input_id,
        )

        if input_id:
            disablers = self.coordinator.run_state.inputs_disabled_by.get(input_id, [])
            if disablers:
                _LOGGER.debug(
                    "[%s] Input %s is disabled by %s. Ignoring request for activity %s",
                    self.coordinator.engine.area_id,
                    input_id,
                    disablers,
                    name,
                )
                return

        self._cancel_auto_expire_timer()

        action = self.resolve_action(name)

        if action.type == ActionType.RESET:
            _LOGGER.info(
                "[%s] Reset triggered by activity '%s'",
                self.coordinator.engine.area_id,
                name,
            )
            old_handler = self._active_handler
            self._active_handler = None
            if old_handler:
                self._spawn_pending_cancel(old_handler)
            self.coordinator.cancel_all_handlers()
            reset_kwargs: dict[str, Any] = {
                "active_activity": None,
                "activity_trigger": None,
                "activity_expires_at": None,
                "activity_expire_frozen_seconds": None,
                "activity_expire_source": None,
                "scene_activated_at": None,
            }
            if self.coordinator.run_state.manual_off_entities:
                reset_kwargs["manual_off_entities"] = frozenset()
            self.coordinator.update_state(**reset_kwargs)
            self.coordinator.lux_manager.update_lux_state()
            self.coordinator.turn_off_all_channels()
            if isinstance(action, ResetActionConfig) and action.entity_targets:
                for target in action.entity_targets:
                    create_tracked_task(
                        self.coordinator.engine.hass,
                        dispatch_entity_target(
                            self.coordinator.engine.hass,
                            self.coordinator.engine.area_id,
                            target.entity_id,
                            target.action,
                        ),
                        self.coordinator._tasks,
                    )
            return

        expire_secs = self.get_effective_expire_seconds(name)
        native_secs = self.get_activity_auto_expire_seconds(name)
        source: Literal["activity", "rule"] | None = (
            "activity"
            if native_secs is not None
            else ("rule" if expire_secs is not None else None)
        )
        effective_mode = self._get_effective_rule_auto_expire_mode(name)
        is_frozen = (
            effective_mode != RuleAutoExpireMode.NONE
            or self.coordinator.run_state.activity_expire_frozen_seconds is not None
        )

        if is_frozen:
            was_already_frozen = (
                self.coordinator.run_state.activity_expire_frozen_seconds is not None
            )
            if was_already_frozen:
                frozen_secs: float | None = (
                    float(expire_secs) if expire_secs is not None else None
                )
            else:
                frozen_secs = (
                    0.0
                    if effective_mode == RuleAutoExpireMode.SUSPEND
                    else (float(expire_secs) if expire_secs is not None else None)
                )
            expires_at = None
        else:
            frozen_secs = None
            expires_at = (
                dt_util.utcnow() + timedelta(seconds=expire_secs)
                if expire_secs is not None
                else None
            )

        # Guard: If same activity re-requested while any call handler is busy, refresh timer & skip action
        is_same_activity = self.coordinator.run_state.active_activity == name
        has_busy_handler = self.coordinator.has_busy_handler

        if is_same_activity and has_busy_handler:
            _LOGGER.debug(
                "[%s] Activity '%s' re-requested while call handler is busy; refreshing timer without re-applying action",
                self.coordinator.engine.area_id,
                name,
            )
            self.coordinator.update_state(
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
            self.coordinator.lux_manager.update_lux_state()
            if is_frozen:
                self._cancel_auto_expire_timer()
            elif expire_secs is not None:
                self.start_auto_expire_timer(name, expire_secs)
            return

        # Real activation clears manual off markers (explicit activation command).
        # Deliberately after the busy-guard: a re-trigger that only refreshes the
        # timer is NOT an activation, and its markers must survive for the next
        # slot change (respect_manual_off would otherwise pull the manually
        # turned-off light back on).
        if self.coordinator.run_state.manual_off_entities:
            self.coordinator.update_state(manual_off_entities=frozenset())

        self.coordinator.update_state(
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
            self.start_auto_expire_timer(name, expire_secs)
        else:
            self.coordinator.update_state(
                activity_expires_at=None, activity_expire_source=None
            )

    def activity_released(self, name: str) -> None:
        """Release/deactivate an activity in the area."""
        _LOGGER.debug(
            "[%s] Activity released: %s", self.coordinator.engine.area_id, name
        )
        if self.coordinator.run_state.active_activity != name:
            return

        if self.check_still_active(name):
            _LOGGER.debug(
                "[%s] Activity '%s' release skipped — another input still active",
                self.coordinator.engine.area_id,
                name,
            )
            return

        self._cancel_auto_expire_timer()
        self.coordinator.update_state(
            activity_expire_frozen_seconds=None,
            activity_expires_at=None,
            activity_expire_source=None,
            manual_off_entities=frozenset(),
        )
        self._apply_release_action(self.resolve_release_action(name), name)

    def get_activity_auto_expire_seconds(self, name: str) -> int | None:
        """Get the auto expire duration in seconds, or None if disabled."""
        cfg = self.get_activity_config(name)
        if cfg and not cfg.auto_expire_enabled:
            return None
        auto_expire = cfg.auto_expire if cfg else None
        if auto_expire is None:
            auto_expire = DEFAULT_AUTO_EXPIRE
        parsed = parse_hms(auto_expire)
        if parsed is None:
            _LOGGER.warning(
                "[%s] Activity '%s' has an invalid auto_expire value %r — "
                "falling back to the default (%s)",
                self.coordinator.engine.area_id,
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

    def check_still_active(self, activity_name: str) -> bool:
        """Check if any input holding this activity is still active."""
        if self.coordinator.engine.motion_handler.has_active_motion_for_activity(
            activity_name
        ):
            return True

        for binary_inp in self.coordinator.engine.config.inputs_of_type(InputType.BINARY):
            if binary_inp.activity != activity_name or not binary_inp.id:
                continue
            if self.is_input_disabled(binary_inp.id):
                continue
            if self.coordinator.run_state.inputs_active.get(binary_inp.id):
                return True

        for button_inp in self.coordinator.engine.config.inputs_of_type(InputType.BUTTON):
            if button_inp.activity != activity_name or not button_inp.id:
                continue
            if (button_inp.button_mode or "click") != "toggle":
                continue
            if self.is_input_disabled(button_inp.id):
                continue
            if self.coordinator.run_state.inputs_active.get(button_inp.id):
                return True
        return False

    def is_input_disabled(self, input_id: str | None) -> bool:
        """Check whether an input is currently disabled/suppressed."""
        if not input_id:
            return False
        return bool(self.coordinator.run_state.inputs_disabled_by.get(input_id))

    def _get_effective_rule_auto_expire_mode(
        self, activity_name: str
    ) -> RuleAutoExpireMode:
        """Calculate effective rule auto_expire mode for an activity among active rules."""
        effective = RuleAutoExpireMode.NONE
        for rule in self.coordinator.engine.config.rules:
            if not rule.enabled or not rule.id:
                continue
            if activity_name not in rule.applied_activities:
                continue
            if not self.coordinator.run_state.active_rules.get(rule.id, False):
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

    def get_effective_expire_seconds(self, name: str) -> int | None:
        """Get effective auto_expire duration for an activity (seconds)."""
        native_secs = self.get_activity_auto_expire_seconds(name)
        if native_secs is not None:
            return native_secs

        act = self.coordinator.engine.config.activity_by_id(name)
        if not act or (act.action and act.action.type == ActionType.RESET):
            return None

        borrowed_durations: list[int] = []
        for rule in self.coordinator.engine.config.rules:
            if not rule.enabled or not self.coordinator.run_state.active_rules.get(
                rule.id, False
            ):
                continue
            if name not in rule.applied_activities:
                continue
            if rule.auto_expire_enabled is True:
                dur = (
                    parse_hms(rule.auto_expire)
                    if rule.auto_expire
                    else parse_hms(DEFAULT_AUTO_EXPIRE)
                )
                if dur is None:
                    _LOGGER.warning(
                        "[%s] Rule '%s' has an invalid auto_expire value %r — "
                        "falling back to the default (%s)",
                        self.coordinator.engine.area_id,
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
        active_act = self.coordinator.run_state.active_activity
        if not active_act:
            if self.coordinator.run_state.activity_expire_frozen_seconds is not None:
                self.coordinator.update_state(activity_expire_frozen_seconds=None)
            return

        mode = self._get_effective_rule_auto_expire_mode(active_act)

        if mode == RuleAutoExpireMode.NONE:
            if self.coordinator.run_state.activity_expire_frozen_seconds is not None:
                frozen_seconds = (
                    self.coordinator.run_state.activity_expire_frozen_seconds
                )
                self.coordinator.update_state(activity_expire_frozen_seconds=None)
                if frozen_seconds > 0:
                    expires_at = dt_util.utcnow() + timedelta(seconds=frozen_seconds)
                    native_secs = self.get_activity_auto_expire_seconds(active_act)
                    source: Literal["activity", "rule"] = (
                        "activity" if native_secs is not None else "rule"
                    )
                    self.coordinator.update_state(
                        activity_expires_at=expires_at, activity_expire_source=source
                    )
                    self.start_auto_expire_timer(active_act, round(frozen_seconds))
                else:
                    self.coordinator.update_state(
                        activity_expires_at=None, activity_expire_source=None
                    )
                    self._on_auto_expire(active_act)
                return

            if (
                self.get_activity_auto_expire_seconds(active_act) is None
                and self.coordinator.run_state.activity_expire_source != "rule"
            ):
                borrowed_secs = self.get_effective_expire_seconds(active_act)
                if borrowed_secs is not None:
                    expires_at = dt_util.utcnow() + timedelta(seconds=borrowed_secs)
                    self.coordinator.update_state(
                        activity_expires_at=expires_at,
                        activity_expire_source="rule",
                    )
                    self.start_auto_expire_timer(active_act, borrowed_secs)
            return

        expire_secs = self.get_activity_auto_expire_seconds(active_act)
        if expire_secs is None:
            return

        if self.coordinator.run_state.activity_expire_frozen_seconds is None:
            if mode == RuleAutoExpireMode.RESTART:
                frozen_seconds = float(expire_secs)
            elif mode == RuleAutoExpireMode.PAUSE:
                if self.coordinator.run_state.activity_expires_at:
                    rem = (
                        self.coordinator.run_state.activity_expires_at - dt_util.utcnow()
                    ).total_seconds()
                    frozen_seconds = max(0.0, rem)
                else:
                    frozen_seconds = float(expire_secs)
            else:  # SUSPEND
                frozen_seconds = 0.0

            self._cancel_auto_expire_timer()
            self.coordinator.update_state(
                activity_expires_at=None,
                activity_expire_frozen_seconds=frozen_seconds,
            )
        else:
            if mode == RuleAutoExpireMode.RESTART:
                self.coordinator.update_state(
                    activity_expire_frozen_seconds=float(expire_secs)
                )
            elif mode == RuleAutoExpireMode.SUSPEND:
                self.coordinator.update_state(activity_expire_frozen_seconds=0.0)

    def start_auto_expire_timer(self, name: str, seconds: int) -> None:
        """Start auto expire timer for the active activity."""
        self._cancel_auto_expire_timer()

        @callback
        def _on_expire(_now: Any) -> None:
            self._on_auto_expire(name)

        self._auto_expire_unsub = async_call_later(
            self.coordinator.engine.hass, seconds, _on_expire
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
        if self.coordinator.run_state.active_activity != name:
            return

        if self.check_still_active(name):
            _LOGGER.info(
                "[%s] Activity '%s' auto-expire postponed — input still active",
                self.coordinator.engine.area_id,
                name,
            )
            expire_secs = self.get_effective_expire_seconds(name)

            if expire_secs:
                native_secs = self.get_activity_auto_expire_seconds(name)
                source: Literal["activity", "rule"] = (
                    "activity" if native_secs is not None else "rule"
                )
                expires_at = dt_util.utcnow() + timedelta(seconds=expire_secs)
                self.coordinator.update_state(
                    activity_expires_at=expires_at,
                    activity_expire_source=source,
                )
                self.start_auto_expire_timer(name, expire_secs)
            else:
                self.coordinator.update_state(
                    activity_expires_at=None, activity_expire_source=None
                )
            return

        _LOGGER.info(
            "[%s] Activity '%s' expired automatically",
            self.coordinator.engine.area_id,
            name,
        )
        self.activity_released(name)

    def _spawn_pending_cancel(self, old_handler: BaseActionHandler) -> None:
        """Spawn a bare cancel() task for `old_handler`, tracked in `_pending_handler_cancel`.

        Claim-before-overwrite: an already-pending bare cancel task (e.g. from
        a previous no-op/Reset) must be awaited first, not dropped by this
        assignment — otherwise it stays orphaned in the background while this
        call's own cancel task takes over the field. Mirrors
        _cancel_then_start's pending_cancel handling, which does the same for
        the start-with-a-following-start branch.
        """
        pending_cancel = self._pending_handler_cancel

        async def _cancel_after_pending() -> None:
            if pending_cancel is not None:
                await pending_cancel
            await old_handler.cancel()

        self._pending_handler_cancel = self.coordinator._create_task(
            _cancel_after_pending()
        )

    def _apply_action(
        self, action: dict[str, Any] | ActionConfig | None, name: str | None = None
    ) -> None:
        """Apply the configured start action for the activity via ActionHandlers."""
        action = coerce_action(action)

        old_handler = self._active_handler
        self.coordinator.cancel_all_handlers()

        t = action.type
        if t is None or t not in self._action_handlers:
            _LOGGER.debug(
                "[%s] No/unrecognized action type '%s' — activity does nothing.",
                self.coordinator.engine.area_id,
                t,
            )
            self._active_handler = None
            if old_handler:
                self._spawn_pending_cancel(old_handler)
            return
        new_handler = self._action_handlers[t]
        self._active_handler = new_handler
        transition_off = self.get_activity_transition_off_seconds(name)
        # In-flight handler cancellation/start race protection (3ffbfa8 / 0c0c81b):
        # 1. pending_cancel: background cancel() task spawned when an empty/None action cleared the active handler.
        #    HA's eager task scheduling means cancel() runs immediately up to its first
        #    blocking await. If a new activity arrives while cancel() is suspended inside asyncio.gather, we MUST await it
        #    to prevent two parallel tick-chains where a stale handler's teardown completes after the new handler started.
        # 2. pending_start: background start()/stop() task from a previous action or release (e.g. simulation _load_buckets
        #    or release stop() teardown). A rapid re-trigger while start()/stop() is suspended would race if start() reset
        #    `_cancelled` back to False mid-flight. Awaiting pending_start guarantees strict sequential ordering: the previous
        #    start/stop finishes completely before old_handler is cancelled and new_handler starts.
        pending_cancel = self._pending_handler_cancel
        self._pending_handler_cancel = None
        pending_start = self._pending_handler_start
        self._pending_handler_start = None

        async def _cancel_then_start() -> None:
            # Await any pending background cancellation (prevents parallel tick-chains / ghost timers)
            if pending_cancel is not None:
                await pending_cancel
            # Await any pending background start/stop task (prevents _cancelled reset races)
            if pending_start is not None:
                await pending_start
            # Cancel the old handler if one was active
            if old_handler:
                await old_handler.cancel()
            # Stale-start guard: a no-op/Reset activity, a release, or a newer
            # activity may have claimed `_active_handler` while this task was
            # suspended above. The pending start then belongs to a superseded
            # application — running it would re-apply the old activity's light
            # state with no (or a different) owner, the same orphaned-start
            # family 3ffbfa8/0c0c81b closed on the release side. Same-typed
            # re-triggers reuse the same handler instance and stay unaffected.
            if self._active_handler is not new_handler:
                return
            # Read active_slots fresh here rather than snapshotting it before the
            # awaits above: slots_changed() runs independently on the tick loop and
            # may have advanced the slot schedule during the (potentially seconds-long)
            # wait, e.g. a Recorder-backed cancel()/start() crossing a fixed-slot
            # boundary. Starting with a stale snapshot would apply the superseded slot
            # and leave it applied until the next transition.
            await new_handler.start(
                action,
                self.coordinator.run_state.active_slots,
                transition_off=transition_off,
            )

        self._pending_handler_start = self.coordinator._create_task(_cancel_then_start())

    def _apply_release_action(
        self, release: dict[str, Any] | ActionConfig | None, name: str | None = None
    ) -> None:
        """Apply the configured release action for the activity via ActionHandlers.

        Tracks handler.stop() in self._pending_handler_start so any rapid subsequent
        activity_requested() call is forced to await the release completion before starting
        (prevents interleaving release and start tasks on the same handler instance).
        """
        release = coerce_action(release)

        handler = self._active_handler
        self._active_handler = None

        transition_off = self.get_activity_transition_off_seconds(name)

        self.coordinator.update_state(
            active_activity=None,
            activity_trigger=None,
            activity_expires_at=None,
            activity_expire_frozen_seconds=None,
            activity_expire_source=None,
        )

        if handler is not None:
            # Mirror of _apply_action's pending_start handling: a still-running
            # start() task (e.g. suspended inside simulation's _load_buckets Recorder
            # query) must be claimed and awaited here too. Otherwise it survives
            # orphaned, resumes after this stop() has already torn everything down,
            # and re-applies its now-stale action (e.g. slot scenes) with no active
            # activity left to own it — turning lights back on behind the release.
            pending_start = self._pending_handler_start
            self._pending_handler_start = None

            async def _stop_after_pending() -> None:
                if pending_start is not None:
                    await pending_start
                await handler.stop(release, transition_off=transition_off)

            self._pending_handler_start = self.coordinator._create_task(
                _stop_after_pending()
            )

    def get_activity_config(self, name: str) -> ActivityConfig | None:
        """Get the typed config for an activity, or None if not configured."""
        cfg = self.coordinator.engine.config.activity_by_id(name)
        if cfg is None:
            _LOGGER.warning(
                "[%s] No activity config found for '%s' — falling back to defaults",
                self.coordinator.engine.area_id,
                name,
            )
        return cfg

    def resolve_action(self, name: str) -> ActionConfig:
        """Resolve the start action for an activity."""
        cfg = self.get_activity_config(name)
        return coerce_action(cfg.action if cfg else None)

    def resolve_release_action(self, name: str) -> ActionConfig:
        """Resolve the release action for an activity."""
        cfg = self.get_activity_config(name)
        return coerce_action(cfg.release_action if cfg else None)

    def restore_active_handler(self, name: str) -> None:
        """Restore _active_handler after a restart based on the activity's resolved action."""
        action = self.resolve_action(name)
        t = action.type
        if t is None or t not in self._action_handlers:
            _LOGGER.debug(
                "[%s] No/unrecognized action type '%s' during restore of activity '%s' — no handler.",
                self.coordinator.engine.area_id,
                t,
                name,
            )
            self._active_handler = None
            return
        self._active_handler = self._action_handlers[t]
        if (
            t == ActionType.SIMULATION
            and isinstance(self._active_handler, PresenceSimulationActionHandler)
            and not self._active_handler.started
        ):
            transition_off = self.get_activity_transition_off_seconds(name)
            handler = self._active_handler
            # Tracked in _pending_handler_start (not a bare coordinator._create_task)
            # so a concurrent _apply_action/_apply_release_action — e.g. an input
            # trigger racing this boot restore while _load_buckets()'s Recorder query
            # is in flight — awaits this start before cancelling/reusing the same
            # static handler instance. Without this, old_handler.cancel() in
            # _cancel_then_start doesn't see this task (it lives outside
            # handler._tasks until start() begins), and new_handler.start() resets
            # _cancelled back to False while this restore task is still suspended,
            # so it resumes past its own _cancelled check into a second, parallel
            # tick chain.
            self._pending_handler_start = self.coordinator._create_task(
                handler.start(
                    action,
                    self.coordinator.run_state.active_slots,
                    transition_off=transition_off,
                )
            )

    async def async_teardown(self) -> None:
        """Clean up activity timers and active handler."""
        self._cancel_auto_expire_timer()
        if self._active_handler:
            await self._active_handler.cancel()
            self._active_handler = None
