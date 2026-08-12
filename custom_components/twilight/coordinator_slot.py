"""Slot coordinator for Twilight control logic."""

from __future__ import annotations

import logging
from collections.abc import Callable, Coroutine
from datetime import UTC, datetime
from typing import TYPE_CHECKING, Any

from .call_handler import (
    BaseCallHandler,
    LightCallHandler,
    SceneCallHandler,
    TurnOffCallHandler,
)
from .helpers import (
    channel_entities,
    get_slot_info,
    is_slot_excluded_effective,
)

if TYPE_CHECKING:
    from .coordinator import Coordinator

_LOGGER = logging.getLogger(__name__)


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
        self._light_handlers: dict[str, LightCallHandler] = {
            channel_id: LightCallHandler(self.coordinator.engine, channel_id)
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

    def light_handler(self, channel_id: str) -> LightCallHandler | None:
        """The long-lived LightCallHandler for a channel."""
        return self._light_handlers.get(channel_id)

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
        self.coordinator._fade_target_slot.clear()

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
        if self.coordinator.engine.config.manual_only:
            entities = set(scene_info.configured_entities)
        else:
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

        if is_boot or self.coordinator.run_state.scene_activated_at is None:
            return

        if self.coordinator.pauses_slots:
            return

        for channel_id, slot_id in changed.items():
            if is_slot_excluded_effective(
                self.coordinator.engine.config,
                self.coordinator.run_state,
                self.coordinator.rule_manager,
                channel_id,
                slot_id,
            ):
                self.turn_off_channel(channel_id)
                continue

            if self._is_dynamic_fade_still_active(channel_id, slot_id):
                _LOGGER.debug(
                    "[%s] Dynamic scene fade for channel %s and slot %s still "
                    "transitioning; skipping the redundant slot-change re-call "
                    "to avoid restarting the Bridge/HA-side rotation",
                    self.coordinator.engine.area_id,
                    channel_id,
                    slot_id,
                )
                continue

            self.apply_channel_slot(channel_id, slot_id)

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
        if fade_target_slot is not None and fade_target_slot_start is not None:
            self.coordinator._fade_target_slot[channel_id] = (
                fade_target_slot,
                fade_target_slot_start,
            )
        else:
            self.coordinator._fade_target_slot.pop(channel_id, None)
        # Tracked in handler._tasks (not coordinator._tasks): `run` is one of
        # this handler's own start/fade/reapply methods, so handler.cancel()
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
        a Dynamic Scene (Hue dynamic palette or a HA dynamic scene) keeps
        rotating colors on its own once activated, and a second
        hue.activate_scene/scene.turn_on call would restart that rotation
        from scratch rather than let it continue.

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
        self, channel_id: str, transition_off: int | None = None
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
            channel_entities(
                self.coordinator.engine.scene_map,
                channel_id,
                self.coordinator.engine.config.manual_only,
            )
        )
        if entities:
            handler = TurnOffCallHandler(
                self.coordinator.engine, channel_id, transition_off=transition_off
            )
            self.swap_channel_handler(
                channel_id,
                handler,
                lambda grace_elapsed: handler.execute(
                    entities, grace_elapsed=grace_elapsed
                ),
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

    def apply_all_channels_slots(self, direct: bool = False) -> None:
        """Re-apply every channel into its current active slot (scene or off)."""
        for channel_id in self.channel_ids:
            channel = self.coordinator.engine.config.channel(channel_id)
            if channel is not None and not channel.enabled:
                continue
            slot_id = self.coordinator.run_state.active_slots.get(channel_id)
            if slot_id:
                self.apply_channel_slot(channel_id, slot_id, direct=direct)

    def turn_off_all_channels(self, transition_off: int | None = None) -> None:
        """Turn off every channel's active-slot entities via TurnOffCallHandler."""
        for channel_id in self.channel_ids:
            channel = self.coordinator.engine.config.channel(channel_id)
            if channel is not None and not channel.enabled:
                continue
            self.turn_off_channel(channel_id, transition_off=transition_off)
