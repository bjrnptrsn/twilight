"""Twilight configuration and state persistence store using Home Assistant Storage."""

from __future__ import annotations

import asyncio
import copy
import logging
import secrets
from enum import StrEnum
from typing import Any, cast

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .config_model import (
    _ACTION_CONFIG_TYPES,
    _INPUT_CONFIG_TYPES,
    _SENSOR_CONFIG_TYPES,
    ActionConfig,
    ActivityConfig,
    InputConfig,
    RuleConfig,
    SensorConfig,
)
from .const import (
    BACKUP_VERSION,
    DEFAULT_AREA_TEMPLATE,
    PRIMARY_CHANNEL_ID,
    STANDARD_ZONES,
    STORAGE_VERSION,
    ActionType,
    AggregationMode,
    RetriggerMode,
    StartType,
    default_channels,
    materialize_primary_slots,
)

_LOGGER = logging.getLogger(__name__)

STORAGE_KEY = "twilight"

# Top-level area keys managed as plain values (vs. the structured "channels"/
# "inputs"/"activities"/"_state" handled separately by _normalize_area_config).
# Maps each key to its const.py default, used to both prune unknown/renamed
# keys and backfill missing ones on every load — the single source of truth
# for what a valid Area config's flat fields look like.
AREA_DEFAULTS: dict[str, Any] = {
    "area_id": None,
    "name": "",
    "enabled": True,
    "manual_only": False,
    "lux_threshold": None,
    "lux_watch_window": None,
    "transition_on_seconds": None,
    "lux_ignore_active": None,
    "lux_ignore_scope": None,
}
AREA_STRUCTURED_KEYS = frozenset(
    {
        "channels",
        "inputs",
        "activities",
        "sensors",
        "rules",
        "heatmap_profiles",
        "_state",
    }
)

# Global config keys, mapped to their const.py default. Single source of
# truth for pruning unknown/renamed keys and backfilling missing ones.
GLOBAL_DEFAULTS: dict[str, Any] = {
    "area_template": DEFAULT_AREA_TEMPLATE,
}


def _prune_and_default(
    config: dict[str, Any],
    defaults: dict[str, Any],
    *,
    keep: frozenset[str] = frozenset(),
) -> bool:
    """Whitelist-prune unknown/renamed keys, backfill missing ones with their default.

    `keep` lists additional keys to leave untouched (e.g. structured sub-trees
    normalized elsewhere, or identifying fields with no static default).
    """
    modified = False
    allowed = defaults.keys() | keep
    for key in list(config):
        if key not in allowed:
            del config[key]
            modified = True
    for key, default in defaults.items():
        if key not in config or (config[key] is None and default is not None):
            config[key] = copy.deepcopy(default)
            modified = True
    return modified


def _normalize_channels(config: dict[str, Any]) -> bool:
    """Ensure the area has a well-formed channels dict, return True if modified.

    Guarantees:
      - a "channels" dict exists with a complete Primary channel
      - Primary slots are stored as a sparse dict keyed by standard zone ID, containing
        only non-default overrides (offset_minutes != 0, scene_entity_id set, or configured_entities non-empty)
      - custom channels keep their free slot lists; slots get start_type
        defaulted to astral and configured_entities defaulted to []
    """
    modified = False

    channels = config.get("channels")
    if not isinstance(channels, dict):
        channels = {}
        config["channels"] = channels
        modified = True

    for _ch_id, channel in channels.items():
        if isinstance(channel, dict) and "transition_on_seconds" not in channel:
            channel["transition_on_seconds"] = None
            modified = True

    # --- Primary channel: sparse dict for non-default zone overrides ---
    primary = channels.get(PRIMARY_CHANNEL_ID)
    if not isinstance(primary, dict):
        primary = {"name": "Primary", "enabled": True, "slots": {}}
        channels[PRIMARY_CHANNEL_ID] = primary
        modified = True

    existing_primary_slots = cast(Any, primary.get("slots"))
    new_sparse_slots = normalize_primary_slots_sparse(existing_primary_slots)

    if (
        not isinstance(existing_primary_slots, dict)
        or new_sparse_slots != existing_primary_slots
    ):
        primary["slots"] = new_sparse_slots
        modified = True
    if primary.get("enabled") is not True:
        primary["enabled"] = True
        modified = True
    if not primary.get("name"):
        primary["name"] = "Primary"
        modified = True

    # --- Custom channels: default start_type / configured_entities / stable ID / canonical order ---
    return _normalize_custom_channels(channels) or modified


def normalize_primary_slots_sparse(
    raw_slots: dict[str, Any] | list[dict[str, Any]] | None,
) -> dict[str, dict[str, Any]]:
    """Normalize raw primary slots (dict or list) into a sparse override dict."""
    override_by_zone: dict[str, dict[str, Any]] = {}
    if isinstance(raw_slots, list):
        for slot in raw_slots:
            if not isinstance(slot, dict):
                continue
            zone = slot.get("zone") or slot.get("id")
            if isinstance(zone, str) and zone in STANDARD_ZONES:
                override_by_zone[zone] = slot
    elif isinstance(raw_slots, dict):
        for zone, slot in raw_slots.items():
            if (
                isinstance(zone, str)
                and zone in STANDARD_ZONES
                and isinstance(slot, dict)
            ):
                override_by_zone[zone] = slot

    new_sparse_slots: dict[str, dict[str, Any]] = {}
    for zone in STANDARD_ZONES:
        src = override_by_zone.get(zone)
        if not src or not isinstance(src, dict):
            continue

        offset_mins = src.get("offset_minutes")
        scene_id = src.get("scene_entity_id")
        entities = src.get("configured_entities")

        # Prune defaults: offset=0, scene_entity_id=None, configured_entities=[]
        zone_override: dict[str, Any] = {}
        if isinstance(offset_mins, (int, float)) and int(offset_mins) != 0:
            zone_override["offset_minutes"] = int(offset_mins)
        if isinstance(scene_id, str) and scene_id.strip():
            zone_override["scene_entity_id"] = scene_id
        if isinstance(entities, (list, tuple)) and len(entities) > 0:
            zone_override["configured_entities"] = list(entities)
        if src.get("hue_activate_dynamic"):
            zone_override["hue_activate_dynamic"] = True
        speed = src.get("hue_dynamic_speed")
        if isinstance(speed, (int, float)):
            zone_override["hue_dynamic_speed"] = int(speed)

        if zone_override:
            new_sparse_slots[zone] = zone_override

    return new_sparse_slots


def _normalize_custom_channels(channels: dict[str, Any]) -> bool:
    """Default start_type / configured_entities / stable ID / canonical order for custom channels."""
    modified = False
    existing_slot_ids: set[str] = set(STANDARD_ZONES)
    for _ch_id, channel in channels.items():
        if not isinstance(channel, dict):
            continue
        for s in channel.get("slots", []):
            if isinstance(s, dict) and isinstance(s.get("id"), str) and s["id"]:
                existing_slot_ids.add(s["id"])

    for ch_id, channel in channels.items():
        if ch_id == PRIMARY_CHANNEL_ID or not isinstance(channel, dict):
            continue
        if "enabled" not in channel:
            channel["enabled"] = True
            modified = True
        slots = channel.get("slots")
        if not isinstance(slots, list):
            # Only the Primary channel's "slots" may be a dict (materialized
            # from STANDARD_ZONES); the WS schema doesn't distinguish channel
            # types, so a non-UI client sending a dict for a custom channel
            # ends up here instead of being rejected.
            if slots is not None:
                _LOGGER.warning(
                    "Channel %r: 'slots' must be a list, got %s — resetting to "
                    "an empty list",
                    ch_id,
                    type(slots).__name__,
                )
            channel["slots"] = []
            modified = True
            continue

        astral_slots: list[dict[str, Any]] = []
        fixed_slots: list[dict[str, Any]] = []

        for slot in slots:
            if not isinstance(slot, dict):
                continue

            # Assign stable custom_ ID if missing or draft_ ID
            slot_id = slot.get("id")
            if (
                not slot_id
                or not isinstance(slot_id, str)
                or slot_id.startswith("draft_")
            ):
                candidate = f"custom_{secrets.token_hex(4)}"
                while candidate in existing_slot_ids:
                    candidate = f"custom_{secrets.token_hex(4)}"
                existing_slot_ids.add(candidate)
                slot["id"] = candidate
                modified = True

            if not slot.get("start_type"):
                slot["start_type"] = StartType.ASTRAL.value
                modified = True
            if "configured_entities" not in slot:
                slot["configured_entities"] = []
                modified = True

            start_type = slot.get("start_type")
            if start_type == StartType.FIXED.value or start_type == "fixed":
                fixed_slots.append(slot)
            else:
                astral_slots.append(slot)

        # Sun-Event-Slots first, sorted by STANDARD_ZONES index
        def _zone_key(s: dict[str, Any]) -> int:
            z = s.get("zone") or s.get("id")
            if isinstance(z, str) and z in STANDARD_ZONES:
                return STANDARD_ZONES.index(z)
            return 99

        astral_slots.sort(key=_zone_key)
        reordered_slots = astral_slots + fixed_slots

        if reordered_slots != slots:
            channel["slots"] = reordered_slots
            modified = True

    return modified


def _normalize_typed_choice(
    inp: dict[str, Any], key: str, enum_cls: type[StrEnum]
) -> bool:
    """Backfill a missing enum-valued key to None, and reset invalid values.

    A missing key becomes `None`; an unknown/typo'd value (e.g. hand-edited
    config) also resets to `None` so the field's resolve_*() helper falls
    through to its const default. Returns whether the dict was modified.
    """
    if key not in inp:
        inp[key] = None
        return True
    if inp[key] is not None and inp[key] not in tuple(enum_cls):
        inp[key] = None
        return True
    return False


def _normalize_input(inp: dict[str, Any], existing_ids: set[str]) -> bool:
    """Normalize a single input dict (id, entity_ids, retrigger/aggregation, button fields).

    `existing_ids` is shared across all inputs in the area and mutated in place
    so auto-generated IDs stay unique within the batch.
    """
    modified = False

    if "type" not in inp:
        inp["type"] = "motion"
        modified = True

    # Ensure it has a unique id
    raw_id = inp.get("id")
    if not raw_id or raw_id in existing_ids:
        inp_type = inp.get("type", "motion")
        candidate = f"{inp_type}_{secrets.token_hex(4)}"
        while candidate in existing_ids:
            candidate = f"{inp_type}_{secrets.token_hex(4)}"
        existing_ids.add(candidate)
        inp["id"] = candidate
        modified = True
    else:
        existing_ids.add(raw_id)

    inp_type = inp.get("type")
    subclass = (
        _INPUT_CONFIG_TYPES.get(inp_type, InputConfig)
        if isinstance(inp_type, str)
        else InputConfig
    )
    modified = subclass.prune_and_default(inp, keep={"id"}) or modified

    # Normalization of re-trigger (motion) / aggregation (binary) options
    if inp_type == "motion":
        modified = _normalize_typed_choice(inp, "retrigger", RetriggerMode) or modified
    elif inp_type == "binary":
        # Migrate the removed "majority" mode to an equivalent "count": a strict
        # majority of N entities is floor(N/2) + 1. Frozen at migration time
        # against the current entity_ids (majority auto-tracked entity count; the
        # migrated count does not). Done before _normalize_typed_choice, which
        # would otherwise reset the unknown value to None (→ silent "any").
        if inp.get("aggregation") == "majority":
            n_entities = len(inp.get("entity_ids") or [])
            inp["aggregation"] = AggregationMode.COUNT.value
            inp["aggregation_count"] = n_entities // 2 + 1 if n_entities else 1
            modified = True
        modified = (
            _normalize_typed_choice(inp, "aggregation", AggregationMode) or modified
        )
        count = inp.get("aggregation_count")
        count_invalid = count is not None and (not isinstance(count, int) or count < 1)
        if count_invalid:
            inp["aggregation_count"] = None
            modified = True

    return modified


def _normalize_activity(act: dict[str, Any], existing_ids: set[str]) -> bool:
    """Normalize a single activity dict (id, name, auto_expire, suppress_inputs, action/release_action)."""
    modified = False

    raw_id = act.get("id")
    if not raw_id or raw_id in existing_ids:
        candidate = f"activity_{secrets.token_hex(4)}"
        while candidate in existing_ids:
            candidate = f"activity_{secrets.token_hex(4)}"
        existing_ids.add(candidate)
        act["id"] = candidate
        modified = True
    else:
        existing_ids.add(raw_id)

    modified = ActivityConfig.prune_and_default(act, keep={"id"}) or modified

    if not isinstance(act.get("suppress_inputs"), list):
        act["suppress_inputs"] = []
        modified = True

    for action_key in ("action", "release_action"):
        action_raw = act.get(action_key)
        if isinstance(action_raw, dict):
            if "type" not in action_raw:
                action_raw["type"] = None
                modified = True
            action_type = action_raw.get("type")
            action_cls = (
                _ACTION_CONFIG_TYPES.get(action_type, ActionConfig)
                if isinstance(action_type, str)
                else ActionConfig
            )
            modified = action_cls.prune_and_default(action_raw) or modified

    return modified


def _normalize_sensor(sensor: dict[str, Any], existing_ids: set[str]) -> bool:
    """Normalize a single sensor dict (id, entity_ids, aggregation)."""
    modified = False

    raw_id = sensor.get("id")
    if not raw_id or raw_id in existing_ids:
        s_type = sensor.get("type", "illuminance")
        candidate = f"{s_type}_{secrets.token_hex(4)}"
        while candidate in existing_ids:
            candidate = f"{s_type}_{secrets.token_hex(4)}"
        existing_ids.add(candidate)
        sensor["id"] = candidate
        modified = True
    else:
        existing_ids.add(raw_id)

    if "type" not in sensor:
        sensor["type"] = "illuminance"
        modified = True

    s_type = sensor.get("type")
    subclass = (
        _SENSOR_CONFIG_TYPES.get(s_type, SensorConfig)
        if isinstance(s_type, str)
        else SensorConfig
    )
    modified = subclass.prune_and_default(sensor, keep={"id"}) or modified

    if not isinstance(sensor.get("entity_ids"), list):
        sensor["entity_ids"] = []
        modified = True

    if s_type == "illuminance" and sensor.get("aggregation") is not None:
        valid_modes = ("min", "max", "mean", "median")
        if sensor["aggregation"] not in valid_modes:
            sensor["aggregation"] = None
            modified = True

    return modified


def _normalize_rule(rule: dict[str, Any], existing_ids: set[str]) -> bool:
    """Normalize a single rule dict (id, name, enabled, applied_activities, excluded_slots_override).

    Trigger inputs are configured on the input side (InputConfig.rule), not here —
    a rule never lists its own trigger inputs.
    """
    modified = False

    raw_id = rule.get("id")
    if not raw_id or raw_id in existing_ids:
        candidate = f"rule_{secrets.token_hex(4)}"
        while candidate in existing_ids:
            candidate = f"rule_{secrets.token_hex(4)}"
        existing_ids.add(candidate)
        rule["id"] = candidate
        modified = True
    else:
        existing_ids.add(raw_id)

    modified = RuleConfig.prune_and_default(rule, keep={"id"}) or modified

    if not isinstance(rule.get("applied_activities"), list):
        rule["applied_activities"] = []
        modified = True
    if not isinstance(rule.get("excluded_slots_override"), dict):
        rule["excluded_slots_override"] = {}
        modified = True
    if not isinstance(rule.get("suppressed_inputs_override"), list):
        rule["suppressed_inputs_override"] = []
        modified = True

    return modified


def _normalize_config_lists(config: dict[str, Any]) -> bool:
    """Normalize the inputs/activities/sensors/rules lists of an area or area_template.

    Shared by _normalize_area_config and the area_template normalization so both
    backfill the same input/activity/sensor/rule defaults (retrigger, trigger_time,
    auto_expire, stable ids, …).
    """
    modified = False

    # 1. Normalize inputs
    inputs = config.get("inputs", [])
    if not isinstance(inputs, list):
        inputs = []
        config["inputs"] = inputs
        modified = True

    existing_ids: set[str] = set()
    for inp in inputs:
        if not isinstance(inp, dict):
            continue
        modified = _normalize_input(inp, existing_ids) or modified

    # 2. Normalize activities
    activities = config.get("activities", [])
    if not isinstance(activities, list):
        activities = []
        config["activities"] = activities
        modified = True

    existing_activity_ids: set[str] = set()
    for act in activities:
        if not isinstance(act, dict):
            continue
        modified = _normalize_activity(act, existing_activity_ids) or modified

    # 3. Normalize sensors
    sensors = config.get("sensors", [])
    if not isinstance(sensors, list):
        sensors = []
        config["sensors"] = sensors
        modified = True

    existing_sensor_ids: set[str] = set()
    for s in sensors:
        if not isinstance(s, dict):
            continue
        modified = _normalize_sensor(s, existing_sensor_ids) or modified

    # 4. Normalize rules
    rules = config.get("rules", [])
    if not isinstance(rules, list):
        rules = []
        config["rules"] = rules
        modified = True

    existing_rule_ids: set[str] = set()
    for r in rules:
        if not isinstance(r, dict):
            continue
        modified = _normalize_rule(r, existing_rule_ids) or modified

    # 5. Cross-reference cleanup: self-suppression prevention
    rule_trigger_inputs: dict[str, set[str]] = {}
    for inp in inputs:
        if isinstance(inp, dict):
            rule_id = inp.get("rule")
            inp_id = inp.get("id")
            if (
                isinstance(rule_id, str)
                and rule_id
                and isinstance(inp_id, str)
                and inp_id
            ):
                rule_trigger_inputs.setdefault(rule_id, set()).add(inp_id)

    for r in rules:
        if not isinstance(r, dict):
            continue
        r_id = r.get("id")
        suppressed = r.get("suppressed_inputs_override")
        if (
            isinstance(r_id, str)
            and r_id in rule_trigger_inputs
            and isinstance(suppressed, list)
        ):
            triggers = rule_trigger_inputs[r_id]
            cleaned = [inp_id for inp_id in suppressed if inp_id not in triggers]
            if len(cleaned) != len(suppressed):
                r["suppressed_inputs_override"] = cleaned
                modified = True

    return modified


def _normalize_area_config(config: dict[str, Any]) -> bool:
    """Normalize channels, input and activity schema, return True if modified."""
    modified = _prune_and_default(config, AREA_DEFAULTS, keep=AREA_STRUCTURED_KEYS)
    modified = _normalize_channels(config) or modified
    modified = _normalize_config_lists(config) or modified
    profiles = config.get("heatmap_profiles")
    if not isinstance(profiles, list):
        config["heatmap_profiles"] = []
        modified = True
    return modified


def materialize_area_primary_slots(area_config: dict[str, Any]) -> dict[str, Any]:
    """Return a copy of area_config with Primary Channel slots materialized into a 10-slot list."""
    area = copy.deepcopy(area_config)
    channels = area.get("channels")
    if isinstance(channels, dict):
        primary = channels.get(PRIMARY_CHANNEL_ID)
        if isinstance(primary, dict):
            primary["slots"] = materialize_primary_slots(primary.get("slots"))
    return area


def _migrate_store_data(data: dict[str, Any]) -> bool:
    """Migrate store data to current STORAGE_VERSION.

    Returns True if data was modified during migration.
    """
    version = data.get("version", 1)
    if version >= STORAGE_VERSION:
        return False

    modified = False

    if version < 2:
        _LOGGER.info("Migrating TwilightStore data from version %s to 2", version)

        def _migrate_activities(activities: Any) -> None:
            nonlocal modified
            if not isinstance(activities, list):
                return
            for act in activities:
                if not isinstance(act, dict):
                    continue
                action = act.get("action")
                if not isinstance(action, dict):
                    continue

                # --- 1. ActionType.NONE -> ActionType.BLOCK migration ---
                if action.get("type") == "none":
                    action["type"] = ActionType.BLOCK.value
                    modified = True

                # --- 2. BLOCK Activity field cleanup (transition_off_seconds) ---
                # The former expire_check_mode cleanup is gone with the field
                # itself — BaseConfig.prune_and_default() drops it from old
                # stores because it is no longer a dataclass field.
                if (
                    action.get("type") == ActionType.BLOCK.value
                    and act.get("transition_off_seconds") is not None
                ):
                    act["transition_off_seconds"] = None
                    modified = True

        # Migrate global area_template
        global_cfg = data.get("global")
        if isinstance(global_cfg, dict):
            area_tpl = global_cfg.get("area_template")
            if isinstance(area_tpl, dict):
                _migrate_activities(area_tpl.get("activities"))

                # One-time backfill for stores predating custom_channels/rules
                # in area_template: an empty/missing value here means "stores
                # written before the feature existed", not a deliberate user
                # choice — deliberate emptying only became possible once the
                # settings UI could edit these fields, i.e. after this
                # migration already ran once. Must not repeat on every load
                # (see async_load), or it would keep overwriting a user who
                # intentionally clears custom_channels/rules afterwards.
                custom_ch = area_tpl.get("custom_channels")
                if not isinstance(custom_ch, dict) or not custom_ch:
                    area_tpl["custom_channels"] = copy.deepcopy(
                        DEFAULT_AREA_TEMPLATE.get("custom_channels", {})
                    )
                    modified = True

                rules = area_tpl.get("rules")
                if not isinstance(rules, list) or not rules:
                    area_tpl["rules"] = copy.deepcopy(
                        DEFAULT_AREA_TEMPLATE.get("rules", [])
                    )
                    modified = True

        # Migrate all areas
        areas = data.get("areas")
        if isinstance(areas, dict):
            for area_cfg in areas.values():
                if isinstance(area_cfg, dict):
                    _migrate_activities(area_cfg.get("activities"))

        data["version"] = 2
        modified = True

    return modified


class TwilightHAStore(Store[dict[str, Any]]):
    """Custom Store for Twilight with migration support."""

    async def _async_migrate_func(
        self, old_major_version: int, old_minor_version: int, old_data: dict[str, Any]
    ) -> dict[str, Any]:
        """Migrate store data from old_major_version to current STORAGE_VERSION."""
        _LOGGER.info(
            "Migrating Twilight storage from version %s.%s to %s.1",
            old_major_version,
            old_minor_version,
            STORAGE_VERSION,
        )
        _migrate_store_data(old_data)
        return old_data


class TwilightStore:
    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self.store: Store[dict[str, Any]] = TwilightHAStore(hass, STORAGE_VERSION, STORAGE_KEY)
        self.data: dict[str, Any] = {}
        # Serializes every store-wide/wholesale writer against the others:
        # async_save_global and async_import_all both replace self.data["global"]
        # (and async_import_all also self.data["areas"]) wholesale, and
        # async_save_area/async_delete_area mutate self.data["areas"] in place —
        # without this lock a concurrent import could interleave with a save/
        # delete for an area outside the import's own area-lock set (e.g. one
        # created mid-import, unknown to the lock set computed at import start)
        # and leave a mixed or lost result. websocket/config.py's per-area
        # locking (helpers.get_area_lock) additionally serializes area/save|
        # delete against each other and holds every area known at import start
        # for the post-import engine reload — this lock closes the remaining
        # gap for areas that set is unaware of.
        self._global_write_lock = asyncio.Lock()

    async def async_load(self) -> None:
        stored = await self.store.async_load()

        updated = False
        if not isinstance(stored, dict):
            self.data = {
                "version": STORAGE_VERSION,
                "areas": {},
                "global": {},
            }
            updated = True
        else:
            self.data = stored

        if _migrate_store_data(self.data):
            updated = True

        if not isinstance(self.data.get("areas"), dict):
            self.data["areas"] = {}
            updated = True
        if not isinstance(self.data.get("global"), dict):
            self.data["global"] = {}
            updated = True

        # Normalize each area: build/repair the channels dict (Primary always
        # complete) and the inputs/activities schema.
        updated_areas = False
        for area_id, area_cfg in list(self.data.get("areas", {}).items()):
            if not isinstance(area_cfg, dict):
                del self.data["areas"][area_id]
                updated_areas = True
                continue
            if _normalize_area_config(area_cfg):
                updated_areas = True

        if updated_areas:
            updated = True

        # Whitelist-prune unknown/renamed keys, backfill missing ones from const.py.
        # Legacy global-only keys (extend_ignore_lux, lux_*, expire_check_mode,
        # default_action_type, …) are dropped here — those settings are per
        # input/activity/sensor now, not global.
        if _prune_and_default(self.data["global"], GLOBAL_DEFAULTS):
            updated = True

        # Structurally normalize area_template (shape only — does not backfill
        # empty custom_channels/rules; a user who deliberately clears them via
        # the settings UI must have that respected on every subsequent load,
        # not just for pre-existing stores. That one-time backward-compat
        # backfill lives in _migrate_store_data() instead, gated by
        # STORAGE_VERSION so it runs exactly once for old stores.
        area_template = self.data["global"].get("area_template")
        if isinstance(area_template, dict):
            custom_ch = area_template.get("custom_channels")
            if isinstance(custom_ch, dict) and _normalize_custom_channels(custom_ch):
                updated = True

            primary_slots = area_template.get("primary_slots")
            norm_primary = normalize_primary_slots_sparse(primary_slots)
            if not isinstance(primary_slots, dict) or norm_primary != primary_slots:
                area_template["primary_slots"] = norm_primary
                updated = True

        # Normalize the area_template's inputs/activities/sensors/rules with the same
        # backfill as real areas, so new areas seeded from it are complete.
        if isinstance(area_template, dict) and _normalize_config_lists(area_template):
            updated = True

        if updated:
            await self.store.async_save(self.data)

        _LOGGER.debug(
            "TwilightStore loaded %d areas: %s",
            len(self.data.get("areas", {})),
            list(self.data.get("areas", {}).keys()),
        )

    # --- Areas ---

    def get_areas(self) -> dict[str, Any]:
        result = {}
        for area_id, config in self.data["areas"].items():
            if not isinstance(config, dict):
                continue
            area_config = dict(config)
            area_config.pop("_state", None)
            result[area_id] = materialize_area_primary_slots(area_config)
        return result

    def get_area(self, area_id: str) -> dict[str, Any] | None:
        area = self.data["areas"].get(area_id)
        if not isinstance(area, dict):
            return None
        area_config = dict(area)
        area_config.pop("_state", None)
        return materialize_area_primary_slots(area_config)

    def get_area_state(self, area_id: str) -> dict[str, Any] | None:
        area = self.data["areas"].get(area_id)
        if not isinstance(area, dict):
            return None
        state = area.get("_state")
        return dict(state) if isinstance(state, dict) else None

    async def async_save_area(self, area_id: str, config: dict[str, Any]) -> str:
        # Deep-copy so the store never aliases the caller's dict: the WS handler
        # passes msg["channels"]/msg["inputs"]/... straight in, and
        # _normalize_area_config() mutates nested structures in place — without
        # the copy that mutation would leak into the caller's payload (same
        # aliasing hazard as async_save_global(), see the comment there).
        cleaned_config = copy.deepcopy(config)
        cleaned_config.pop("_state", None)

        # Seed new areas from the area_template. Only direct store callers
        # (e.g. an import) can hit these is-None branches: the WS schema's
        # default=[] on inputs/activities/sensors/rules already materializes
        # empty lists, so over the area/save path the template never applies
        # to those fields (custom channels/primary slots below are live).
        if area_id not in self.data["areas"]:
            stored_tpl = self.data["global"].get("area_template") or DEFAULT_AREA_TEMPLATE
            if not isinstance(stored_tpl, dict):
                stored_tpl = DEFAULT_AREA_TEMPLATE
            inputs_tpl = stored_tpl.get("inputs")
            if cleaned_config.get("inputs") is None and isinstance(inputs_tpl, list):
                cleaned_config["inputs"] = copy.deepcopy(inputs_tpl)
            activities_tpl = stored_tpl.get("activities")
            if (
                cleaned_config.get("activities") is None
                and isinstance(activities_tpl, list)
            ):
                cleaned_config["activities"] = copy.deepcopy(activities_tpl)
            sensors_tpl = stored_tpl.get("sensors")
            if cleaned_config.get("sensors") is None and isinstance(sensors_tpl, list):
                cleaned_config["sensors"] = copy.deepcopy(sensors_tpl)
            rules_tpl = stored_tpl.get("rules")
            if cleaned_config.get("rules") is None and isinstance(rules_tpl, list):
                cleaned_config["rules"] = copy.deepcopy(rules_tpl)
            custom_ch = stored_tpl.get("custom_channels")
            if isinstance(custom_ch, dict) and custom_ch:
                if "channels" not in cleaned_config or not isinstance(
                    cleaned_config["channels"], dict
                ):
                    cleaned_config["channels"] = default_channels()
                for ch_id, ch_cfg in custom_ch.items():
                    if (
                        ch_id != PRIMARY_CHANNEL_ID
                        and ch_id not in cleaned_config["channels"]
                    ):
                        cleaned_config["channels"][ch_id] = copy.deepcopy(ch_cfg)
            primary_tpl = stored_tpl.get("primary_slots")
            if isinstance(primary_tpl, dict) and primary_tpl:
                if "channels" not in cleaned_config or not isinstance(
                    cleaned_config["channels"], dict
                ):
                    cleaned_config["channels"] = default_channels()
                primary_ch = cleaned_config["channels"].setdefault(
                    PRIMARY_CHANNEL_ID, {"name": "Primary", "enabled": True, "slots": {}}
                )
                if isinstance(primary_ch, dict) and not primary_ch.get("slots"):
                    primary_ch["slots"] = copy.deepcopy(primary_tpl)

        # Normalize inputs/activities
        _normalize_area_config(cleaned_config)

        # Guards against a global/import running concurrently: async_import_all
        # replaces self.data["areas"] wholesale, and its per-area locking (taken
        # one layer up, in websocket/config.py) only covers area_ids known at
        # import start — a brand new area saved mid-import wouldn't be covered
        # by that set. This lock serializes against that wholesale replace
        # regardless of area_id, closing that gap.
        async with self._global_write_lock:
            # Merge with existing _state if present
            existing = self.data["areas"].get(area_id)
            if existing and "_state" in existing:
                cleaned_config["_state"] = existing["_state"]

            self.data["areas"][area_id] = cleaned_config
            await self.store.async_save(self.data)
        return area_id

    async def async_delete_area(self, area_id: str) -> bool:
        async with self._global_write_lock:
            if area_id not in self.data["areas"]:
                return False
            del self.data["areas"][area_id]
            await self.store.async_save(self.data)
        return True

    def save_area_state(self, area_id: str, state_config: dict[str, Any]) -> None:
        # Deliberately without _global_write_lock: sync-only (no await possible),
        # single-key mutation behind the area_id guard, and async_delay_save
        # serializes the eventual write. A concurrent import/restore replaces
        # self.data wholesale and could drop this _state update — accepted, the
        # engine rebuilds the dict from live state on boot.
        if area_id not in self.data["areas"]:
            return
        self.data["areas"][area_id]["_state"] = state_config
        self.store.async_delay_save(lambda: self.data, 0.5)

    def generate_new_area_draft(self, area_id: str) -> dict[str, Any]:
        stored_tpl = self.data["global"].get("area_template") or DEFAULT_AREA_TEMPLATE
        if not isinstance(stored_tpl, dict):
            stored_tpl = DEFAULT_AREA_TEMPLATE
        channels = default_channels()
        primary_tpl = stored_tpl.get("primary_slots")
        if isinstance(primary_tpl, dict) and primary_tpl:
            channels[PRIMARY_CHANNEL_ID]["slots"] = copy.deepcopy(primary_tpl)
        custom_ch = stored_tpl.get(
            "custom_channels", DEFAULT_AREA_TEMPLATE.get("custom_channels", {})
        )
        if isinstance(custom_ch, dict):
            for ch_id, ch_cfg in custom_ch.items():
                if ch_id != PRIMARY_CHANNEL_ID:
                    channels[ch_id] = copy.deepcopy(ch_cfg)

        return {
            "area_id": area_id,
            "name": "",
            "enabled": True,
            "manual_only": False,
            "lux_threshold": None,
            "lux_watch_window": None,
            "transition_on_seconds": None,
            "channels": channels,
            "inputs": copy.deepcopy(
                stored_tpl.get("inputs", DEFAULT_AREA_TEMPLATE["inputs"])
            ),
            "activities": copy.deepcopy(
                stored_tpl.get("activities", DEFAULT_AREA_TEMPLATE["activities"])
            ),
            "sensors": copy.deepcopy(
                stored_tpl.get("sensors", DEFAULT_AREA_TEMPLATE.get("sensors", []))
            ),
            "rules": copy.deepcopy(
                stored_tpl.get("rules", DEFAULT_AREA_TEMPLATE.get("rules", []))
            ),
        }

    # --- Global Defaults ---

    def get_global(self) -> dict[str, Any]:
        return copy.deepcopy(self.data["global"])

    async def async_save_global(self, config: dict[str, Any]) -> None:
        # Deep-copy so the store never aliases the caller's dict: the WS handler
        # passes msg["config"] straight in (and echoes it back via send_result),
        # and _normalize_custom_channels() mutates in place — without the copy
        # that mutation would leak into the caller's payload and vice versa.
        config = copy.deepcopy(config)
        area_template = config.get("area_template")
        if isinstance(area_template, dict):
            raw_primary = area_template.get("primary_slots")
            area_template["primary_slots"] = normalize_primary_slots_sparse(raw_primary)
            if isinstance(area_template.get("custom_channels"), dict):
                _normalize_custom_channels(area_template["custom_channels"])
            _normalize_config_lists(area_template)
        async with self._global_write_lock:
            self.data["global"] = config
            await self.store.async_save(self.data)

    # --- Backup & Restore ---

    def export_all(self) -> dict[str, Any]:
        """Return a portable, versioned snapshot of the full store (no _state)."""
        return {
            "twilight_backup_version": BACKUP_VERSION,
            "global": self.get_global(),
            "areas": self.get_areas(),
        }

    async def async_import_all(self, payload: dict[str, Any]) -> None:
        """Replace global + areas from an exported snapshot. Preserves runtime _state for existing areas."""
        if not isinstance(payload, dict):
            raise ValueError("Invalid backup payload structure: expected JSON object")

        version = payload.get("twilight_backup_version")
        if version is not None and not isinstance(version, int):
            raise ValueError(
                f"Invalid backup version {version!r}: expected an integer"
            )
        if version is not None and version > BACKUP_VERSION:
            raise ValueError(
                f"Unsupported backup version {version!r}: this Twilight release "
                f"can import at most version {BACKUP_VERSION}"
            )

        areas_in = payload.get("areas")
        if not isinstance(areas_in, dict):
            areas_in = {}

        async with self._global_write_lock:
            # Deep-copy each incoming area dict — a shallow dict() still shares
            # nested lists/dicts (channels, inputs, activities, ...) with the
            # caller's payload; _normalize_area_config() mutates in place, which
            # would otherwise leak into (or be corrupted by) the caller's copy.
            new_areas: dict[str, Any] = {}
            for area_id, area_cfg in areas_in.items():
                if not isinstance(area_cfg, dict):
                    continue
                cleaned = copy.deepcopy(area_cfg)
                cleaned.pop("_state", None)
                cleaned["area_id"] = area_id
                _normalize_area_config(cleaned)
                existing = self.data["areas"].get(area_id)
                if existing and "_state" in existing:
                    cleaned["_state"] = existing["_state"]
                new_areas[area_id] = cleaned

            global_in = payload.get("global")
            new_global = (
                copy.deepcopy(global_in) if isinstance(global_in, dict) else {}
            )
            _prune_and_default(new_global, GLOBAL_DEFAULTS)

            area_template = new_global.get("area_template")
            if isinstance(area_template, dict):
                raw_primary = area_template.get("primary_slots")
                area_template["primary_slots"] = normalize_primary_slots_sparse(raw_primary)
                custom_ch = area_template.get("custom_channels")
                if not isinstance(custom_ch, dict) or not custom_ch:
                    area_template["custom_channels"] = copy.deepcopy(
                        DEFAULT_AREA_TEMPLATE.get("custom_channels", {})
                    )
                    custom_ch = area_template["custom_channels"]
                if isinstance(custom_ch, dict):
                    _normalize_custom_channels(custom_ch)
                _normalize_config_lists(area_template)

            self.data["areas"] = new_areas
            self.data["global"] = new_global
            await self.store.async_save(self.data)

    async def async_restore_data(self, data: dict[str, Any]) -> None:
        """Overwrite the full store with a previously captured snapshot (e.g. rollback after a failed import)."""
        async with self._global_write_lock:
            self.data = data
            await self.store.async_save(self.data)
