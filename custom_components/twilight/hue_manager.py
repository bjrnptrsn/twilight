"""Hue data layer for Twilight – Bridge access and light resolution."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.const import STATE_OFF, STATE_ON
from homeassistant.helpers import entity_registry as er
from homeassistant.util.color import color_xy_to_RGB

if TYPE_CHECKING:
    from .engine import TwilightEngine

_LOGGER = logging.getLogger(__name__)


class HueManager:
    """Pure Hue data layer – Bridge access, entity mapping, and light resolution."""

    def __init__(self, engine: TwilightEngine) -> None:
        """Initialize the Hue manager."""
        self.engine = engine
        self.hass = engine.hass
        self.hue_scenes: dict[
            str, dict[str, Any]
        ] = {}  # entity_id → {config_entry_id, unique_id}

    def detect_hue_scenes(
        self, scene_entity_ids: list[str]
    ) -> dict[str, dict[str, Any]]:
        """Detect which scene entities belong to the Hue integration."""
        ent_reg = er.async_get(self.hass)
        self.hue_scenes = {}

        for entity_id in scene_entity_ids:
            entry = ent_reg.async_get(entity_id)
            if entry and entry.platform == "hue":
                self.hue_scenes[entity_id] = {
                    "config_entry_id": entry.config_entry_id,
                    "unique_id": entry.unique_id,
                }
                _LOGGER.debug(
                    "[%s] Hue scene detected: %s (unique_id: %s)",
                    self.engine.area_id,
                    entity_id,
                    entry.unique_id,
                )

        _LOGGER.debug(
            "[%s] Detected %d Hue scenes", self.engine.area_id, len(self.hue_scenes)
        )
        return self.hue_scenes

    def get_bridge_api(self, config_entry_id: str) -> Any | None:
        """Return the aiohue bridge API from a Hue config entry's runtime_data."""
        config_entry = self.hass.config_entries.async_get_entry(config_entry_id)
        if not config_entry:
            _LOGGER.warning(
                "[%s] Config entry not found: %s", self.engine.area_id, config_entry_id
            )
            return None
        bridge = getattr(config_entry, "runtime_data", None)
        return getattr(bridge, "api", None) if bridge else None

    def _get_entity_mapping(self, config_entry_id: str, domain: str) -> dict[str, str]:
        """Return mapping of unique_ids to entity_ids for a given domain."""
        ent_reg = er.async_get(self.hass)
        return {
            e.unique_id: e.entity_id
            for e in er.async_entries_for_config_entry(ent_reg, config_entry_id)
            if e.domain == domain and e.unique_id
        }

    def get_entity_mapping(self, config_entry_id: str) -> dict[str, str]:
        """Return mapping of Hue light unique_ids to HA light entity_ids."""
        return self._get_entity_mapping(config_entry_id, "light")

    async def async_get_scene_data(self, entity_id: str) -> Any | None:
        """Fetch the aiohue scene object (Scene or SmartScene) for a Hue scene entity."""
        scene_info = self.hue_scenes.get(entity_id)
        if not scene_info:
            return None

        try:
            api = self.get_bridge_api(scene_info["config_entry_id"])
            if api is None or not hasattr(api, "scenes"):
                _LOGGER.warning(
                    "[%s] Hue bridge API or scenes controller not available for %s",
                    self.engine.area_id,
                    entity_id,
                )
                return None

            unique_id = scene_info["unique_id"]
            for scene in api.scenes:
                if getattr(scene, "id", None) == unique_id:
                    _LOGGER.debug(
                        "[%s] Scene found: %s (id: %s, type: %s)",
                        self.engine.area_id,
                        getattr(scene.metadata, "name", "unnamed"),
                        unique_id,
                        type(scene).__name__,
                    )
                    return scene
        except Exception as err:
            _LOGGER.error(
                "[%s] Exception while fetching Hue scene data for %s: %s",
                self.engine.area_id,
                entity_id,
                err,
            )
            return None

        _LOGGER.warning(
            "[%s] Scene not found for %s (unique_id: %s)",
            self.engine.area_id,
            entity_id,
            unique_id,
        )
        return None

    def get_scene_states(
        self, entity_id: str, scene_data: Any | None = None
    ) -> tuple[list[str], dict[str, dict[str, Any]]]:
        """Resolve light entity_ids and their expected states for a Hue scene.

        Lights come from the Room/Zone → Device → Light traversal; expected
        states (on/off, brightness, color) come from the scene's own actions.
        The expected-state format mirrors PLAIN_SCENE (HA attribute dicts), so
        deviation detection can treat both scene types identically.

        Falls back to HA state attributes (lights only, no expected states)
        when the bridge API is not ready yet.
        """
        if scene_data:
            scene_info = self.hue_scenes.get(entity_id)
            if scene_info:
                lights = self._resolve_lights_from_group(entity_id, scene_data)
                if lights:
                    mapping = self.get_entity_mapping(scene_info["config_entry_id"])
                    states = self._states_from_actions(scene_data, mapping)
                    return lights, states

        return self._lights_from_ha_state(entity_id), {}

    def _resolve_lights_from_group(self, entity_id: str, scene_data: Any) -> list[str]:
        """Traverse aiohue Room/Zone → Device → Light to resolve HA entity_ids."""
        group_ref = getattr(scene_data, "group", None)
        if not group_ref:
            return []

        scene_info = self.hue_scenes.get(entity_id)
        if not scene_info:
            return []

        try:
            api = self.get_bridge_api(scene_info["config_entry_id"])
            if api is None:
                _LOGGER.warning(
                    "[%s] Hue bridge API not available for resolving lights of %s",
                    self.engine.area_id,
                    entity_id,
                )
                return []

            group_id = getattr(group_ref, "rid", None) or getattr(group_ref, "id", None)
            group_obj = self._find_group(api, group_id)
            if not group_obj:
                _LOGGER.debug(
                    "[%s] Group %s not found in bridge controllers",
                    self.engine.area_id,
                    group_id,
                )
                return []

            hue_light_ids = self._children_to_light_ids(api, group_obj)
            if not hue_light_ids:
                _LOGGER.debug(
                    "[%s] No lights resolved from group %s",
                    self.engine.area_id,
                    group_id,
                )
                return []

            mapping = self.get_entity_mapping(scene_info["config_entry_id"])
            lights = [mapping[hid] for hid in hue_light_ids if hid in mapping]
            _LOGGER.info(
                "[%s] Extracted %d lights for scene %s",
                self.engine.area_id,
                len(lights),
                entity_id,
            )
            return lights
        except Exception as err:
            _LOGGER.error(
                "[%s] Exception while resolving lights from group for %s: %s",
                self.engine.area_id,
                entity_id,
                err,
            )
            return []

    def _lights_from_ha_state(self, entity_id: str) -> list[str]:
        """Fallback: extract light entity_ids from HA state attributes."""
        state = self.hass.states.get(entity_id)
        if not state:
            return []
        raw = state.attributes.get("entity_id", [])
        if isinstance(raw, str):
            raw = [raw]
        lights = [e for e in raw if e.startswith("light.")]
        if lights:
            _LOGGER.debug(
                "[%s] HA state fallback: %d lights for %s",
                self.engine.area_id,
                len(lights),
                entity_id,
            )
        return lights

    @staticmethod
    def _find_group(api: Any, group_id: str | None) -> Any | None:
        """Find a Room or Zone object by ID in the aiohue API."""
        if not group_id:
            return None
        for controller_name in ("rooms", "zones", "groups"):
            ctrl = getattr(api, controller_name, None)
            if ctrl is None:
                continue
            group = next((g for g in ctrl if g.id == group_id), None)
            if group:
                return group
        return None

    @staticmethod
    def _children_to_light_ids(api: Any, group_obj: Any) -> list[str]:
        """Resolve group children (Devices → Lights) to Hue light resource IDs."""
        children = getattr(group_obj, "children", [])
        device_ids: list[str] = []
        light_ids: list[str] = []

        for child in children:
            rid = getattr(child, "rid", None) or getattr(child, "id", None)
            rtype_raw = getattr(child, "rtype", getattr(child, "resource_type", ""))
            # Prefer the enum's .value ("device"/"light") over str(enum), which
            # stringifies to "ResourceTypes.DEVICE" — matching "device" against
            # that only works because it happens to be a substring of the
            # fully-qualified enum name, not because of the actual value.
            rtype = str(getattr(rtype_raw, "value", rtype_raw)).lower()
            if rid and rtype == "device":
                device_ids.append(rid)
            elif rid and rtype == "light":
                light_ids.append(rid)

        # Resolve devices → owned lights
        for light in getattr(api, "lights", []):
            owner = getattr(light, "owner", None)
            if owner:
                owner_id = getattr(owner, "rid", None) or getattr(owner, "id", None)
                if owner_id in device_ids:
                    light_ids.append(light.id)

        return light_ids

    @staticmethod
    def _states_from_actions(
        scene_data: Any, mapping: dict[str, str]
    ) -> dict[str, dict[str, Any]]:
        """Build expected-state dicts from a Hue scene's actions.

        Each action targets one light resource; the action carries the desired
        on/off, brightness (Hue 0-100 → HA 0-255), color (xy) and color
        temperature (mirek == mireds). Targets are mapped to HA entity_ids via
        the light unique_id mapping. Targets absent from the mapping are skipped.
        """
        states: dict[str, dict[str, Any]] = {}
        for action in getattr(scene_data, "actions", []) or []:
            target = getattr(action, "target", None)
            rid = getattr(target, "rid", None) if target else None
            if not rid or rid not in mapping:
                continue

            act = getattr(action, "action", None)
            if act is None:
                continue

            state: dict[str, Any] = {}
            on_feat = getattr(act, "on", None)
            if on_feat is not None:
                state["state"] = (
                    STATE_ON if getattr(on_feat, "on", False) else STATE_OFF
                )

            dimming = getattr(act, "dimming", None)
            brightness = getattr(dimming, "brightness", None) if dimming else None
            if brightness is not None:
                raw = round(brightness / 100 * 255)
                is_on = state.get("state") == STATE_ON
                state["brightness"] = max(raw, 1) if is_on and raw == 0 else raw

            color = getattr(act, "color", None)
            xy = getattr(color, "xy", None) if color else None
            if xy is not None:
                x, y = getattr(xy, "x", 0.0), getattr(xy, "y", 0.0)
                # Keep xy for deviation comparison (avoids RGB round-trip drift).
                state["xy_color"] = [x, y]
                # Use HA's own xy→RGB (brightness fixed at 255, like HA does for
                # rgb_color) so our target RGB matches what HA reports for the
                # actual value bit-for-bit — otherwise a different conversion
                # drifts by ±1 and shows a phantom color badge. RGB is display-
                # only; the comparison runs on xy above.
                state["rgb_color"] = list(color_xy_to_RGB(x, y))

            color_temp = getattr(act, "color_temperature", None)
            mirek = getattr(color_temp, "mirek", None) if color_temp else None
            if mirek is not None:
                state["color_temp"] = mirek

            states[mapping[rid]] = state

        return states
