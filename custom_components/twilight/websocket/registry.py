"""Registry/Lab WebSocket commands for Twilight."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import area_registry as ar
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er

from ..scene_manager import palette_is_dynamic

_LAB_ENTITY_DOMAINS = {"light", "switch", "scene", "script"}


def _ws_area_registry_list() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {vol.Required("type"): "twilight/area_registry/list"}
    )
    @callback
    def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        registry = ar.async_get(hass)
        areas = [
            {"area_id": entry.id, "name": entry.name, "picture": entry.picture}
            for entry in registry.areas.values()
        ]
        connection.send_result(msg["id"], areas)

    return handle


def _ws_lab_area_entities() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/lab/area_entities",
            vol.Required("area_id"): str,
        }
    )
    @callback
    def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        area_id = msg["area_id"]
        ent_reg = er.async_get(hass)
        dev_reg = dr.async_get(hass)

        area_device_ids = {
            dev.id for dev in dev_reg.devices.values() if dev.area_id == area_id
        }

        entities = []
        for entry in ent_reg.entities.values():
            domain = entry.entity_id.split(".")[0]
            if domain not in _LAB_ENTITY_DOMAINS:
                continue
            if entry.disabled_by is not None:
                continue
            state = hass.states.get(entry.entity_id)
            friendly_name = (
                (state.attributes.get("friendly_name") if state else None)
                or entry.name
                or entry.original_name
                or entry.entity_id
            )
            in_area = entry.area_id == area_id or (
                entry.area_id is None and entry.device_id in area_device_ids
            )

            scene_type = None
            supports_dynamic = False
            scene_speed = None
            if domain == "script":
                scene_type = "SCRIPT"
            elif domain == "scene":
                if entry.platform == "hue":
                    scene_type = "HUE_SCENE"
                    config_entry = (
                        hass.config_entries.async_get_entry(entry.config_entry_id)
                        if entry.config_entry_id
                        else None
                    )
                    bridge = getattr(config_entry, "runtime_data", None) if config_entry else None
                    api = getattr(bridge, "api", None) if bridge else None
                    if api and hasattr(api, "scenes"):
                        try:
                            from aiohue.v2.models.smart_scene import SmartScene
                        except ImportError:
                            SmartScene = None
                        unique_id = entry.unique_id
                        for scene_obj in api.scenes:
                            if getattr(scene_obj, "id", None) == unique_id:
                                if SmartScene is not None and isinstance(
                                    scene_obj, SmartScene
                                ):
                                    scene_type = "HUE_SMART_SCENE"
                                else:
                                    supports_dynamic = palette_is_dynamic(
                                        getattr(scene_obj, "palette", None)
                                    )
                                    if supports_dynamic:
                                        # aiohue reports speed as 0.0-1.0, the
                                        # hue.activate_scene service takes 0-100.
                                        raw_speed = getattr(scene_obj, "speed", None)
                                        if isinstance(raw_speed, (int, float)):
                                            scene_speed = round(raw_speed * 100)
                                break
                    elif state and "is_active" in state.attributes and "is_dynamic" not in state.attributes:
                        scene_type = "HUE_SMART_SCENE"
                else:
                    scene_type = "PLAIN_SCENE"

            entities.append(
                {
                    "entity_id": entry.entity_id,
                    "name": friendly_name,
                    "domain": domain,
                    "in_area": in_area,
                    "scene_type": scene_type,
                    "supports_dynamic": supports_dynamic,
                    "scene_speed": scene_speed,
                }
            )

        entities.sort(key=lambda e: (not e["in_area"], str(e["name"]).lower()))
        connection.send_result(msg["id"], entities)

    return handle
