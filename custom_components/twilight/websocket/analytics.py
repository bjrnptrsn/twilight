"""Analytics WebSocket command for Twilight."""

from __future__ import annotations

import contextlib
import datetime as dt
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.recorder import get_instance, history
from homeassistant.const import STATE_OFF, STATE_ON
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import DOMAIN, MOTION_ACTIVE_STATES, InputType


def _cstate_ts(s: dict[str, Any]) -> float:
    ts = s.get("lu")
    if ts is None:
        ts = s.get("lc")
    return float(ts) if ts is not None else 0.0


def _ws_analytics_get() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/analytics/get",
            vol.Required("area_id"): str,
            vol.Optional("days", default=1): vol.All(int, vol.Range(min=1, max=365)),
            vol.Optional("binary_only", default=False): bool,
        }
    )
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        store = hass.data[DOMAIN].get("store")
        area = store.get_area(msg["area_id"]) if store else None
        if area is None:
            connection.send_error(
                msg["id"], "not_found", f"Area {msg['area_id']} not found"
            )
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

        states_by_entity: dict[str, list[Any]] = await get_instance(
            hass
        ).async_add_executor_job(
            history.get_significant_states,
            hass,
            start_time,
            end_time,
            entity_ids,
            None,
            True,
            False,
            False,
            False,
            True,
        )

        lux_points: list[list[float]] = []
        brightness_points: list[list[float]] = []
        light_on_points: list[list[float]] = []
        motion_points: list[list[float]] = []

        for light_id in lights:
            if light_id not in states_by_entity:
                continue
            last_state = STATE_OFF
            state_obj = hass.states.get(light_id)
            if state_obj:
                last_state = state_obj.state
            for s in states_by_entity[light_id]:
                ts = _cstate_ts(s)
                current_state = s.get("s", last_state)
                if "s" in s:
                    last_state = s["s"]
                is_on = 1.0 if current_state == STATE_ON else 0.0
                light_on_points.append([ts, is_on])
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

        if not msg.get("binary_only"):
            for lux_sensor in lux_sensors:
                if lux_sensor in states_by_entity:
                    for s in states_by_entity[lux_sensor]:
                        ts = _cstate_ts(s)
                        with contextlib.suppress(ValueError, KeyError, TypeError):
                            lux_points.append([ts, float(s["s"])])

        for motion_sensor in motion_sensors:
            if motion_sensor in states_by_entity:
                for s in states_by_entity[motion_sensor]:
                    ts = _cstate_ts(s)
                    state_str = s.get("s")
                    is_on = state_str in MOTION_ACTIVE_STATES
                    motion_points.append([ts, 1.0 if is_on else 0.0])

        connection.send_result(
            msg["id"],
            {
                "lux": lux_points,
                "brightness": brightness_points,
                "light_on": light_on_points,
                "motion": motion_points,
            },
        )

    return handle
