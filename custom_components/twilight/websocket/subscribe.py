"""Live-push subscription WebSocket command for Twilight."""

from __future__ import annotations

import logging
from collections.abc import Callable
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.const import STATE_OFF, STATE_ON
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.event import async_call_later, async_track_state_change_event

from ..const import (
    DOMAIN,
    PRIMARY_CHANNEL_ID,
    SIGNAL_ENGINES_CHANGED,
    SIGNAL_STATE_CHANGED,
)
from ..deviation import build_light_states, deviated_entities_from_map
from ..engine import TwilightEngine
from ..helpers import channel_entities, is_slot_excluded_effective
from ..state import RunState

_LOGGER = logging.getLogger(__name__)


def _ws_subscribe_all() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/subscribe_all",
        }
    )
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        # Live dict from hass.data — area/save and area/delete mutate it in
        # place, so this closure always sees the current engine set. setdefault
        # (not get) so a first-ever call anchors the same dict object that
        # later area/save calls mutate, instead of a throwaway empty dict.
        engines = hass.data[DOMAIN].setdefault("engines", {})
        cached_areas_data: dict[str, dict[str, Any]] = {}

        def _push(area_ids: set[str]) -> None:
            """Push only the given areas' cached data (delta push)."""
            if not area_ids:
                return
            connection.send_message(
                websocket_api.event_message(
                    msg["id"],
                    {
                        "areas": {
                            area_id: cached_areas_data[area_id]
                            for area_id in area_ids
                            if area_id in cached_areas_data
                        },
                    },
                )
            )

        def _push_all() -> None:
            """Push the full cache — used for the initial snapshot and when the
            engine set itself changes (areas added/removed must be communicated).
            `full: True` tells the frontend to replace its state instead of
            merging, so areas removed from the cache are dropped client-side too.
            """
            connection.send_message(
                websocket_api.event_message(
                    msg["id"],
                    {
                        "areas": cached_areas_data,
                        "full": True,
                    },
                )
            )

        @callback
        def state_listener(
            area_id: str, _old_state: RunState, new_state: RunState
        ) -> None:
            # One global signal for all areas (SIGNAL_STATE_CHANGED carries the
            # area_id in the payload): engine replacement by area/save cannot
            # orphan a per-engine listener, and areas created after this
            # subscription started are covered automatically.
            eng = engines.get(area_id)
            if eng:
                cached_areas_data[area_id] = _build_state_dict(hass, eng, new_state)
                _push({area_id})

        # Track HA state changes for all scene entities of all areas.
        # Map entity_id -> set of area_ids that use/watch it (an entity can
        # appear in multiple slots/channels of the same area, so a set avoids
        # rebuilding that area's state dict once per duplicate occurrence).
        entity_to_areas: dict[str, set[str]] = {}
        unsub_ha: Callable[[], None] | None = None

        # Coalesce bursts of state-changed events (e.g. a scene turning on 50
        # lights at once fires 50 separate events) into a single rebuild/push
        # per affected area instead of one per entity.
        pending_area_ids: set[str] = set()
        debounce_unsub: Callable[[], None] | None = None

        @callback
        def _flush_pending(_now: Any) -> None:
            nonlocal debounce_unsub
            debounce_unsub = None
            to_rebuild = pending_area_ids.copy()
            pending_area_ids.clear()
            area_ids: set[str] = set()
            for area_id in to_rebuild:
                eng = engines.get(area_id)
                if eng:
                    cached_areas_data[area_id] = _build_state_dict(
                        hass, eng, eng.run_state
                    )
                    area_ids.add(area_id)
            _push(area_ids)

        @callback
        def ha_state_listener(event: Any) -> None:
            nonlocal debounce_unsub
            entity_id = event.data.get("entity_id")
            areas = entity_to_areas.get(entity_id)
            if not areas:
                return
            pending_area_ids.update(areas)
            if debounce_unsub is None:
                debounce_unsub = async_call_later(hass, 0.1, _flush_pending)

        def _rebuild_entity_watch() -> None:
            """(Re)build entity_to_areas and its HA listener from current engines."""
            nonlocal unsub_ha
            if unsub_ha:
                unsub_ha()
                unsub_ha = None
            entity_to_areas.clear()
            for area_id, engine in engines.items():
                for slot_info in engine.scene_map.values():
                    for entity_id in (
                        slot_info.extracted_entities | slot_info.configured_entities
                    ):
                        entity_to_areas.setdefault(entity_id, set()).add(area_id)
            if entity_to_areas:
                unsub_ha = async_track_state_change_event(
                    hass, list(entity_to_areas), ha_state_listener
                )

        def _rebuild_cache() -> None:
            """Rebuild the push cache from current engines (drops deleted areas)."""
            cached_areas_data.clear()
            for area_id, engine in engines.items():
                cached_areas_data[area_id] = _build_state_dict(
                    hass, engine, engine.run_state
                )

        @callback
        def engines_changed() -> None:
            # area/save or area/delete created, replaced, or removed an engine
            # (possibly with a new scene_map) — refresh watcher and cache, and
            # push so the frontend learns about new/removed areas immediately.
            _rebuild_entity_watch()
            _rebuild_cache()
            _push_all()

        unsub_state = async_dispatcher_connect(
            hass, SIGNAL_STATE_CHANGED, state_listener
        )
        unsub_engines = async_dispatcher_connect(
            hass, SIGNAL_ENGINES_CHANGED, engines_changed
        )
        _rebuild_entity_watch()

        @callback
        def unsubscribe_all() -> None:
            for unsub in (unsub_state, unsub_engines, unsub_ha, debounce_unsub):
                if not unsub:
                    continue
                try:
                    unsub()
                except Exception:
                    _LOGGER.exception(
                        "Error unsubscribing a twilight/subscribe_all listener"
                    )

        connection.subscriptions[msg["id"]] = unsubscribe_all

        connection.send_result(msg["id"])

        # Populate initial state cache and push
        _rebuild_cache()
        _push_all()

    return handle


def _build_state_dict(
    hass: HomeAssistant, engine: TwilightEngine, state: RunState
) -> dict[str, Any]:
    """Build the JSON-serializable live-state push for the frontend.

    Backend-first: the backend
    resolves each channel's active slot target, scene names, and the full
    per-attribute target/actual/deviates map (light_states), aggregated across
    all channels. The frontend does not compare values.
    """
    scene_active = state.scene_activated_at is not None

    # Resolve the active SlotSceneInfo per channel.
    active_infos: dict[str, Any] = {}
    for channel_id, slot_id in state.active_slots.items():
        info = engine.scene_map.get((channel_id, slot_id))
        if info is not None:
            active_infos[channel_id] = info

    # Per-channel scene names (only while a scene is physically active).
    active_scene_names: dict[str, str] = {}
    if scene_active:
        for channel_id, info in active_infos.items():
            if not info.scene_entity_id:
                continue
            scene_state = hass.states.get(info.scene_entity_id)
            active_scene_names[channel_id] = (
                scene_state.attributes.get("friendly_name") if scene_state else None
            ) or info.scene_entity_id
    # The Primary channel's scene represents the room for the single-value status line.
    active_scene_name = active_scene_names.get(PRIMARY_CHANNEL_ID) or next(
        iter(active_scene_names.values()), None
    )

    # Aggregate expected states across all active channels.
    expected: dict[str, dict[str, Any]] = {}
    for info in active_infos.values():
        expected.update(info.expected_states)

    # A channel whose current slot is excluded from the running slot activity
    # action (activity default or an active Rule override, see
    # helpers.is_slot_excluded_effective) is actively turned off — reflect that
    # as the expected state instead of the slot's own scene, so the panel
    # doesn't show a stale/active scene or flag a false deviation.
    for channel_id, slot_id in state.active_slots.items():
        if not is_slot_excluded_effective(
            engine.config, state, engine.coordinator.rule_manager, channel_id, slot_id
        ):
            continue
        for entity_id in channel_entities(engine.scene_map, channel_id):
            expected[entity_id] = {"state": STATE_OFF}

    light_states = build_light_states(
        hass.states, expected, check_deviations=scene_active
    )

    # Ensure all extracted/configured entities of the active slots appear in light_states,
    # even when expected_states has no entry (scenes without actions, manual turn-off lights).
    active_entities: set[str] = set()
    for info in active_infos.values():
        active_entities |= info.extracted_entities | info.configured_entities
    missing: dict[str, dict[str, Any]] = {
        eid: {} for eid in active_entities if eid not in light_states
    }
    if missing:
        light_states.update(
            build_light_states(hass.states, missing, check_deviations=False)
        )

    all_lights: set[str] = set()
    for s_info in engine.scene_map.values():
        all_lights.update(s_info.extracted_entities)
        all_lights.update(s_info.configured_entities)

    light_list = [
        entity_id
        for entity_id in all_lights
        if entity_id.startswith("light.") or entity_id.startswith("switch.")
    ]
    lights_total = len(light_list)
    lights_on = sum(
        1
        for entity_id in light_list
        if (state_obj := hass.states.get(entity_id)) is not None
        and state_obj.state == STATE_ON
    )

    inputs_push = {}
    for inp in engine.config.inputs:
        if not inp.id:
            continue
        inputs_push[inp.id] = {
            "type": inp.type,
            "active": state.inputs_active.get(inp.id, False),
            "disabled_by": state.inputs_disabled_by.get(inp.id, []),
        }

    return {
        "active_slots": dict(state.active_slots),
        "active_slot_start": state.active_slot_start.isoformat()
        if state.active_slot_start
        else None,
        "scene_activated_at": state.scene_activated_at.isoformat()
        if state.scene_activated_at
        else None,
        "active_activity": state.active_activity,
        "activity_trigger": {
            "input_id": state.activity_trigger.input_id,
            "input_type": state.activity_trigger.input_type,
            "entity_id": state.activity_trigger.entity_id,
            "triggered_at": state.activity_trigger.triggered_at.isoformat(),
        }
        if state.activity_trigger
        else None,
        "activity_expires_at": state.activity_expires_at.isoformat()
        if state.activity_expires_at
        else None,
        "activity_expire_frozen_seconds": state.activity_expire_frozen_seconds,
        "startup_time": state.startup_time,
        "light_states": light_states,
        "deviated_entities": deviated_entities_from_map(light_states)
        if state.scene_activated_at is not None
        else [],
        "active_expected_states": expected,
        "active_scene_name": active_scene_name,
        "active_scene_names": active_scene_names,
        "motion_active": state.motion_active,
        "lux_value": state.lux_value,
        "lights_on": lights_on,
        "lights_total": lights_total,
        "inputs": inputs_push,
        "active_rules": dict(state.active_rules),
    }
