"""Scene coordination for Twilight – classification and extraction."""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Iterator
from typing import TYPE_CHECKING, Any

from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import (
    SCENE_EXTRACTION_MAX_RETRIES,
    SCENE_EXTRACTION_RETRY_INTERVAL,
    SIGNAL_ENGINES_CHANGED,
    SceneType,
)
from .state import SlotSceneInfo

if TYPE_CHECKING:
    from asyncio import Task

    from .config_model import SlotConfig
    from .engine import TwilightEngine

_LOGGER = logging.getLogger(__name__)


def palette_is_dynamic(palette: Any) -> bool:
    """Return True if a Hue scene palette can drive a dynamic rotation.

    Mirrors HueSceneEntity.is_dynamic in HA core
    (homeassistant/components/hue/scene.py): a palette needs MORE THAN ONE
    color, or more than one color temperature, to actually rotate. A
    single-entry palette is a static scene — the Bridge would just hold that
    one value.
    """
    if not palette:
        return False
    colors = getattr(palette, "color", None)
    if colors and len(colors) > 1:
        return True
    color_temps = getattr(palette, "color_temperature", None)
    return bool(color_temps and len(color_temps) > 1)


class SceneManager:
    """Scene coordination – classification and extraction."""

    def __init__(self, engine: TwilightEngine) -> None:
        """Initialize the scene manager."""
        self.engine = engine
        self.hass = engine.hass
        self.retry_task: Task[None] | None = None

    def _iter_channel_slots(self) -> Iterator[tuple[str, SlotConfig]]:
        """Yield (channel_id, SlotConfig) across all configured channels."""
        for channel_id, channel in self.engine.config.channels.items():
            for slot in channel.slots:
                yield channel_id, slot

    async def _process_slot(
        self, channel_id: str, slot: SlotConfig
    ) -> SlotSceneInfo | None:
        """Classify and extract a single slot's scene, returning its SlotSceneInfo.

        Returns None if the slot has no scene configured. Shared by async_setup()
        and the background retry loop so both stay in lockstep.
        """
        scene_entity_id = slot.scene_entity_id
        if not scene_entity_id:
            return None

        scene_type = self._classify_scene(scene_entity_id)
        supports_dynamic = self._supports_dynamic(scene_entity_id)
        configured = frozenset(slot.configured_entities)
        extracted, expected = await self._async_extract_scene(
            scene_entity_id, scene_type
        )

        # NOTE: expected_states are deliberately kept for hue_activate_dynamic
        # slots. The palette rotation runs in the lamp firmware and never
        # updates the Bridge's light resource, so it emits no state_changed
        # events at all (hue_scenes.md §2, live-verified) — the deviation
        # watcher has nothing to react to and the retry loop reaches its
        # target on the first check. Clearing them would only strip the
        # anticipatory fade, which resolves its targets from this very dict.
        return SlotSceneInfo(
            channel_id=channel_id,
            scene_entity_id=scene_entity_id,
            scene_type=scene_type,
            extracted_entities=frozenset(extracted),
            configured_entities=configured,
            expected_states=expected,
            supports_dynamic=supports_dynamic,
        )

    async def async_setup(self) -> None:
        """Classify all scene/script entities for slots across every channel and build scene_map."""
        all_slots = list(self._iter_channel_slots())
        _LOGGER.debug(
            "[%s] SceneManager setup: processing %d slots across channels",
            self.engine.area_id,
            len(all_slots),
        )

        # Re-detect Hue scenes (union across all channels)
        scene_entities = [
            slot.scene_entity_id for _ch, slot in all_slots if slot.scene_entity_id
        ]
        self.engine.hue_manager.detect_hue_scenes(scene_entities)

        for channel_id, slot in all_slots:
            slot_id = slot.id
            if not slot_id:
                continue

            info = await self._process_slot(channel_id, slot)
            if info is None:
                continue

            self.engine.scene_map[(channel_id, slot_id)] = info

        _LOGGER.info(
            "[%s] SceneManager setup complete. Resolved scenes: %s",
            self.engine.area_id,
            list(self.engine.scene_map.keys()),
        )

        # Check if we need background retry
        incomplete = False
        for key, info in self.engine.scene_map.items():
            if (
                info.scene_type in (SceneType.HUE_SCENE, SceneType.PLAIN_SCENE)
                and not info.extracted_entities
            ):
                incomplete = True
                _LOGGER.warning(
                    "[%s] Scene extraction empty for slot %s. Scheduling background retry.",
                    self.engine.area_id,
                    key,
                )

        if incomplete:
            self.retry_task = self.engine.hass.async_create_background_task(
                self._async_retry_extraction_loop(),
                f"twilight_scene_retry_{self.engine.area_id}",
            )

    async def async_teardown(self) -> None:
        """Tear down scene manager.

        The cancel is awaited: task.cancel() only schedules the CancelledError,
        so without the await the retry loop can still resume once after teardown
        returned and write into the (possibly already replaced) engine's
        scene_map — see docs/agents/ha_internals.md.
        """
        task = self.retry_task
        self.retry_task = None
        if task and not task.done():
            task.cancel()
            await asyncio.gather(task, return_exceptions=True)

    async def _async_retry_extraction_loop(self) -> None:
        """Retry scene extraction in background for incomplete slots."""
        all_slots = list(self._iter_channel_slots())
        retries = 0
        max_retries = SCENE_EXTRACTION_MAX_RETRIES
        retry_interval = SCENE_EXTRACTION_RETRY_INTERVAL

        while retries < max_retries:
            await asyncio.sleep(retry_interval)

            any_resolved = False
            incomplete_slots: list[tuple[str, str, SlotConfig]] = []
            for channel_id, slot in all_slots:
                slot_id = slot.id
                if not slot_id:
                    continue
                scene_entity_id = slot.scene_entity_id
                if not scene_entity_id:
                    continue

                scene_info = self.engine.scene_map.get((channel_id, slot_id))
                if not scene_info or (
                    scene_info.scene_type
                    in (SceneType.HUE_SCENE, SceneType.PLAIN_SCENE)
                    and not scene_info.extracted_entities
                ):
                    incomplete_slots.append((channel_id, slot_id, slot))

            if not incomplete_slots:
                _LOGGER.info(
                    "[%s] All scene extractions successfully resolved",
                    self.engine.area_id,
                )
                break

            _LOGGER.debug(
                "[%s] Retrying scene extraction for slots: %s (attempt %d/%d)",
                self.engine.area_id,
                [(ch, slot_id) for ch, slot_id, _ in incomplete_slots],
                retries + 1,
                max_retries,
            )

            # Re-detect Hue scenes before re-processing. _classify_scene() reads
            # hue_manager.hue_scenes, which was only ever populated during
            # async_setup — a Hue scene whose entity registry entry appeared
            # after boot (Hue integration still starting up) stayed classified
            # as PLAIN_SCENE forever, so extraction kept returning nothing and
            # the slot never got deviation checks, retries, or a fade.
            self.engine.hue_manager.detect_hue_scenes(
                [
                    slot.scene_entity_id
                    for _ch, slot in all_slots
                    if slot.scene_entity_id
                ]
            )

            for channel_id, slot_id, slot in incomplete_slots:
                # Re-processing in case integration registries updated
                info = await self._process_slot(channel_id, slot)
                if info is not None and info.extracted_entities:
                    self.engine.scene_map[(channel_id, slot_id)] = info
                    any_resolved = True
                    _LOGGER.info(
                        "[%s] Successfully extracted scene %s for slot %s/%s on retry",
                        self.engine.area_id,
                        slot.scene_entity_id,
                        channel_id,
                        slot_id,
                    )

            if any_resolved:
                # Open subscriptions build their entity watch-list from scene_map
                # at subscribe-time; without this signal they'd never notice
                # entities extracted after startup (until the next save/re-subscribe).
                async_dispatcher_send(self.hass, SIGNAL_ENGINES_CHANGED)

            retries += 1

        else:
            remaining = []
            for channel_id, slot in all_slots:
                slot_id = slot.id
                if not slot_id:
                    continue
                scene_entity_id = slot.scene_entity_id
                if not scene_entity_id:
                    continue
                scene_info = self.engine.scene_map.get((channel_id, slot_id))
                if not scene_info or (
                    scene_info.scene_type
                    in (SceneType.HUE_SCENE, SceneType.PLAIN_SCENE)
                    and not scene_info.extracted_entities
                ):
                    remaining.append((channel_id, slot_id))

            if remaining:
                _LOGGER.warning(
                    "[%s] Scene extraction timed out for slots %s. Light scenes could not be automatically extracted.",
                    self.engine.area_id,
                    remaining,
                )

    def _classify_scene(self, entity_id: str) -> SceneType:
        """Classify a scene/script entity into a SceneType."""
        if entity_id.startswith("script."):
            return SceneType.SCRIPT

        # Check in HueManager detected list
        if entity_id in self.engine.hue_manager.hue_scenes:
            # Check if smart scene or regular scene
            scene_info = self.engine.hue_manager.hue_scenes.get(entity_id)
            if scene_info:
                api = self.engine.hue_manager.get_bridge_api(
                    scene_info["config_entry_id"]
                )
                if api and hasattr(api, "scenes"):
                    # Lazy import: aiohue is only guaranteed when the Hue
                    # integration is set up (after_dependencies). Importing it at
                    # module level would crash the whole integration on systems
                    # without Hue. Reaching this branch means a Hue scene was
                    # detected, so aiohue should be importable — guard anyway.
                    try:
                        from aiohue.v2.models.smart_scene import SmartScene
                    except ImportError:
                        SmartScene = None

                    unique_id = scene_info["unique_id"]
                    for scene_obj in api.scenes:
                        if getattr(scene_obj, "id", None) == unique_id:
                            if SmartScene is not None and isinstance(
                                scene_obj, SmartScene
                            ):
                                return SceneType.HUE_SMART_SCENE
                            return SceneType.HUE_SCENE
                return SceneType.HUE_SCENE

        return SceneType.PLAIN_SCENE

    def _supports_dynamic(self, entity_id: str) -> bool:
        """Return True if the scene entity supports dynamic palette playback."""
        if entity_id in self.engine.hue_manager.hue_scenes:
            scene_info = self.engine.hue_manager.hue_scenes.get(entity_id)
            if scene_info:
                api = self.engine.hue_manager.get_bridge_api(
                    scene_info["config_entry_id"]
                )
                if api and hasattr(api, "scenes"):
                    unique_id = scene_info["unique_id"]
                    for scene_obj in api.scenes:
                        if getattr(scene_obj, "id", None) == unique_id:
                            return palette_is_dynamic(
                                getattr(scene_obj, "palette", None)
                            )
        return False

    async def _async_extract_scene(
        self, entity_id: str, scene_type: SceneType
    ) -> tuple[frozenset[str], dict[str, Any]]:
        """Extract controlled entities and expected states for a scene."""
        if scene_type == SceneType.PLAIN_SCENE:
            platform = self.hass.data.get("homeassistant_scene")
            scene_entity = platform.entities.get(entity_id) if platform else None
            if (
                scene_entity
                and hasattr(scene_entity, "scene_config")
                and hasattr(scene_entity.scene_config, "states")
            ):
                extracted = {
                    e
                    for e in scene_entity.scene_config.states
                    if e.startswith(("light.", "switch."))
                }
                expected = {
                    e: self._normalize_expected_state(
                        scene_entity.scene_config.states[e]
                    )
                    for e in extracted
                }
                return frozenset(extracted), expected
            return frozenset(), {}

        elif scene_type == SceneType.HUE_SCENE:
            # Fetch the aiohue scene object first so light resolution can use the
            # robust Room → Device → Light traversal and the scene's own actions
            # for expected states. Without scene_data, get_scene_states drops to
            # the HA-state fallback (lights only).
            scene_data = await self.engine.hue_manager.async_get_scene_data(entity_id)
            lights, expected = self.engine.hue_manager.get_scene_states(
                entity_id, scene_data
            )
            return frozenset(lights), expected

        elif scene_type == SceneType.HUE_SMART_SCENE:
            # A Smart Scene is itself time-scheduled and may internally switch to a
            # different sub-scene at any time. The slot may still START it
            # (scene.turn_on fires like for any other scene), but we deliberately
            # extract NO entities/expected states: there is no stable target to
            # diff against, so no deviation watch, no retry, and no anticipatory
            # fade run for it (all gated on extracted_entities). Trying to reconcile
            # lights against a moving target is meaningless — e.g. mid-slot the
            # Smart Scene could pick another sub-scene, which we must not "correct".
            _LOGGER.warning(
                "[%s] Scene %s is a Hue Smart Scene (carries its own schedule): it can be started by a Twilight slot, "
                "but its lights are not reconciled (no deviation/retry/fade) — no entities are extracted.",
                self.engine.area_id,
                entity_id,
            )
            return frozenset(), {}

        # SCRIPT or fallback: no auto-extracted entities or states
        return frozenset(), {}

    @staticmethod
    def _normalize_expected_state(raw: Any) -> dict[str, Any]:
        """Normalize a scene's expected state into a flat attribute dict.

        HA's scene_config.states holds State objects; the Hue path produces flat
        dicts ({"state": ..., "brightness": ...}). Both must end up in the same
        flat format so deviation detection treats PLAIN_SCENE and HUE_SCENE
        identically (see engine_relationships.md §6, "Scene-Semantik").
        """
        if isinstance(raw, dict):
            return raw
        # HA State object: flatten into {"state": ..., **attributes}.
        state_val = getattr(raw, "state", None)
        attributes = getattr(raw, "attributes", {}) or {}
        result: dict[str, Any] = dict(attributes)
        if state_val is not None:
            result["state"] = state_val
        return result
