"""Heatmap WebSocket commands for Twilight."""

from __future__ import annotations

import uuid
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from ..const import DOMAIN
from ..heatmap import async_compute_heatmap
from ..helpers import get_area_lock

VALID_RESOLUTIONS = ("1m", "5m", "10m", "15m", "30m", "60m")
VALID_SAVED_RESOLUTIONS = ("5m", "10m", "15m", "30m", "60m")
VALID_RANGES = ("1w", "2w", "1m", "3m", "6m")

MAX_HEATMAP_PROFILES = 5


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

        profile = await async_compute_heatmap(
            hass,
            area,
            resolution=msg["resolution"],
            range_str=msg["range"],
        )
        connection.send_result(msg["id"], profile.to_dict())

    return handle


def _ws_heatmap_profile_save() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/heatmap/profile/save",
            vol.Required("area_id"): str,
            vol.Required("name"): str,
            vol.Required("resolution"): vol.In(VALID_SAVED_RESOLUTIONS),
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

            profile = await async_compute_heatmap(
                hass,
                area,
                resolution=msg["resolution"],
                range_str=msg["range"],
            )

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

        connection.send_result(msg["id"], {"success": True})

    return handle
