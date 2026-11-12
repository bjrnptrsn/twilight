"""Slot coordinator for Twilight control logic."""

from __future__ import annotations

import logging
from collections.abc import Callable, Coroutine, Iterable
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any

from homeassistant.helpers.dispatcher import async_dispatcher_send

from .action_handler import apply_slot_action_to_channel, channel_already_off
from .call_handler import (
    BaseCallHandler,
    SceneCallHandler,
    TurnOffCallHandler,
)
from .const import PRIMARY_CHANNEL_ID, SIGNAL_FADE_CHANGED
from .helpers import (
    channel_entities,
    get_slot_info,
    is_dynamic_slot,
    is_slot_excluded_effective,
)

if TYPE_CHECKING:
    from .config_model import AreaConfig
    from .coordinator import Coordinator
    from .state import RunState

_LOGGER = logging.getLogger(__name__)


def _channels_with_replaced_scene(
    old_config: AreaConfig,
    old_active_slots: dict[str, str],
    new_config: AreaConfig,
    new_active_slots: dict[str, str],
) -> set[str]:
    """Channels that stayed in their active slot, but whose scene the save replaced.

    A channel that moved to another slot is left out: setup has applied it already.
    """
    replaced: set[str] = set()
    for channel_id, slot_id in new_active_slots.items():
        if old_active_slots.get(channel_id) != slot_id:
            continue
        old_slot = old_config.slot(channel_id, slot_id)
        new_slot = new_config.slot(channel_id, slot_id)
        if (
            old_slot
            and new_slot
            and old_slot.scene_entity_id != new_slot.scene_entity_id
        ):
            replaced.add(channel_id)
    return replaced


class SlotCoordinator:
    """Orchestrates channel slot scheduling, fades, and call handler execution."""

    def __init__(self, coordinator: Coordinator) -> None:
        """Initialize the slot coordinator."""
        self.coordinator = coordinator

        self._handlers: dict[str, BaseCallHandler | None] = {
            channel_id: TurnOffCallHandler(self.coordinator.engine, channel_id)
            for channel_id, channel in self.coordinator.engine.config.channels.items()
            if channel.enabled
        }
        self._scene_handlers: dict[str, SceneCallHandler] = {
            channel_id: SceneCallHandler(self.coordinator.engine, channel_id)
            for channel_id, channel in self.coordinator.engine.config.channels.items()
            if channel.enabled
        }
        self._pending_grace: dict[str, float] = {}

    @property
    def has_busy_handler(self) -> bool:
        """True if any channel handler is currently busy executing or settling."""
        return any(h.is_busy for h in self._handlers.values() if h is not None)

    @property
    def channel_ids(self) -> list[str]:
        """All configured channel ids for this area."""
        return list(self.coordinator.engine.config.channels)

    def scene_handler(self, channel_id: str) -> SceneCallHandler | None:
        """The long-lived SceneCallHandler for a channel."""
        return self._scene_handlers.get(channel_id)

    def cancel_all_handlers(self) -> None:
        """Cancel all channel handlers and clear dictionary."""
        for channel_id, handler in self._handlers.items():
            if handler and handler.is_busy:
                elapsed = handler.elapsed_since_last_call
                if elapsed is not None:
                    self._pending_grace[channel_id] = max(0.0, elapsed)
            if handler:
                handler.cancel()
        self._handlers.clear()
        was_fading = bool(self.fading_channels())
        self.coordinator._fade_target_slot.clear()
        if was_fading:
            self._fade_changed()

    def fading_channels(self) -> dict[str, str]:
        """Channels whose anticipatory fade is still running, with its target slot.

        Planned, not confirmed: a fade over lamps that are all off sends nothing.
        """
        return {
            channel_id: slot_id
            for channel_id, (slot_id, _start) in self.coordinator._fade_target_slot.items()
            if self._is_fade_pending(channel_id, slot_id)
        }

    def _fade_changed(self) -> None:
        async_dispatcher_send(
            self.coordinator.engine.hass,
            SIGNAL_FADE_CHANGED,
            self.coordinator.engine.area_id,
        )

    def _slot_active_entities(
        self, channel_id: str, filter_manual_off: bool = False
    ) -> list[str]:
        """Entities for the active slot of a single channel."""
        slot_id = self.coordinator.run_state.active_slots.get(channel_id)
        scene_info = get_slot_info(
            self.coordinator.engine.scene_map, channel_id, slot_id
        )
        if not scene_info:
            return []
        entities = set(scene_info.extracted_entities) | set(
            scene_info.configured_entities
        )

        if filter_manual_off and self.coordinator.is_respect_manual_off_active():
            entities -= set(self.coordinator.run_state.manual_off_entities)

        return list(entities)

    def slots_changed(
        self, active_slots: dict[str, str], is_boot: bool = False
    ) -> None:
        """Signal that the active time slots (per channel) have changed."""
        now = datetime.now(UTC)
        old_slots = self.coordinator.run_state.active_slots
        changed = {
            ch: sid for ch, sid in active_slots.items() if old_slots.get(ch) != sid
        }

        if changed:
            _LOGGER.info(
                "[%s] Active slots changed: %s",
                self.coordinator.engine.area_id,
                changed,
            )
            self.coordinator.update_state(
                active_slots=dict(active_slots), active_slot_start=now
            )
        else:
            self.coordinator.update_state(active_slots=dict(active_slots))
        self.coordinator.lux_manager.update_lux_state()

        if not is_boot:
            self._apply_slots(changed, self._apply_changed_slot)

    def _is_held_dark(self, channel_id: str) -> bool:
        """True if the channel was switched off by hand and the option respects it."""
        return (
            channel_id in self.coordinator.run_state.manual_off_channels
            and self.coordinator.is_respect_manual_off_active()
        )

    def _apply_changed_slot(self, channel_id: str, slot_id: str) -> bool:
        """Bring a channel into its new slot on a slot change; False if left alone.

        A slot change is no command: a channel switched off by hand stays dark.
        A channel that is dark otherwise (Twilight turned it off for an excluded
        or scene-less slot) is resumed — the fade would only reach lamps that
        are on.
        """
        if self._is_held_dark(channel_id):
            return False
        if channel_already_off(self.coordinator, channel_id):
            self._resume_channel_slot(channel_id, slot_id)
        elif self._is_dynamic_fade_still_active(channel_id, slot_id):
            self._complete_dynamic_fade(channel_id, slot_id)
        else:
            self.apply_channel_slot(channel_id, slot_id)
        return True

    def _complete_dynamic_fade(self, channel_id: str, slot_id: str) -> None:
        """Take the channel over from its dynamic fade at T_target, without a recall.

        No fade_target_slot: the swap drops the fade's entry, the fade is over.
        """
        handler = self.scene_handler(channel_id)
        if handler is None:
            return
        _LOGGER.debug(
            "[%s] Dynamic scene fade for channel %s reached slot %s; resending the "
            "non-rotating lamps hard, no second recall (it would restart the rotation)",
            self.coordinator.engine.area_id,
            channel_id,
            slot_id,
        )
        self.swap_channel_handler(
            channel_id, handler, lambda _grace_elapsed: handler.complete_fade(slot_id)
        )

    def _resume_channel_slot(self, channel_id: str, slot_id: str) -> None:
        """Switch a dark channel back on into its slot.

        reapply() switches on what deviates and leaves manual-off lamps out. It
        cannot start a dynamic scene and has nothing to compare without per-lamp
        states, so those enter the slot as a whole.
        """
        scene_info = get_slot_info(
            self.coordinator.engine.scene_map, channel_id, slot_id
        )
        slot = self.coordinator.engine.config.slot(channel_id, slot_id)
        if (
            scene_info
            and scene_info.expected_states
            and not is_dynamic_slot(slot, scene_info)
        ):
            self.reapply_deviating_slot(channel_id, slot_id)
        else:
            self.apply_channel_slot(channel_id, slot_id, direct=True)

    def slot_scenes_replaced(self, channel_ids: set[str]) -> set[str]:
        """Apply the active slot of channels whose scene was replaced or edited.

        Returns the channels that were applied or turned off.
        """
        active_slots = self.coordinator.run_state.active_slots
        return self._apply_slots(
            {ch: active_slots[ch] for ch in channel_ids if ch in active_slots},
            self._apply_replaced_scene,
        )

    def reconcile_after_rebuild(
        self, old_config: AreaConfig, old_run_state: RunState
    ) -> set[str]:
        """Apply the running slots whose scene a save replaced; return the channels."""
        return self.slot_scenes_replaced(
            _channels_with_replaced_scene(
                old_config,
                old_run_state.active_slots,
                self.coordinator.engine.config,
                self.coordinator.run_state.active_slots,
            )
        )

    def apply_exclusion_delta(
        self,
        changed_channels: dict[str, str],
        new_excluded: dict[str, tuple[str, ...]],
        transition_off: int | None,
        skip_channels: set[str],
    ) -> None:
        """Bring channels whose running slot changed its exclusion status into line.

        Same per-channel logic as a slot action's start, for these channels only.
        """
        if self.coordinator.run_state.scene_activated_at is None:
            return
        for channel_id, slot_id in changed_channels.items():
            if channel_id in skip_channels:
                continue
            apply_slot_action_to_channel(
                self.coordinator,
                channel_id,
                slot_id,
                new_excluded,
                was_activated=True,
                transition_off=transition_off,
            )

    def _apply_replaced_scene(self, channel_id: str, slot_id: str) -> bool:
        """Bring a lit channel onto its new scene; a dark channel stays dark (False).

        Unlike a slot change this also reaches lamps that are off: the new scene
        may want a lamp on that the old one kept off. reapply() sends exactly
        what deviates and skips manual-off lamps. It cannot start a dynamic scene
        and has nothing to compare without per-lamp states, so those two take
        the slot-change path. A slot naming no lamp, like a script without a
        turn-off list, always runs: nothing tells whether its room is dark.
        While a dynamic fade into the slot runs, nothing is sent: a second
        recall would restart the rotation.
        """
        if self._is_dynamic_fade_still_active(channel_id, slot_id):
            _LOGGER.debug(
                "[%s] Dynamic scene fade for channel %s and slot %s still running; "
                "skipping the edited scene to avoid restarting the rotation",
                self.coordinator.engine.area_id,
                channel_id,
                slot_id,
            )
            return False
        scene_info = get_slot_info(
            self.coordinator.engine.scene_map, channel_id, slot_id
        )
        names_no_lamp = scene_info is not None and not (
            scene_info.extracted_entities or scene_info.configured_entities
        )
        if not names_no_lamp and channel_already_off(self.coordinator, channel_id):
            return False
        slot = self.coordinator.engine.config.slot(channel_id, slot_id)
        if (
            scene_info
            and scene_info.expected_states
            and not is_dynamic_slot(slot, scene_info)
        ):
            self.reapply_deviating_slot(channel_id, slot_id)
        else:
            self.apply_channel_slot(channel_id, slot_id)
        return True

    def _apply_slots(
        self, slots: dict[str, str], apply: Callable[[str, str], bool]
    ) -> set[str]:
        """Run `apply` on running channels, unless slots are paused or excluded.

        Returns the channels that were turned off or that `apply` acted on.
        """
        handled: set[str] = set()
        if self.coordinator.run_state.scene_activated_at is None:
            return handled

        if self.coordinator.pauses_slots:
            return handled

        for channel_id, slot_id in slots.items():
            if is_slot_excluded_effective(
                self.coordinator.engine.config,
                self.coordinator.run_state,
                self.coordinator.rule_manager,
                channel_id,
                slot_id,
            ):
                self.turn_off_channel(channel_id)
                handled.add(channel_id)
                continue

            if apply(channel_id, slot_id):
                handled.add(channel_id)
        return handled

    async def async_start_slot_fade(
        self, channel_id: str, target_slot_id: str, target_slot_start: datetime
    ) -> bool:
        """Start slot fade if slots are not paused for this channel and scene is active."""
        if self.coordinator.pauses_slots:
            _LOGGER.debug(
                "[%s] Skipping slot fade for channel %s: slots are paused by active activity %s",
                self.coordinator.engine.area_id,
                channel_id,
                self.coordinator.run_state.active_activity,
            )
            return False

        if self.coordinator.run_state.scene_activated_at is None:
            return False

        # Before the fade is built: a dynamic recall would switch the room on.
        if self._is_held_dark(channel_id):
            return False

        if is_slot_excluded_effective(
            self.coordinator.engine.config,
            self.coordinator.run_state,
            self.coordinator.rule_manager,
            channel_id,
            target_slot_id,
        ):
            return False

        scene_info = get_slot_info(
            self.coordinator.engine.scene_map, channel_id, target_slot_id
        )
        if not scene_info or not scene_info.extracted_entities:
            return False

        handler = self.scene_handler(channel_id)
        if handler is None:
            return False
        self.swap_channel_handler(
            channel_id,
            handler,
            lambda grace_elapsed: handler.fade(
                target_slot_id, target_slot_start, grace_elapsed=grace_elapsed
            ),
            fade_target_slot=target_slot_id,
            fade_target_slot_start=target_slot_start,
        )
        return True

    def _channel_slot_scene(self, channel_id: str, slot_id: str) -> str | None:
        """The configured scene_entity_id of a (channel, slot), from config."""
        slot = self.coordinator.engine.config.slot(channel_id, slot_id)
        return slot.scene_entity_id if slot else None

    def swap_channel_handler(
        self,
        channel_id: str,
        handler: BaseCallHandler,
        run: Callable[[float], Coroutine[Any, Any, None]],
        *,
        fade_target_slot: str | None = None,
        fade_target_slot_start: datetime | None = None,
    ) -> None:
        """Cancel the channel's active call, hand it to `handler`, and run it."""
        existing = self._handlers.get(channel_id)
        grace_elapsed = self._pending_grace.pop(channel_id, 0.0)
        if existing:
            if existing.is_busy:
                elapsed = existing.elapsed_since_last_call
                if elapsed is not None:
                    grace_elapsed = max(grace_elapsed, elapsed)
            existing.cancel()
        self._handlers[channel_id] = handler
        fade_changed = channel_id in self.fading_channels()
        if fade_target_slot is not None and fade_target_slot_start is not None:
            self.coordinator._fade_target_slot[channel_id] = (
                fade_target_slot,
                fade_target_slot_start,
            )
            fade_changed = fade_changed or self._is_fade_pending(
                channel_id, fade_target_slot
            )
        else:
            self.coordinator._fade_target_slot.pop(channel_id, None)
        if fade_changed:
            self._fade_changed()
        # Tracked in handler._tasks (not coordinator._tasks): `run` is one of
        # this handler's own public methods, so handler.cancel()
        # (cancel_all_handlers(), or _run()'s own self.cancel() prefix on the
        # next call) must be able to reach and cancel this outer task too —
        # otherwise a call stuck in `await hass.services.async_call(...)`
        # survives a cancel and keeps running against superseded state.
        handler._create_task(run(grace_elapsed))

    def _is_fade_pending(self, channel_id: str, slot_id: str) -> bool:
        """True if a fade toward slot_id is still running."""
        entry = self.coordinator._fade_target_slot.get(channel_id)
        if entry is None or entry[0] != slot_id:
            return False
        return datetime.now(UTC) < entry[1].astimezone(UTC)

    def _is_dynamic_fade_still_active(self, channel_id: str, slot_id: str) -> bool:
        """True if slot_id is a dynamic scene that Stage 1 already activated.

        Checked at Stage 2 (the slot actually becoming active, called from
        `slots_changed()` once the schedule reaches T_ziel) — deliberately
        without a now-vs-target time check like `_is_fade_pending()`: fade()
        derives its `transition` seconds from the remaining time to T_ziel,
        so the transition itself is expected to be done by the time Stage 2
        runs. What must not happen is re-dispatching the activation anyway —
        a Hue dynamic palette keeps rotating colors on its own once
        activated, and a second hue.activate_scene call would restart that
        rotation from scratch rather than let it continue. Stage 2 therefore
        only resends the non-rotating lamps (`complete_fade()`), and an edited
        scene waits until then.

        For a static scene or individual lights, re-dispatching at slot
        change stays unconditional — it's a harmless resend, even a bit of
        extra robustness against a stubborn light.
        """
        entry = self.coordinator._fade_target_slot.get(channel_id)
        if entry is None or entry[0] != slot_id:
            return False
        handler = self.scene_handler(channel_id)
        if handler is None:
            return False
        scene_info = get_slot_info(self.coordinator.engine.scene_map, channel_id, slot_id)
        return handler.is_dynamic_slot(slot_id, scene_info)

    def reapply_deviating_slot(self, channel_id: str, slot_id: str) -> None:
        """Re-apply only the deviating entities of a slot scene, or fallback to full apply."""
        if self._is_fade_pending(channel_id, slot_id):
            _LOGGER.debug(
                "[%s] Target slot transition handler for channel %s and slot %s already active; skipping reapply to keep fade",
                self.coordinator.engine.area_id,
                channel_id,
                slot_id,
            )
            return

        if not self._channel_slot_scene(channel_id, slot_id):
            self.apply_channel_slot(channel_id, slot_id, direct=True)
            return

        handler = self.scene_handler(channel_id)
        if handler is None:
            return
        self.swap_channel_handler(
            channel_id,
            handler,
            lambda grace_elapsed: handler.reapply(
                slot_id, grace_elapsed=grace_elapsed
            ),
        )

    def turn_off_channel(
        self,
        channel_id: str,
        transition_off: int | None = None,
        extra_entities: Iterable[str] = (),
    ) -> None:
        """Turn off a single channel's active-slot entities via TurnOffCallHandler."""
        channel = self.coordinator.engine.config.channel(channel_id)
        if channel is not None and not channel.enabled:
            _LOGGER.debug(
                "[%s] Skipping turn_off_channel for disabled channel %s",
                self.coordinator.engine.area_id,
                channel_id,
            )
            return

        entities = list(
            set(channel_entities(self.coordinator.engine.scene_map, channel_id))
            | set(extra_entities)
        )
        if entities:
            handler = TurnOffCallHandler(
                self.coordinator.engine, channel_id, transition_off=transition_off
            )
            self.swap_channel_handler(
                channel_id,
                handler,
                lambda grace_elapsed: handler.execute(entities),
            )

    def apply_channel_slot(
        self, channel_id: str, slot_id: str, direct: bool = False
    ) -> None:
        """Apply a single channel into its slot."""
        if self._channel_slot_scene(channel_id, slot_id):
            handler = self.scene_handler(channel_id)
            if handler is None:
                return
            scene_info = get_slot_info(
                self.coordinator.engine.scene_map, channel_id, slot_id
            )
            if direct or not (scene_info and scene_info.extracted_entities):
                entities = self._slot_active_entities(
                    channel_id, filter_manual_off=not direct
                )
                self.swap_channel_handler(
                    channel_id,
                    handler,
                    lambda grace_elapsed: handler.start(slot_id, entities),
                )
            else:
                now = datetime.now(UTC)
                self.swap_channel_handler(
                    channel_id,
                    handler,
                    lambda grace_elapsed: handler.fade(
                        slot_id, now, grace_elapsed=grace_elapsed
                    ),
                    fade_target_slot=slot_id,
                    fade_target_slot_start=now,
                )
        else:
            self.turn_off_channel(channel_id)

    def turn_off_all_channels(
        self, transition_off: int | None = None, extra_entities: Iterable[str] = ()
    ) -> None:
        """Turn off every channel's active-slot entities via TurnOffCallHandler.

        `extra_entities` join the Primary channel's call: a second handler on the
        same channel would cancel the first one along with its retries. What an
        enabled custom channel turns off itself stays out of it, or the lamp would
        get the calls and retries of both.
        """
        enabled_channels = [
            channel_id
            for channel_id in self.channel_ids
            if (channel := self.coordinator.engine.config.channel(channel_id)) is None
            or channel.enabled
        ]
        primary_extras = set(extra_entities)
        for channel_id in enabled_channels:
            if channel_id != PRIMARY_CHANNEL_ID:
                primary_extras -= channel_entities(
                    self.coordinator.engine.scene_map, channel_id
                )
        for channel_id in enabled_channels:
            self.turn_off_channel(
                channel_id,
                transition_off=transition_off,
                extra_entities=primary_extras if channel_id == PRIMARY_CHANNEL_ID else (),
            )

    def turn_off_entities(self, entities: Iterable[str]) -> None:
        """Turn off only these entities, on the Primary channel's handler."""
        targets = list(entities)
        if not targets:
            return
        handler = TurnOffCallHandler(self.coordinator.engine, PRIMARY_CHANNEL_ID)
        self.swap_channel_handler(
            PRIMARY_CHANNEL_ID,
            handler,
            lambda grace_elapsed: handler.execute(targets),
        )
