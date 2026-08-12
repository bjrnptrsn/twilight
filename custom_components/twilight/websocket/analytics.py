"""Analytics WebSocket command for Twilight."""

from __future__ import annotations

import contextlib
import datetime as dt
from collections import OrderedDict
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.recorder import get_instance, history
from homeassistant.const import STATE_ON
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import DOMAIN, MOTION_ACTIVE_STATES, InputType
from ..helpers import recorder_state_ts

_CACHE_TTL_SECONDS = 60.0
_CACHE_MAX_SIZE = 64


def _query_and_parse_analytics(
    hass: HomeAssistant,
    start_time: dt.datetime,
    end_time: dt.datetime,
    entity_ids: list[str],
    lights: set[str],
    lux_sensors: list[str],
    motion_sensors: list[str],
    binary_only: bool,
) -> dict[str, list[list[float]]]:
    """Query significant states and parse them into chart points.

    Runs entirely in the executor: both the recorder query and the parsing of
    its (potentially large, full-attribute) result stay in the worker thread,
    so the raw rows never have to be shipped back across the executor/loop
    boundary before being reduced to a handful of chart points.
    """
    states_by_entity: dict[str, list[Any]] = history.get_significant_states(
        hass,
        start_time,
        end_time,
        entity_ids=entity_ids,
        filters=None,
        include_start_time_state=True,
        significant_changes_only=True,
        minimal_response=False,
        # Attributes (brightness) are only needed for the non-binary detail
        # view — binary_only (the heatmap's own request shape) only reads
        # on/off state, so skip loading them from the state_attributes join.
        no_attributes=binary_only,
        compressed_state_format=True,
    )

    lux_points: list[list[float]] = []
    brightness_points: list[list[float]] = []
    light_on_points: list[list[float]] = []
    motion_points: list[list[float]] = []

    for light_id in lights:
        if light_id not in states_by_entity:
            continue
        # significant_changes_only=True + compressed_state_format=True
        # guarantees every compressed row carries "s" (HA-Core's
        # row_to_compressed_state sets it unconditionally) — no last-known-
        # state fallback is ever needed here.
        for s in states_by_entity[light_id]:
            ts = recorder_state_ts(s)
            is_on = 1.0 if s.get("s") == STATE_ON else 0.0
            light_on_points.append([ts, is_on])
            if binary_only:
                continue
            brightness_val = (
                s.get("a", {}).get("brightness")
                if isinstance(s.get("a"), dict)
                else None
            )
            if brightness_val is not None:
                with contextlib.suppress(ValueError, TypeError):
                    brightness_points.append(
                        [ts, round(float(brightness_val) / 255.0 * 100.0, 1)]
                    )

    if not binary_only:
        for lux_sensor in lux_sensors:
            if lux_sensor in states_by_entity:
                for s in states_by_entity[lux_sensor]:
                    ts = recorder_state_ts(s)
                    with contextlib.suppress(ValueError, KeyError, TypeError):
                        lux_points.append([ts, float(s["s"])])

    for motion_sensor in motion_sensors:
        if motion_sensor in states_by_entity:
            for s in states_by_entity[motion_sensor]:
                ts = recorder_state_ts(s)
                state_str = s.get("s")
                is_on = state_str in MOTION_ACTIVE_STATES
                motion_points.append([ts, 1.0 if is_on else 0.0])

    return {
        "lux": lux_points,
        "brightness": brightness_points,
        "light_on": light_on_points,
        "motion": motion_points,
    }


def _ws_analytics_get() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/analytics/get",
            vol.Required("area_id"): str,
            vol.Optional("days", default=1): vol.All(int, vol.Range(min=1, max=180)),
            vol.Optional("binary_only", default=False): bool,
        }
    )
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        domain_data = hass.data.setdefault(DOMAIN, {})
        cache: OrderedDict[tuple[str, int, bool], tuple[float, dict[str, Any]]] = (
            domain_data.setdefault("analytics_cache", OrderedDict())
        )

        store = domain_data.get("store")
        area = store.get_area(msg["area_id"]) if store else None
        if area is None:
            connection.send_error(
                msg["id"], "not_found", f"Area {msg['area_id']} not found"
            )
            return

        cache_key = (msg["area_id"], msg["days"], bool(msg.get("binary_only")))
        now_ts = dt_util.utcnow().timestamp()
        if cache_key in cache:
            cached_ts, cached_res = cache[cache_key]
            cache.move_to_end(cache_key)
            if now_ts - cached_ts < _CACHE_TTL_SECONDS:
                connection.send_result(msg["id"], cached_res)
                return

        end_time = dt_util.utcnow()
        start_time = end_time - dt.timedelta(days=msg["days"])

        lux_sensors: list[str] = []
        for s in area.get("sensors", []):
            if isinstance(s, dict) and s.get("type") == "illuminance":
                lux_sensors.extend(s.get("entity_ids", []))
        motion_sensors: list[str] = [
            ent
            for inp in area.get("inputs", [])
            if isinstance(inp, dict) and inp.get("type") == InputType.MOTION
            for ent in inp.get("entity_ids", [])
            if ent
        ]

        engine = hass.data[DOMAIN].get("engines", {}).get(msg["area_id"])
        lights: set[str] = set()
        if engine and hasattr(engine, "scene_map"):
            for slot_info in engine.scene_map.values():
                lights.update(slot_info.extracted_entities)
                lights.update(slot_info.configured_entities)
        else:
            for channel in area.get("channels", {}).values():
                if not isinstance(channel, dict):
                    continue
                for slot in channel.get("slots", []):
                    lights.update(slot.get("configured_entities", []))

        entity_ids: list[str] = []
        if not msg.get("binary_only"):
            entity_ids.extend(lux_sensors)
        entity_ids.extend(motion_sensors)
        entity_ids.extend(lights)

        if not entity_ids:
            connection.send_result(
                msg["id"], {"lux": [], "brightness": [], "light_on": [], "motion": []}
            )
            return

        try:
            recorder_inst = get_instance(hass)
        except Exception:
            connection.send_error(
                msg["id"],
                "recorder_unavailable",
                "Recorder integration is not configured or running",
            )
            return

        res = await recorder_inst.async_add_executor_job(
            _query_and_parse_analytics,
            hass,
            start_time,
            end_time,
            entity_ids,
            lights,
            lux_sensors,
            motion_sensors,
            bool(msg.get("binary_only")),
        )
        cache[cache_key] = (now_ts, res)
        cache.move_to_end(cache_key)
        if len(cache) > _CACHE_MAX_SIZE:
            cache.popitem(last=False)
        connection.send_result(msg["id"], res)

    return handle
