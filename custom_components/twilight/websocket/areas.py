"""Areas CRUD WebSocket commands for Twilight."""

from __future__ import annotations

import asyncio
import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import Context, HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .. import button as twilight_button
from .. import switch as twilight_switch
from ..config_model import AreaConfig
from ..const import (
    CONTEXT_PREFIX,
    DOMAIN,
    MAX_CUSTOM_CHANNELS,
    MAX_SLOTS_PER_CHANNEL,
    PRIMARY_CHANNEL_ID,
    SIGNAL_ENGINES_CHANGED,
    STANDARD_ZONES,
    StartType,
)
from ..engine import TwilightEngine
from ..helpers import channel_entities, detect_channel_collisions, partition_by_domain

_LOGGER = logging.getLogger(__name__)


def _get_area_lock(hass: HomeAssistant, area_id: str) -> asyncio.Lock:
    """Return the per-area asyncio.Lock, serializing save/delete for one area_id."""
    locks: dict[str, asyncio.Lock] = hass.data[DOMAIN].setdefault("area_locks", {})
    return locks.setdefault(area_id, asyncio.Lock())


def _valid_hhmm(value: Any) -> str:
    """Validate a fixed-time string as HH:MM (00:00–23:59)."""
    if not isinstance(value, str) or ":" not in value:
        raise vol.Invalid("fixed_time must be HH:MM")
    try:
        h, m = (int(x) for x in value.split(":", 1))
    except ValueError:
        raise vol.Invalid("fixed_time must be HH:MM") from None
    if not (0 <= h <= 23 and 0 <= m <= 59):
        raise vol.Invalid("fixed_time out of range")
    return f"{h:02d}:{m:02d}"


def _ws_areas_list() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command({vol.Required("type"): "twilight/areas/list"})
    @callback
    def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        store = hass.data[DOMAIN].get("store")
        areas = store.get_areas() if store else {}
        connection.send_result(msg["id"], list(areas.values()))

    return handle


def _ws_area_extracted() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/area/extracted",
            vol.Optional("area_id"): str,
        }
    )
    @callback
    def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        # Per-slot controlled entities from a running engine's scene_map:
        # extracted_entities (from the scene) plus configured_entities (manual).
        # Keyed by "channel/slot" (flat) so existing Object.values() consumers keep
        # working; the value carries channel_id for callers that want to group.
        # With area_id → {"channel/slot": {...}}. Without area_id → all running
        # engines as {area_id: {"channel/slot": {...}}} (used by the overview tiles).
        engines = hass.data[DOMAIN].get("engines", {})

        def _for_engine(engine: TwilightEngine) -> dict[str, dict[str, Any]]:
            out: dict[str, dict[str, Any]] = {}
            for (channel_id, slot_id), slot_info in engine.scene_map.items():
                out[f"{channel_id}/{slot_id}"] = {
                    "channel_id": channel_id,
                    "slot_id": slot_id,
                    "extracted": sorted(slot_info.extracted_entities),
                    "configured": sorted(slot_info.configured_entities),
                }
            return out

        area_id = msg.get("area_id")
        if area_id is not None:
            engine = engines.get(area_id)
            connection.send_result(msg["id"], _for_engine(engine) if engine else {})
        else:
            connection.send_result(
                msg["id"],
                {aid: _for_engine(eng) for aid, eng in engines.items()},
            )

    return handle


def _ws_area_validate() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/area/validate",
            vol.Required("area_id"): str,
        }
    )
    @callback
    def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        # Detect entities controlled by more than one channel of a running engine.
        # Built from the resolved scene_map (covers Hue scenes too) — a soft warning,
        # not a hard block (multi_channel.md §3 #6).
        engine = hass.data[DOMAIN].get("engines", {}).get(msg["area_id"])
        if not engine:
            connection.send_result(msg["id"], {"collisions": {}})
            return

        channels = engine.config.channels
        collisions = detect_channel_collisions(engine.scene_map)
        result = {
            entity_id: {
                "channels": channel_ids,
                "names": [
                    (
                        ch_cfg.name
                        if (ch_cfg := channels.get(ch)) and ch_cfg.name
                        else ch
                    )
                    for ch in channel_ids
                ],
            }
            for entity_id, channel_ids in collisions.items()
        }
        connection.send_result(msg["id"], {"collisions": result})

    return handle


async def _async_turn_off_entities(
    hass: HomeAssistant, area_id: str, entities: set[str]
) -> None:
    """Turn off a set of entities via Home Assistant service calls."""
    lights, switches, others = partition_by_domain(sorted(entities))
    context = Context(id=f"{CONTEXT_PREFIX}{area_id}_channel_cleanup")
    if lights:
        await hass.services.async_call(
            "light", "turn_off", {"entity_id": lights}, context=context
        )
    if switches:
        await hass.services.async_call(
            "switch", "turn_off", {"entity_id": switches}, context=context
        )
    if others:
        await hass.services.async_call(
            "homeassistant", "turn_off", {"entity_id": others}, context=context
        )


def _ws_area_save() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/area/save",
            vol.Required("area_id"): str,
            vol.Optional("name"): str,
            vol.Optional("enabled", default=True): bool,
            vol.Optional("manual_only", default=False): bool,
            vol.Optional("sensors", default=[]): vol.All(
                cv.ensure_list,
                [
                    vol.Schema(
                        {
                            vol.Optional("id"): str,
                            vol.Optional("name"): vol.Any(None, str),
                            vol.Required("type"): vol.In(["illuminance"]),
                            vol.Optional("entity_ids", default=[]): cv.entity_ids,
                            vol.Optional("aggregation"): vol.Any(
                                None, vol.In(["min", "max", "mean", "median"])
                            ),
                        }
                    )
                ],
            ),
            vol.Optional("lux_threshold"): vol.Any(None, vol.Coerce(float)),
            vol.Optional("lux_watch_window"): vol.Any(None, int),
            vol.Optional("transition_on_seconds"): vol.Any(None, int),
            vol.Optional("lux_ignore_active"): vol.Any(None, bool),
            vol.Optional("lux_ignore_scope"): vol.Any(
                None, vol.In(["none", "twilight_slots", "all_slots"])
            ),
            vol.Optional("channels", default=dict): {
                str: {
                    vol.Required("name"): str,
                    vol.Optional("enabled", default=True): bool,
                    vol.Optional("transition_on_seconds"): vol.Any(None, int),
                    vol.Optional("slots", default=[]): vol.All(
                        [
                            {
                                vol.Required("id"): str,
                                vol.Required("name"): str,
                                vol.Optional(
                                    "start_type", default=StartType.ASTRAL.value
                                ): vol.In(
                                    [StartType.ASTRAL.value, StartType.FIXED.value]
                                ),
                                # zone for astral slots (Primary always uses these);
                                # fixed_time "HH:MM" for fixed slots in custom channels.
                                vol.Optional("zone"): vol.Any(
                                    None, vol.In(STANDARD_ZONES)
                                ),
                                vol.Optional("fixed_time"): vol.Any(None, _valid_hhmm),
                                vol.Required("offset_minutes"): int,
                                vol.Optional("scene_entity_id"): vol.Any(
                                    None, cv.entity_id
                                ),
                                vol.Optional(
                                    "configured_entities", default=[]
                                ): cv.entity_ids,
                            }
                        ],
                        # Hard cap so a channel can never exceed the slot limit (the
                        # frontend disables Add at the limit; this is the backstop).
                        vol.Length(max=MAX_SLOTS_PER_CHANNEL),
                    ),
                }
            },
            # Element-level dict guard: the store's _normalize_area_config fills
            # ids/defaults and the engine tolerates missing fields, so the inner
            # shape stays open — but a non-dict entry (e.g. a stray string) is
            # rejected here rather than silently skipped downstream.
            vol.Optional("inputs", default=[]): [dict],
            vol.Optional("activities", default=[]): [dict],
        }
    )
    @websocket_api.require_admin
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        store = hass.data[DOMAIN].get("store")
        if not store:
            connection.send_error(
                msg["id"], "store_not_initialized", "Store not initialized"
            )
            return

        area_id = msg["area_id"]
        channels_in = msg.get("channels", {})
        custom_channel_count = sum(
            1 for ch_id in channels_in if ch_id != PRIMARY_CHANNEL_ID
        )
        if custom_channel_count > MAX_CUSTOM_CHANNELS:
            connection.send_error(
                msg["id"],
                "too_many_channels",
                f"At most {MAX_CUSTOM_CHANNELS} custom channels are allowed",
            )
            return

        config = {
            "area_id": area_id,
            "name": msg.get("name"),
            "enabled": msg.get("enabled", True),
            "manual_only": msg.get("manual_only", False),
            "sensors": msg.get("sensors", []),
            "lux_threshold": msg.get("lux_threshold"),
            "lux_watch_window": msg.get("lux_watch_window"),
            "transition_on_seconds": msg.get("transition_on_seconds"),
            "lux_ignore_active": msg.get("lux_ignore_active"),
            "lux_ignore_scope": msg.get("lux_ignore_scope"),
            "channels": msg.get("channels", {}),
            "inputs": msg.get("inputs", []),
            "activities": msg.get("activities", []),
        }

        async with _get_area_lock(hass, area_id):
            await store.async_save_area(area_id, config)

            # Use the normalized stored config (Primary channel always complete) for the engine.
            saved_area = store.get_area(area_id)

            engines = hass.data[DOMAIN].setdefault("engines", {})
            existing_engine = engines.get(area_id)

            has_slots = any(
                ch.get("slots")
                for ch in (saved_area or {}).get("channels", {}).values()
                if isinstance(ch, dict)
            )

            if saved_area and saved_area.get("enabled") and has_slots:
                initial_state = None
                if existing_engine:
                    initial_state = existing_engine.run_state
                    new_channels = saved_area.get("channels", {})
                    if not isinstance(new_channels, dict):
                        new_channels = {}
                    for ch_id, old_ch in existing_engine.config.channels.items():
                        if old_ch.enabled:
                            new_ch = new_channels.get(ch_id)
                            if not new_ch or not new_ch.get("enabled", True):
                                # Channel was deleted or disabled → turn off entities
                                entities = channel_entities(
                                    existing_engine.scene_map, ch_id
                                )
                                if entities:
                                    await _async_turn_off_entities(
                                        hass, area_id, entities
                                    )

                    await existing_engine.async_teardown()
                    engines.pop(area_id, None)

                engine = TwilightEngine(
                    hass, area_id, saved_area, initial_state=initial_state
                )
                try:
                    await engine.async_setup()
                except Exception:
                    _LOGGER.exception(
                        "[%s] Engine setup failed after area/save — area config is "
                        "persisted but no engine is registered",
                        area_id,
                    )
                    async_dispatcher_send(hass, SIGNAL_ENGINES_CHANGED)
                    connection.send_error(
                        msg["id"], "engine_setup_failed", "Engine setup failed"
                    )
                    return
                engines[area_id] = engine
                await twilight_button.async_sync_button_entities(
                    hass, area_id, engine.config
                )
                await twilight_switch.async_sync_switch_entities(
                    hass, area_id, engine.config
                )
                async_dispatcher_send(hass, SIGNAL_ENGINES_CHANGED)
            else:
                if existing_engine:
                    await existing_engine.async_teardown()
                    engines.pop(area_id, None)
                    async_dispatcher_send(hass, SIGNAL_ENGINES_CHANGED)
                store.save_area_state(area_id, {})
                empty_config = AreaConfig.from_dict({"area_id": area_id})
                await twilight_button.async_sync_button_entities(
                    hass, area_id, empty_config
                )
                await twilight_switch.async_sync_switch_entities(
                    hass, area_id, empty_config
                )

            connection.send_result(msg["id"], saved_area)

    return handle


def _ws_area_delete() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/area/delete",
            vol.Required("area_id"): str,
        }
    )
    @websocket_api.require_admin
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        store = hass.data[DOMAIN].get("store")
        if not store:
            connection.send_error(
                msg["id"], "store_not_initialized", "Store not initialized"
            )
            return

        area_id = msg["area_id"]
        async with _get_area_lock(hass, area_id):
            deleted = await store.async_delete_area(area_id)

            engines = hass.data[DOMAIN].setdefault("engines", {})
            if area_id in engines:
                await engines[area_id].async_teardown()
                engines.pop(area_id, None)
                async_dispatcher_send(hass, SIGNAL_ENGINES_CHANGED)

            empty_config = AreaConfig.from_dict({"area_id": area_id})
            await twilight_button.async_sync_button_entities(
                hass, area_id, empty_config
            )
            await twilight_switch.async_sync_switch_entities(
                hass, area_id, empty_config
            )

        connection.send_result(msg["id"], {"deleted": deleted})

    return handle


def _ws_area_new_draft() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/areas/new_draft",
            vol.Required("area_id"): str,
        }
    )
    @callback
    def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        store = hass.data[DOMAIN].get("store")
        if not store:
            connection.send_error(
                msg["id"], "store_not_initialized", "Store not initialized"
            )
            return
        connection.send_result(msg["id"], store.generate_new_area_draft(msg["area_id"]))

    return handle


def _ws_area_slot_times() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/area/slot_times",
            vol.Required("area_id"): str,
            vol.Optional("date"): str,
        }
    )
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        import datetime as _dt
        import zoneinfo as _zi

        from ..slot_calc import resolve_slot_times
        from ..sun_calc import compute_sun_day_data

        store = hass.data[DOMAIN].get("store")
        if not store:
            connection.send_error(
                msg["id"], "store_not_initialized", "Store not initialized"
            )
            return

        area_id = msg["area_id"]
        area_config = store.get_area(area_id)
        if not area_config:
            connection.send_error(
                msg["id"], "area_not_found", f"Area '{area_id}' not found"
            )
            return

        lat = area_config.get("latitude") or hass.config.latitude
        lon = area_config.get("longitude") or hass.config.longitude
        tz_str = area_config.get("timezone") or hass.config.time_zone

        date_str = msg.get("date")
        if date_str:
            try:
                anchor_d = _dt.date.fromisoformat(date_str)
            except ValueError:
                connection.send_error(
                    msg["id"], "invalid_date", f"Invalid date: {date_str}"
                )
                return
        else:
            anchor_d = _dt.datetime.now(_zi.ZoneInfo(tz_str)).date()

        dates = [(anchor_d + _dt.timedelta(days=i)).isoformat() for i in (-1, 0, 1)]

        def _compute() -> dict[str, Any]:
            channels_res: dict[str, dict[str, list[dict[str, Any]]]] = {}
            channels_config = area_config.get("channels", {})
            for ch_id, ch_cfg in channels_config.items():
                if not isinstance(ch_cfg, dict):
                    continue
                ch_slots = ch_cfg.get("slots", [])
                channels_res[ch_id] = {}
                for d_str in dates:
                    cur_d = _dt.date.fromisoformat(d_str)
                    sun_data = compute_sun_day_data(lat, lon, tz_str, cur_d)
                    channels_res[ch_id][d_str] = resolve_slot_times(ch_slots, sun_data)

            return {
                "area_id": area_id,
                "dates": dates,
                "channels": channels_res,
            }

        result = await hass.async_add_executor_job(_compute)
        connection.send_result(msg["id"], result)

    return handle


def _ws_slot_times_preview() -> websocket_api.WebSocketCommandHandler:
    """Resolve slot start times for an arbitrary (not-yet-saved) slot list.

    Unlike area/slot_times, this isn't bound to an existing area — used by the
    area_template editor in the Settings tab, where slots are edited before an
    area exists. Falls back to the HA instance's own location, matching what a
    new area with no location override would get (see area/slot_times above).
    """

    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/slot_times/preview",
            vol.Required("slots"): list,
            vol.Optional("date"): str,
        }
    )
    @websocket_api.async_response
    async def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        import datetime as _dt

        from ..slot_calc import resolve_slot_times
        from ..sun_calc import compute_sun_day_data

        lat = hass.config.latitude
        lon = hass.config.longitude
        tz_str = hass.config.time_zone

        date_str = msg.get("date")
        if date_str:
            try:
                cur_d = _dt.date.fromisoformat(date_str)
            except ValueError:
                connection.send_error(
                    msg["id"], "invalid_date", f"Invalid date: {date_str}"
                )
                return
        else:
            cur_d = _dt.date.today()

        def _compute() -> dict[str, Any]:
            sun_data = compute_sun_day_data(lat, lon, tz_str, cur_d)
            return {"slots": resolve_slot_times(msg["slots"], sun_data)}

        result = await hass.async_add_executor_job(_compute)
        connection.send_result(msg["id"], result)

    return handle
