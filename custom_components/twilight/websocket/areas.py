"""Areas CRUD WebSocket commands for Twilight."""

from __future__ import annotations

import datetime as dt
import logging
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import Context, HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.util import dt as dt_util

from ..config_model import AreaConfig, RuleAutoExpireMode, RuleConfig
from ..const import (
    CONTEXT_PREFIX,
    DOMAIN,
    MAX_CUSTOM_CHANNELS,
    MAX_OFFSET_MINUTES,
    MAX_SLOTS_PER_CHANNEL,
    PRIMARY_CHANNEL_ID,
    SIGNAL_ENGINES_CHANGED,
    STANDARD_ZONES,
    ActionType,
    HueDynamicMode,
    InputType,
    ReleaseActionType,
    StartType,
)
from ..engine import TwilightEngine
from ..engine_registry import (
    area_wants_engine,
    async_clear_area_entities,
    async_start_engine,
)
from ..helpers import (
    channel_entities,
    get_activity_supports_auto_expire,
    get_activity_supports_borrowed_auto_expire,
    get_activity_supports_excluded_slots,
    get_activity_supports_input_suppression,
    get_area_lock,
    get_setup_lock,
    partition_by_domain,
    remove_area_lock,
)
from ..slot_calc import normalize_not_before_str, resolve_slot_times
from ..sun_calc import compute_sun_day_data
from .sun import clear_timeline_slot_cache

_LOGGER = logging.getLogger(__name__)


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


def _valid_not_before(value: Any) -> str:
    """Validate a "not before" floor as HH:MM (12:00–03:59 across midnight)."""
    normalized = normalize_not_before_str(value)
    if normalized is None:
        raise vol.Invalid("not_before must be HH:MM within 12:00–03:59")
    return normalized


def _require_fixed_time_for_fixed_slots(slot: dict[str, Any]) -> dict[str, Any]:
    """A slot with start_type "fixed" must carry a fixed_time.

    Without this, resolve_slot_times() silently discards the slot at
    calculation time — surfacing the
    problem only once the engine runs, not when the config is saved.
    """
    if slot.get("start_type") == StartType.FIXED.value and not slot.get("fixed_time"):
        raise vol.Invalid("fixed_time is required when start_type is 'fixed'")
    return slot


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
                    "scene_entity_id": slot_info.scene_entity_id,
                    "scene_type": slot_info.scene_type.value,
                    "supports_dynamic": slot_info.supports_dynamic,
                    "dynamic_entities": sorted(slot_info.dynamic_entities),
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


def _channel_has_scene(channel: dict[str, Any]) -> bool:
    """True if a slot of the stored channel still has a scene or script."""
    return any(slot.get("scene_entity_id") for slot in channel.get("slots", []))


def _disable_mismatched_rules(config: dict[str, Any]) -> list[str]:
    """Disable rules whose configured fields no longer match target activity capabilities. Return list of disabled rule IDs."""
    raw_rules = config.get("rules")
    raw_activities = config.get("activities")
    if not isinstance(raw_rules, list) or not isinstance(raw_activities, list):
        return []

    try:
        parsed_area = AreaConfig.from_dict(config)
    except Exception:
        _LOGGER.warning(
            "Skipping rule capability check: area config failed to parse",
            exc_info=True,
        )
        return []
    disabled_ids: list[str] = []

    for rule_dict in raw_rules:
        if not isinstance(rule_dict, dict):
            continue
        try:
            rule_cfg = RuleConfig.from_dict(rule_dict)
        except Exception:
            _LOGGER.warning(
                "Skipping malformed rule during capability check", exc_info=True
            )
            continue
        if not rule_cfg.enabled:
            continue

        for act_id in rule_cfg.applied_activities:
            act_cfg = parsed_area.activity_by_id(act_id)
            if not act_cfg:
                continue

            mismatch = False
            if rule_cfg.excluded_slots_override and not get_activity_supports_excluded_slots(act_cfg):
                mismatch = True
            if rule_cfg.auto_expire_mode != RuleAutoExpireMode.NONE and not get_activity_supports_auto_expire(act_cfg):
                mismatch = True
            if (rule_cfg.auto_expire_enabled is True or rule_cfg.auto_expire is not None) and not get_activity_supports_borrowed_auto_expire(act_cfg):
                mismatch = True
            if rule_cfg.suppressed_inputs_override and not get_activity_supports_input_suppression(act_cfg):
                mismatch = True
            # Same capability as excluded slots — part of the SlotAction.
            if rule_cfg.respect_manual_off_override is not None and not get_activity_supports_excluded_slots(act_cfg):
                mismatch = True

            if mismatch:
                _LOGGER.info(
                    "Rule '%s' disabled due to capability mismatch with target activity '%s'",
                    rule_cfg.id,
                    act_id,
                )
                rule_dict["enabled"] = False
                rule_dict["auto_disabled_reason"] = "mismatch"
                disabled_ids.append(rule_cfg.id)
                break

    return disabled_ids


def _ws_area_save() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/area/save",
            vol.Required("area_id"): str,
            vol.Optional("name"): str,
            vol.Optional("enabled", default=True): bool,
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
                    # Optional on purpose: the store's _normalize_channels()
                    # backfills a missing/empty name (Primary gets "Primary"),
                    # so requiring it here only rejected otherwise-valid
                    # payloads — e.g. a channel dict assembled by a script.
                    vol.Optional("name"): vol.Any(None, str),
                    vol.Optional("enabled", default=True): bool,
                    vol.Optional("transition_on_seconds"): vol.Any(None, int),
                    vol.Optional("slots", default=[]): vol.Any(
                        dict,
                        vol.All(
                            [
                                vol.All(
                                    {
                                        vol.Optional("id"): str,
                                        vol.Optional("name"): vol.Any(None, str),
                                        vol.Optional(
                                            "start_type",
                                            default=StartType.ASTRAL.value,
                                        ): vol.In(
                                            [
                                                StartType.ASTRAL.value,
                                                StartType.FIXED.value,
                                            ]
                                        ),
                                        # zone for astral slots (Primary always uses these);
                                        # fixed_time "HH:MM" for fixed slots in custom channels.
                                        vol.Optional("zone"): vol.Any(
                                            None, vol.In(STANDARD_ZONES)
                                        ),
                                        vol.Optional("fixed_time"): vol.Any(
                                            None, _valid_hhmm
                                        ),
                                        # A floor on a zone that cannot carry one
                                        # is dropped by the store normalization.
                                        vol.Optional("not_before"): vol.Any(
                                            None, _valid_not_before
                                        ),
                                        vol.Optional("offset_minutes"): vol.All(
                                            vol.Coerce(int),
                                            vol.Range(
                                                min=-MAX_OFFSET_MINUTES,
                                                max=MAX_OFFSET_MINUTES,
                                            ),
                                        ),
                                        vol.Optional("scene_entity_id"): vol.Any(
                                            None, cv.entity_id
                                        ),
                                        vol.Optional(
                                            "configured_entities", default=[]
                                        ): cv.entity_ids,
                                        vol.Optional(
                                            "hue_activate_dynamic",
                                            default=HueDynamicMode.HUE.value,
                                        ): vol.In([mode.value for mode in HueDynamicMode]),
                                        vol.Optional(
                                            "hue_dynamic_speed", default=None
                                        ): vol.Any(
                                            None,
                                            vol.All(
                                                vol.Coerce(int),
                                                vol.Range(min=0, max=100),
                                            ),
                                        ),
                                    },
                                    _require_fixed_time_for_fixed_slots,
                                )
                            ],
                            # Hard cap so a channel can never exceed the slot limit (the
                            # frontend disables Add at the limit; this is the backstop).
                            vol.Length(max=MAX_SLOTS_PER_CHANNEL),
                        ),
                    ),
                }
            },
            # Element-level dict guard: the store's _normalize_area_config fills
            # ids/defaults and the engine tolerates missing fields, so the inner
            # shape stays open — but a non-dict entry (e.g. a stray string) is
            # rejected here rather than silently skipped downstream. `type` is
            # restricted to known enum values and `enabled` to bool (or None) so
            # a hand-fabricated payload cannot persist an unknown input type or
            # a truthy string that Python would evaluate as enabled.
            vol.Optional("inputs", default=[]): [
                vol.Schema(
                    {
                        vol.Required("id"): str,
                        vol.Required("type"): vol.In(
                            [input_type.value for input_type in InputType]
                        ),
                        vol.Optional("enabled"): vol.Any(None, bool),
                    },
                    extra=vol.ALLOW_EXTRA,
                )
            ],
            vol.Optional("activities", default=[]): [
                vol.Schema(
                    {
                        vol.Required("id"): str,
                        vol.Optional("action"): vol.Any(
                            None,
                            vol.Schema(
                                {
                                    vol.Required("type"): vol.In(
                                        [action_type.value for action_type in ActionType]
                                    )
                                },
                                extra=vol.ALLOW_EXTRA,
                            ),
                        ),
                        vol.Optional("release_action"): vol.Any(
                            None,
                            vol.Schema(
                                {
                                    vol.Required("type"): vol.In(
                                        [
                                            release_type.value
                                            for release_type in ReleaseActionType
                                        ]
                                    )
                                },
                                extra=vol.ALLOW_EXTRA,
                            ),
                        ),
                        vol.Optional("enabled"): vol.Any(None, bool),
                        vol.Optional("auto_expire_enabled"): vol.Any(None, bool),
                    },
                    extra=vol.ALLOW_EXTRA,
                )
            ],
            vol.Optional("rules", default=[]): [
                vol.Schema(
                    {
                        vol.Required("id"): str,
                        vol.Optional("enabled"): vol.Any(None, bool),
                        vol.Optional("auto_expire_enabled"): vol.Any(None, bool),
                        vol.Optional("auto_expire_mode"): vol.Any(
                            None,
                            vol.In(
                                [
                                    mode.value
                                    for mode in (
                                        RuleAutoExpireMode.NONE,
                                        RuleAutoExpireMode.RESTART,
                                        RuleAutoExpireMode.PAUSE,
                                        RuleAutoExpireMode.SUSPEND,
                                    )
                                ]
                            ),
                        ),
                    },
                    extra=vol.ALLOW_EXTRA,
                )
            ],
            # Saved heatmap snapshots; inner shape stays
            # open like inputs/activities — the store normalizes/validates it.
            vol.Optional("heatmap_profiles", default=[]): [dict],
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
            "sensors": msg.get("sensors", []),
            "lux_threshold": msg.get("lux_threshold"),
            "lux_watch_window": msg.get("lux_watch_window"),
            "transition_on_seconds": msg.get("transition_on_seconds"),
            "lux_ignore_active": msg.get("lux_ignore_active"),
            "lux_ignore_scope": msg.get("lux_ignore_scope"),
            "channels": msg.get("channels", {}),
            "inputs": msg.get("inputs", []),
            "activities": msg.get("activities", []),
            "rules": msg.get("rules", []),
            "heatmap_profiles": msg.get("heatmap_profiles", []),
        }

        disabled_rule_ids = _disable_mismatched_rules(config)

        # The setup lock excludes a concurrent Twilight (re-)setup teardown/
        # reload (__init__.py's async_setup) — without it, this area's first
        # engine registration below could land in that reload's unguarded
        # window between its teardown loop and its unconditional
        # engines.clear(), only to be discarded (leaked) right after. See
        # get_setup_lock()'s docstring for the full mechanism.
        async with get_setup_lock(hass), get_area_lock(hass, area_id):
            # Profiles are written by heatmap/profile/save|delete only. A panel
            # draft can predate those writes, so its copy never replaces the list.
            stored_area = store.get_area(area_id)
            if stored_area is not None:
                config["heatmap_profiles"] = stored_area.get("heatmap_profiles", [])

            await store.async_save_area(area_id, config)

            # Use the normalized stored config (Primary channel always complete) for the engine.
            saved_area = store.get_area(area_id)

            engines = hass.data[DOMAIN].setdefault("engines", {})
            existing_engine = engines.get(area_id)

            if saved_area and area_wants_engine(saved_area):
                initial_state = None
                old_config = None
                if existing_engine:
                    initial_state = existing_engine.run_state
                    old_config = existing_engine.config
                    entities_to_turn_off: set[str] = set()
                    surviving_entities: set[str] = set()
                    new_channels = saved_area.get("channels", {})
                    if not isinstance(new_channels, dict):
                        new_channels = {}
                    for ch_id, old_ch in existing_engine.config.channels.items():
                        if old_ch.enabled:
                            new_ch = new_channels.get(ch_id)
                            if (
                                not new_ch
                                or not new_ch.get("enabled", True)
                                or not _channel_has_scene(new_ch)
                            ):
                                # Channel was deleted or disabled, or lost its
                                # last scene → collect entities
                                ch_ents = channel_entities(
                                    existing_engine.scene_map, ch_id
                                )
                                entities_to_turn_off.update(ch_ents)
                            else:
                                surviving_entities.update(
                                    channel_entities(existing_engine.scene_map, ch_id)
                                )

                    try:
                        await existing_engine.async_teardown()
                    except Exception:
                        _LOGGER.exception(
                            "Error tearing down engine for area %s during save", area_id
                        )
                    engines.pop(area_id, None)

                    for ch in saved_area.get("channels", {}).values():
                        if isinstance(ch, dict) and ch.get("enabled", True):
                            for slot in ch.get("slots", []):
                                if isinstance(slot, dict):
                                    surviving_entities.update(
                                        slot.get("configured_entities", [])
                                    )
                    entities_to_turn_off -= surviving_entities

                    if entities_to_turn_off:
                        # Same isolation as the teardown above: the store is
                        # already saved and the old engine gone by this point,
                        # so a failing turn-off must not surface as a failed
                        # save — the client would retry the save and the area
                        # would stay engineless.
                        try:
                            await _async_turn_off_entities(
                                hass, area_id, entities_to_turn_off
                            )
                        except Exception:
                            _LOGGER.exception(
                                "Error turning off entities during save for area %s",
                                area_id,
                            )

                # Unlike the other call sites, area/save must report the failure
                # back to the client — async_start_engine() logs it and returns
                # None without registering the engine.
                engine = await async_start_engine(
                    hass, area_id, saved_area, initial_state=initial_state
                )
                async_dispatcher_send(hass, SIGNAL_ENGINES_CHANGED)
                if engine is None:
                    connection.send_error(
                        msg["id"], "engine_setup_failed", "Engine setup failed"
                    )
                    return
                if old_config is not None and initial_state is not None:
                    engine.coordinator.reconcile_after_rebuild(
                        old_config, initial_state
                    )
            else:
                if existing_engine:
                    entities_to_turn_off = set()
                    for ch_id in existing_engine.config.channels:
                        entities_to_turn_off.update(
                            channel_entities(existing_engine.scene_map, ch_id)
                        )
                    try:
                        await existing_engine.async_teardown()
                    except Exception:
                        _LOGGER.exception(
                            "Error tearing down engine for area %s during save", area_id
                        )
                    engines.pop(area_id, None)
                    async_dispatcher_send(hass, SIGNAL_ENGINES_CHANGED)
                    if entities_to_turn_off:
                        try:
                            await _async_turn_off_entities(
                                hass, area_id, entities_to_turn_off
                            )
                        except Exception:
                            _LOGGER.exception(
                                "Error turning off entities during delete for area %s",
                                area_id,
                            )
                await async_clear_area_entities(hass, area_id)

            clear_timeline_slot_cache()
            res = dict(saved_area) if saved_area else {}
            res["disabled_rule_ids"] = disabled_rule_ids
            connection.send_result(msg["id"], res)

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
        # See area/save's matching comment — excludes a concurrent Twilight
        # (re-)setup reload from this area's engine teardown/removal below.
        async with get_setup_lock(hass), get_area_lock(hass, area_id):
            deleted = await store.async_delete_area(area_id)

            engines = hass.data[DOMAIN].setdefault("engines", {})
            existing_engine = engines.get(area_id)
            if existing_engine:
                entities_to_turn_off = set()
                for ch_id in existing_engine.config.channels:
                    entities_to_turn_off.update(
                        channel_entities(existing_engine.scene_map, ch_id)
                    )
                try:
                    await existing_engine.async_teardown()
                except Exception:
                    _LOGGER.exception(
                        "Error tearing down engine for area %s during delete", area_id
                    )
                engines.pop(area_id, None)
                async_dispatcher_send(hass, SIGNAL_ENGINES_CHANGED)
                if entities_to_turn_off:
                    # Same isolation as area/save: the store entry is already
                    # deleted and the engine already torn down by this point,
                    # so a failing turn-off must not skip the cleanup below
                    # (async_clear_area_entities, remove_area_lock) — that
                    # would leak the area lock permanently and orphan the
                    # area's Twilight-owned button/switch entities.
                    try:
                        await _async_turn_off_entities(
                            hass, area_id, entities_to_turn_off
                        )
                    except Exception:
                        _LOGGER.exception(
                            "Error turning off entities during delete for area %s",
                            area_id,
                        )

            await async_clear_area_entities(hass, area_id)

            clear_timeline_slot_cache()
        remove_area_lock(hass, area_id)

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

        # No per-area location override exists (see twilight_manager.py's
        # _get_location() docstring) — always resolve from hass.config.
        lat = hass.config.latitude
        lon = hass.config.longitude
        tz_str = hass.config.time_zone

        date_str = msg.get("date")
        if date_str:
            try:
                anchor_d = dt.date.fromisoformat(date_str)
            except ValueError:
                connection.send_error(
                    msg["id"], "invalid_date", f"Invalid date: {date_str}"
                )
                return
        else:
            anchor_d = dt_util.now().date()

        dates = [(anchor_d + dt.timedelta(days=i)).isoformat() for i in (-1, 0, 1)]

        def _compute() -> dict[str, Any]:
            channels_res: dict[str, dict[str, list[dict[str, Any]]]] = {}
            channels_config = area_config.get("channels", {})
            # One day more than requested: each day's cap needs the next morning.
            sun_by_day = [
                compute_sun_day_data(lat, lon, tz_str, anchor_d + dt.timedelta(days=i))
                for i in (-1, 0, 1, 2)
            ]
            for ch_id, ch_cfg in channels_config.items():
                if not isinstance(ch_cfg, dict):
                    continue
                ch_slots = ch_cfg.get("slots", [])
                channels_res[ch_id] = {}
                for i, d_str in enumerate(dates):
                    channels_res[ch_id][d_str] = resolve_slot_times(
                        ch_slots, sun_by_day[i], sun_by_day[i + 1]
                    )

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
        lat = hass.config.latitude
        lon = hass.config.longitude
        tz_str = hass.config.time_zone

        date_str = msg.get("date")
        if date_str:
            try:
                cur_d = dt.date.fromisoformat(date_str)
            except ValueError:
                connection.send_error(
                    msg["id"], "invalid_date", f"Invalid date: {date_str}"
                )
                return
        else:
            cur_d = dt_util.now().date()

        def _compute() -> dict[str, Any]:
            sun_data = compute_sun_day_data(lat, lon, tz_str, cur_d)
            next_sun_data = compute_sun_day_data(
                lat, lon, tz_str, cur_d + dt.timedelta(days=1)
            )
            return {"slots": resolve_slot_times(msg["slots"], sun_data, next_sun_data)}

        result = await hass.async_add_executor_job(_compute)
        connection.send_result(msg["id"], result)

    return handle
