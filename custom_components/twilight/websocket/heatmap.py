"""Heatmap WebSocket commands for Twilight."""

from __future__ import annotations

import uuid
from collections import OrderedDict
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.util import dt as dt_util

from ..const import DOMAIN, SIGNAL_ENGINES_CHANGED
from ..heatmap import async_compute_heatmap
from ..helpers import get_area_lock

VALID_RESOLUTIONS = ("5m", "10m", "15m", "30m", "60m")
VALID_RANGES = ("1w", "2w", "1m", "3m", "6m")

MAX_HEATMAP_PROFILES = 5

# Mirrors websocket/analytics.py's cache: heatmap/compute is a live-preview
# endpoint re-queried on every tab switch, so a short TTL avoids repeated
# full Recorder scans (up to 6 months) without noticeably staling the chart.
_CACHE_TTL_SECONDS = 60.0
_CACHE_MAX_SIZE = 64


def _ws_heatmap_compute() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/heatmap/compute",
            vol.Required("area_id"): str,
            vol.Optional("resolution", default="15m"): vol.In(VALID_RESOLUTIONS),
            vol.Optional("range", default="2w"): vol.In(VALID_RANGES),
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

        domain_data = hass.data.setdefault(DOMAIN, {})
        cache: OrderedDict[tuple[str, str, str], tuple[float, dict[str, Any]]] = (
            domain_data.setdefault("heatmap_cache", OrderedDict())
        )
        cache_key = (msg["area_id"], msg["resolution"], msg["range"])
        now_ts = dt_util.utcnow().timestamp()
        if cache_key in cache:
            cached_ts, cached_res = cache[cache_key]
            cache.move_to_end(cache_key)
            if now_ts - cached_ts < _CACHE_TTL_SECONDS:
                connection.send_result(msg["id"], cached_res)
                return

        profile = await async_compute_heatmap(
            hass,
            area,
            resolution=msg["resolution"],
            range_str=msg["range"],
        )
        res = profile.to_dict()
        cache[cache_key] = (now_ts, res)
        cache.move_to_end(cache_key)
        if len(cache) > _CACHE_MAX_SIZE:
            cache.popitem(last=False)
        connection.send_result(msg["id"], res)

    return handle


def _ws_heatmap_profile_list() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/heatmap/profile/list",
            vol.Required("area_id"): str,
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

        connection.send_result(msg["id"], area.get("heatmap_profiles", []))

    return handle


def _ws_heatmap_profile_save() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/heatmap/profile/save",
            vol.Required("area_id"): str,
            vol.Required("name"): str,
            vol.Required("resolution"): vol.In(VALID_RESOLUTIONS),
            vol.Required("range"): vol.In(VALID_RANGES),
            vol.Optional("profile_id"): str,
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
        if store is None:
            connection.send_error(
                msg["id"], "not_found", f"Area {msg['area_id']} not found"
            )
            return

        area = store.get_area(msg["area_id"])
        if area is None:
            connection.send_error(
                msg["id"], "not_found", f"Area {msg['area_id']} not found"
            )
            return

        # The Recorder scan (up to 6 months, seconds of executor work) runs
        # outside the area lock — holding get_area_lock() across it would
        # block a concurrent area/save or area/delete for this area for the
        # scan's full duration. The area config it reads (motion sensors) is
        # re-read fresh under the lock below before writing, so a concurrent
        # save landing mid-scan doesn't get silently overwritten.
        profile = await async_compute_heatmap(
            hass,
            area,
            resolution=msg["resolution"],
            range_str=msg["range"],
        )

        async with get_area_lock(hass, msg["area_id"]):
            area = store.get_area(msg["area_id"])
            if area is None:
                connection.send_error(
                    msg["id"], "not_found", f"Area {msg['area_id']} not found"
                )
                return

            profiles = list(area.get("heatmap_profiles", []))
            profile_id = msg.get("profile_id") or f"prof_{uuid.uuid4().hex[:8]}"

            existing_idx = -1
            created_at = dt_util.utcnow().isoformat()
            for idx, p in enumerate(profiles):
                if isinstance(p, dict) and p.get("id") == profile_id:
                    existing_idx = idx
                    if p.get("created_at"):
                        created_at = p["created_at"]
                    break

            if existing_idx < 0 and len(profiles) >= MAX_HEATMAP_PROFILES:
                connection.send_error(
                    msg["id"],
                    "limit_exceeded",
                    f"Maximum {MAX_HEATMAP_PROFILES} heatmap profiles allowed per area",
                )
                return

            now_iso = dt_util.utcnow().isoformat()
            prof_dict: dict[str, Any] = {
                "id": profile_id,
                "name": msg["name"],
                "resolution": msg["resolution"],
                "range": msg["range"],
                "created_at": created_at,
                "updated_at": now_iso,
                "motion_buckets": profile.motion_buckets,
                "motion_presence_buckets": profile.motion_presence_buckets,
            }

            if existing_idx >= 0:
                profiles[existing_idx] = prof_dict
            else:
                profiles.append(prof_dict)

            area["heatmap_profiles"] = profiles
            await store.async_save_area(msg["area_id"], area)
            async_dispatcher_send(hass, SIGNAL_ENGINES_CHANGED)

        connection.send_result(msg["id"], prof_dict)

    return handle


def _ws_heatmap_profile_delete() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/heatmap/profile/delete",
            vol.Required("area_id"): str,
            vol.Required("profile_id"): str,
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
        if store is None:
            connection.send_error(
                msg["id"], "not_found", f"Area {msg['area_id']} not found"
            )
            return

        async with get_area_lock(hass, msg["area_id"]):
            area = store.get_area(msg["area_id"])
            if area is None:
                connection.send_error(
                    msg["id"], "not_found", f"Area {msg['area_id']} not found"
                )
                return

            profiles = [
                p
                for p in area.get("heatmap_profiles", [])
                if isinstance(p, dict) and p.get("id") != msg["profile_id"]
            ]
            area["heatmap_profiles"] = profiles

            for act in area.get("activities", []):
                if not isinstance(act, dict):
                    continue
                action = act.get("action")
                if (
                    isinstance(action, dict)
                    and action.get("type") == "simulation"
                    and action.get("heatmap_profile_id") == msg["profile_id"]
                ):
                    action["heatmap_profile_id"] = None

            await store.async_save_area(msg["area_id"], area)
            async_dispatcher_send(hass, SIGNAL_ENGINES_CHANGED)

        connection.send_result(msg["id"], {"success": True})

    return handle
