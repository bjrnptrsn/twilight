"""Typed configuration model for Twilight areas.

Parsed once per engine from the (store-normalized) raw config dict. All
configuration data — channels, slots, inputs, activities, rules, sensors — is
exposed as typed frozen dataclasses so consumers get attribute access and
IDE/mypy coverage.

The model is immutable by design: mutating config after engine setup is not
supported — rebuild the engine (that is what `area/save` does).
"""

from __future__ import annotations

import copy
from dataclasses import MISSING, dataclass, field, fields
from enum import StrEnum
from typing import Any, cast

from .const import (
    DEFAULT_ACTION_TYPE,
    DEFAULT_RELEASE_ACTION_TYPE,
    PRIMARY_CHANNEL_ID,
    ActionType,
    InputType,
    RuleAutoExpireMode,
    SensorType,
    StartType,
    materialize_primary_slots,
)


class BaseConfig:
    """Base class for typed config dataclasses with store normalization helpers."""

    @classmethod
    def prune_and_default(
        cls,
        raw: dict[str, Any],
        *,
        keep: set[str] | frozenset[str] = frozenset(),
    ) -> bool:
        """Whitelist-prune unknown keys and backfill missing keys with dataclass defaults."""
        if not isinstance(raw, dict):
            return False

        modified = False
        allowed_fields = {f.name for f in fields(cast(Any, cls))} | set(keep)

        # 1. Prune unknown keys
        for key in list(raw):
            if key not in allowed_fields:
                del raw[key]
                modified = True

        # 2. Backfill missing keys with default values
        for f in fields(cast(Any, cls)):
            if f.name not in raw:
                if f.default is not MISSING:
                    val = copy.deepcopy(f.default)
                elif f.default_factory is not MISSING:
                    val = f.default_factory()
                else:
                    continue

                if isinstance(val, tuple):
                    val = list(val)
                elif isinstance(val, StrEnum):
                    val = val.value

                raw[f.name] = val
                modified = True

        return modified


@dataclass(frozen=True)
class SlotConfig(BaseConfig):
    """One slot of a channel (astral zone or fixed local time)."""

    id: str | None
    name: str | None
    start_type: str
    zone: str | None
    fixed_time: str | None
    offset_minutes: int
    scene_entity_id: str | None
    configured_entities: tuple[str, ...]

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> SlotConfig:
        """Parse a slot dict (store-normalized or test-provided)."""
        return cls(
            id=raw.get("id"),
            name=raw.get("name"),
            start_type=raw.get("start_type") or StartType.ASTRAL.value,
            zone=raw.get("zone"),
            fixed_time=raw.get("fixed_time"),
            offset_minutes=raw.get("offset_minutes") or 0,
            scene_entity_id=raw.get("scene_entity_id"),
            configured_entities=tuple(raw.get("configured_entities") or ()),
        )


@dataclass(frozen=True)
class ChannelConfig(BaseConfig):
    """One channel of an area (Primary or custom)."""

    id: str
    name: str | None
    enabled: bool
    slots: tuple[SlotConfig, ...]
    transition_on_seconds: int | None = None

    def slot(self, slot_id: str | None) -> SlotConfig | None:
        """Look up a slot by id, or None."""
        if not slot_id:
            return None
        for slot in self.slots:
            if slot.id == slot_id:
                return slot
        return None

    @classmethod
    def from_dict(cls, channel_id: str, raw: dict[str, Any]) -> ChannelConfig:
        """Parse a channel dict; non-dict slot entries are skipped."""
        slots_raw = raw.get("slots")
        if channel_id == PRIMARY_CHANNEL_ID:
            materialized = materialize_primary_slots(slots_raw)
            slots = tuple(SlotConfig.from_dict(s) for s in materialized)
        else:
            slots = tuple(
                SlotConfig.from_dict(s)
                for s in (slots_raw if isinstance(slots_raw, list) else [])
                if isinstance(s, dict)
            )
        return cls(
            id=channel_id,
            name=raw.get("name"),
            enabled=raw.get("enabled", True),
            slots=slots,
            transition_on_seconds=raw.get("transition_on_seconds"),
        )


@dataclass(frozen=True)
class SensorConfig(BaseConfig):
    """One sensor mapping (e.g. illuminance)."""

    id: str | None
    name: str | None = None
    type: str = ""

    @classmethod
    def _base_kwargs(cls, raw: dict[str, Any]) -> dict[str, Any]:
        """Shared field parsing, reused by every subclass's from_dict()."""
        return dict(
            id=raw.get("id"),
            name=raw.get("name"),
            type=raw.get("type") or "",
        )

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> SensorConfig:
        """Dispatch to the matching subclass by `type`."""
        if not isinstance(raw, dict):
            raw = {}
        sensor_type = raw.get("type")
        subclass = (
            _SENSOR_CONFIG_TYPES.get(sensor_type)
            if isinstance(sensor_type, str)
            else cls
        )
        if subclass is None:
            subclass = cls
        if subclass is not cls:
            return subclass.from_dict(raw)
        return cls(**cls._base_kwargs(raw))


@dataclass(frozen=True)
class IlluminanceSensorConfig(SensorConfig):
    """Illuminance sensor configuration."""

    entity_ids: tuple[str, ...] = ()
    aggregation: str | None = None

    @property
    def entity_id(self) -> str | None:
        """Fallback property for single sensor code."""
        return self.entity_ids[0] if self.entity_ids else None

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> IlluminanceSensorConfig:
        if not raw:
            raw = {}
        raw_ids = raw.get("entity_ids")
        entity_ids = tuple(raw_ids) if isinstance(raw_ids, list | tuple) else ()
        return cls(
            **SensorConfig._base_kwargs(raw),
            entity_ids=entity_ids,
            aggregation=raw.get("aggregation"),
        )


_SENSOR_CONFIG_TYPES: dict[str, type[SensorConfig]] = {
    SensorType.ILLUMINANCE: IlluminanceSensorConfig,
}


@dataclass(frozen=True)
class InputConfig(BaseConfig):
    """One input mapping (motion/binary/event/timer/button → activity or rule).

    `enabled` keeps three states on purpose: `False` means explicitly disabled
    by the user (adds the "user" disabler), `True`/`None` mean enabled —
    matching the raw-dict semantics where an absent key is not a disable.
    """

    id: str | None
    name: str | None = None
    type: str = ""
    entity_ids: tuple[str, ...] = ()
    activity: str | None = None
    enabled: bool | None = None
    rule: str | None = None

    @property
    def entity_id(self) -> str | None:
        """Fallback property for backwards compatibility / single sensor code."""
        return self.entity_ids[0] if self.entity_ids else None

    @classmethod
    def _base_kwargs(cls, raw: dict[str, Any]) -> dict[str, Any]:
        """Shared field parsing, reused by every subclass's from_dict()."""
        raw_ids = raw.get("entity_ids")
        entity_ids = tuple(raw_ids) if isinstance(raw_ids, list | tuple) else ()
        return dict(
            id=raw.get("id"),
            type=raw.get("type") or "",
            entity_ids=entity_ids,
            activity=raw.get("activity"),
            rule=raw.get("rule"),
            enabled=raw.get("enabled"),
            name=raw.get("name"),
        )

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> InputConfig:
        """Dispatch to the matching subclass by `type`; None/unknown/missing
        type falls back to the base class (keeps engine tolerant of
        malformed store data, matching current behavior)."""
        if not isinstance(raw, dict):
            raw = {}
        input_type = raw.get("type")
        subclass = (
            _INPUT_CONFIG_TYPES.get(input_type) if isinstance(input_type, str) else cls
        )
        if subclass is None:
            subclass = cls
        if subclass is not cls:
            return subclass.from_dict(raw)
        return cls(**cls._base_kwargs(raw))


@dataclass(frozen=True)
class MotionInputConfig(InputConfig):
    """Motion sensor input configuration."""

    lux_threshold: float | None = None
    lux_watch_window: int | None = None
    lux_ignore_active: bool | None = None
    lux_ignore_scope: str | None = None
    retrigger: str | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> MotionInputConfig:
        if not raw:
            raw = {}
        return cls(
            **InputConfig._base_kwargs(raw),
            lux_threshold=raw.get("lux_threshold"),
            lux_watch_window=raw.get("lux_watch_window"),
            lux_ignore_active=raw.get("lux_ignore_active"),
            lux_ignore_scope=raw.get("lux_ignore_scope"),
            retrigger=raw.get("retrigger"),
        )


@dataclass(frozen=True)
class EventInputConfig(InputConfig):
    """Event input configuration."""

    event_type: str | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> EventInputConfig:
        if not raw:
            raw = {}
        return cls(**InputConfig._base_kwargs(raw), event_type=raw.get("event_type"))


@dataclass(frozen=True)
class TimerInputConfig(InputConfig):
    """Timer input configuration."""

    trigger_time: str | None = "00:00:00"

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> TimerInputConfig:
        if not raw:
            raw = {}
        return cls(
            **InputConfig._base_kwargs(raw), trigger_time=raw.get("trigger_time")
        )


@dataclass(frozen=True)
class ButtonInputConfig(InputConfig):
    """Button input configuration."""

    button_mode: str | None = "click"
    label: str | None = None
    create_entity: bool | None = False

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> ButtonInputConfig:
        if not raw:
            raw = {}
        return cls(
            **InputConfig._base_kwargs(raw),
            button_mode=raw.get("button_mode"),
            label=raw.get("label"),
            create_entity=raw.get("create_entity"),
        )


@dataclass(frozen=True)
class BinaryInputConfig(InputConfig):
    """Binary input configuration."""

    aggregation: str | None = None
    aggregation_count: int | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> BinaryInputConfig:
        if not raw:
            raw = {}
        return cls(
            **InputConfig._base_kwargs(raw),
            aggregation=raw.get("aggregation"),
            aggregation_count=raw.get("aggregation_count"),
        )


_INPUT_CONFIG_TYPES: dict[str, type[InputConfig]] = {
    InputType.MOTION: MotionInputConfig,
    InputType.EVENT: EventInputConfig,
    InputType.TIMER: TimerInputConfig,
    InputType.BUTTON: ButtonInputConfig,
    InputType.BINARY: BinaryInputConfig,
}


@dataclass(frozen=True)
class ActionConfig(BaseConfig):
    """Base class for all activity actions."""

    type: str | None = None

    @classmethod
    def _base_kwargs(cls, raw: dict[str, Any]) -> dict[str, Any]:
        """Shared field parsing, reused by every subclass's from_dict()."""
        return dict(type=raw.get("type"))

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> ActionConfig:
        """Dispatch to the matching subclass by `type`; None/unknown type
        falls back to the base class."""
        if not isinstance(raw, dict):
            raw = {}
        action_type = raw.get("type")
        subclass = (
            _ACTION_CONFIG_TYPES.get(action_type)
            if isinstance(action_type, str)
            else None
        )
        if subclass is None or subclass is cls:
            return cls(**cls._base_kwargs(raw))
        return subclass.from_dict(raw)


@dataclass(frozen=True)
class EntityActionConfig(ActionConfig):
    """Action to activate a specific entity (scene or script)."""

    entity_id: str | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> EntityActionConfig:
        if not raw:
            raw = {}
        return cls(**ActionConfig._base_kwargs(raw), entity_id=raw.get("entity_id"))


@dataclass(frozen=True)
class LightActionConfig(ActionConfig):
    """Action to set light parameters directly."""

    targets: tuple[str, ...] = ()
    state: str | None = None
    brightness: int | None = None
    color_temp: int | None = None
    rgb_color: tuple[int, int, int] | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> LightActionConfig:
        if not raw:
            raw = {}
        raw_rgb = raw.get("rgb_color")
        parsed_rgb: tuple[int, int, int] | None = None
        if isinstance(raw_rgb, (list, tuple)) and len(raw_rgb) == 3:
            parsed_rgb = (raw_rgb[0], raw_rgb[1], raw_rgb[2])
        return cls(
            **ActionConfig._base_kwargs(raw),
            targets=tuple(raw.get("targets") or ()),
            state=raw.get("state"),
            brightness=raw.get("brightness"),
            color_temp=raw.get("color_temp"),
            rgb_color=parsed_rgb,
        )


@dataclass(frozen=True)
class SlotActionConfig(ActionConfig):
    """Action that schedules slots."""

    excluded_slots: dict[str, tuple[str, ...]] | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> SlotActionConfig:
        if not raw:
            raw = {}
        excluded_slots = raw.get("excluded_slots")
        return cls(
            **ActionConfig._base_kwargs(raw),
            excluded_slots={
                channel_id: tuple(slot_ids)
                for channel_id, slot_ids in excluded_slots.items()
                if isinstance(slot_ids, list | tuple)
            }
            if isinstance(excluded_slots, dict)
            else None,
        )


@dataclass(frozen=True)
class BlockActionConfig(ActionConfig):
    """Block action (no light action on start)."""


@dataclass(frozen=True)
class TurnOffActionConfig(ActionConfig):
    """Release-side only action to turn off lights."""


@dataclass(frozen=True)
class SimulationActionConfig(ActionConfig):
    """Action for presence simulation.

    `mode` is the umbrella dispatch key (only `presence_heatmap` in v1).
    `template_activity` names the light-switching activity whose start/release
    action is played back heatmap-timed. `lux_mode` gates the "on" step.
    `heatmap_profile_id` picks a saved snapshot; empty = dynamic recorder window.
    """

    mode: str | None = None
    template_activity: str | None = None
    lux_mode: str | None = None
    heatmap_profile_id: str | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> SimulationActionConfig:
        if not raw:
            raw = {}
        return cls(
            **ActionConfig._base_kwargs(raw),
            mode=raw.get("mode"),
            template_activity=raw.get("template_activity"),
            lux_mode=raw.get("lux_mode"),
            heatmap_profile_id=raw.get("heatmap_profile_id"),
        )


@dataclass(frozen=True)
class EntityTargetConfig(BaseConfig):
    """A single additional entity to act on, e.g. as part of a `reset` action."""

    entity_id: str | None = None
    action: str | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> EntityTargetConfig:
        return cls(entity_id=raw.get("entity_id"), action=raw.get("action"))


@dataclass(frozen=True)
class ResetActionConfig(ActionConfig):
    """Reset coordinator state."""

    entity_targets: tuple[EntityTargetConfig, ...] = ()

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> ResetActionConfig:
        if not raw:
            raw = {}
        return cls(
            **ActionConfig._base_kwargs(raw),
            entity_targets=tuple(
                EntityTargetConfig.from_dict(t)
                for t in raw.get("entity_targets") or ()
                if isinstance(t, dict)
            ),
        )


_ACTION_CONFIG_TYPES: dict[str, type[ActionConfig]] = {
    ActionType.SLOT: SlotActionConfig,
    ActionType.ENTITY: EntityActionConfig,
    ActionType.LIGHT: LightActionConfig,
    ActionType.BLOCK: BlockActionConfig,
    ActionType.TURN_OFF: TurnOffActionConfig,
    ActionType.SIMULATION: SimulationActionConfig,
    ActionType.RESET: ResetActionConfig,
}


@dataclass(frozen=True)
class ActivityConfig(BaseConfig):
    """One activity definition (freely named, referenced by inputs).

    `action`/`release_action` are parsed to ActionConfig objects, and
    `None`-typed actions fall back to the global default in the coordinator.
    """

    id: str
    name: str | None = None
    suppress_inputs: tuple[str, ...] = ()
    auto_expire: str | None = None
    expire_check_mode: str | None = None
    action: ActionConfig | None = None
    release_action: ActionConfig | None = None
    transition_off_seconds: int | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> ActivityConfig:
        """Parse an activity dict (store-normalized or test-provided)."""
        action_raw = raw.get("action")
        if isinstance(action_raw, dict):
            if not action_raw.get("type"):
                action_raw = {**action_raw, "type": DEFAULT_ACTION_TYPE}
            parsed_action = ActionConfig.from_dict(action_raw)
        else:
            parsed_action = None

        release_raw = raw.get("release_action")
        if isinstance(release_raw, dict):
            if not release_raw.get("type"):
                release_raw = {**release_raw, "type": DEFAULT_RELEASE_ACTION_TYPE}
            parsed_release = ActionConfig.from_dict(release_raw)
        else:
            parsed_release = None

        act_id = raw.get("id") or ""
        is_block_or_reset = isinstance(parsed_action, (BlockActionConfig, ResetActionConfig))
        return cls(
            id=act_id,
            name=raw.get("name") or act_id.capitalize(),
            suppress_inputs=tuple(raw.get("suppress_inputs") or ()),
            auto_expire=raw.get("auto_expire") if not isinstance(parsed_action, ResetActionConfig) else None,
            expire_check_mode=None if is_block_or_reset else raw.get("expire_check_mode"),
            action=parsed_action,
            release_action=parsed_release,
            transition_off_seconds=None if is_block_or_reset else raw.get("transition_off_seconds"),
        )


@dataclass(frozen=True)
class HeatmapProfileConfig(BaseConfig):
    """Saved heatmap snapshot profile configuration."""

    id: str
    name: str
    resolution: str
    range: str
    created_at: str
    updated_at: str
    motion_buckets: dict[str, list[float]]

    def to_dict(self) -> dict[str, Any]:
        """Convert the heatmap profile config to a dictionary representation."""
        return {
            "id": self.id,
            "name": self.name,
            "resolution": self.resolution,
            "range": self.range,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "motion_buckets": self.motion_buckets,
        }

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> HeatmapProfileConfig:
        """Parse a heatmap profile dict."""
        return cls(
            id=raw.get("id") or "",
            name=raw.get("name") or "",
            resolution=raw.get("resolution") or "15m",
            range=raw.get("range") or "2w",
            created_at=raw.get("created_at") or "",
            updated_at=raw.get("updated_at") or "",
            motion_buckets=raw.get("motion_buckets") or {},
        )


@dataclass(frozen=True)
class RuleConfig(BaseConfig):
    """Configuration for a parallel Rule (v1: slot schedule override)."""

    id: str
    name: str
    enabled: bool = True
    applied_activities: tuple[str, ...] = ()
    excluded_slots_override: dict[str, dict[str, tuple[str, ...]]] = field(default_factory=dict)
    auto_expire_mode: RuleAutoExpireMode = RuleAutoExpireMode.NONE
    suppressed_inputs_override: tuple[str, ...] = ()

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> RuleConfig:
        if not raw:
            raw = {}
        applied_activities = raw.get("applied_activities")
        raw_overrides = raw.get("excluded_slots_override")

        excluded_slots_override: dict[str, dict[str, tuple[str, ...]]] = {}
        if isinstance(raw_overrides, dict):
            for act_id, ch_dict in raw_overrides.items():
                if isinstance(ch_dict, dict):
                    ch_map: dict[str, tuple[str, ...]] = {}
                    for ch_id, slot_list in ch_dict.items():
                        if isinstance(slot_list, (list, tuple)):
                            ch_map[ch_id] = tuple(slot_list)
                    excluded_slots_override[act_id] = ch_map

        raw_mode = raw.get("auto_expire_mode")
        try:
            auto_expire_mode = (
                RuleAutoExpireMode(raw_mode) if raw_mode else RuleAutoExpireMode.NONE
            )
        except ValueError:
            auto_expire_mode = RuleAutoExpireMode.NONE

        suppressed_inputs_override = raw.get("suppressed_inputs_override")

        return cls(
            id=raw.get("id") or "",
            name=raw.get("name") or "",
            enabled=raw.get("enabled", True),
            applied_activities=tuple(applied_activities)
            if isinstance(applied_activities, (list, tuple))
            else (),
            excluded_slots_override=excluded_slots_override,
            auto_expire_mode=auto_expire_mode,
            suppressed_inputs_override=tuple(suppressed_inputs_override)
            if isinstance(suppressed_inputs_override, (list, tuple))
            else (),
        )


@dataclass(frozen=True)
class AreaConfig(BaseConfig):
    """The full typed configuration of one Twilight area."""

    area_id: str | None
    name: str | None
    enabled: bool
    manual_only: bool
    sensors: tuple[SensorConfig, ...]
    channels: dict[str, ChannelConfig]
    inputs: tuple[InputConfig, ...]
    activities: tuple[ActivityConfig, ...]
    rules: tuple[RuleConfig, ...] = ()
    heatmap_profiles: tuple[HeatmapProfileConfig, ...] = ()
    lux_threshold: float | int | None = None
    lux_watch_window: int | None = None
    transition_on_seconds: float | int | None = None
    lux_ignore_active: bool | None = None
    lux_ignore_scope: str | None = None

    # ── Structural lookups ──

    def channel(self, channel_id: str) -> ChannelConfig | None:
        """Look up a channel by id, or None."""
        return self.channels.get(channel_id)

    def slot(self, channel_id: str, slot_id: str | None) -> SlotConfig | None:
        """Look up a slot by (channel, slot) id, or None."""
        channel = self.channels.get(channel_id)
        return channel.slot(slot_id) if channel else None

    def inputs_of_type(self, input_type: InputType | str) -> tuple[InputConfig, ...]:
        """All inputs of one type, in config order."""
        return tuple(inp for inp in self.inputs if inp.type == input_type)

    def input_by_id(self, input_id: str | None) -> InputConfig | None:
        """Look up an input by id, or None."""
        if not input_id:
            return None
        for inp in self.inputs:
            if inp.id == input_id:
                return inp
        return None

    def activity_by_id(self, activity_id: str | None) -> ActivityConfig | None:
        """Look up an activity by id, or None."""
        if not activity_id:
            return None
        for act in self.activities:
            if act.id == activity_id:
                return act
        return None

    def sensors_of_type(
        self, sensor_type: SensorType | str
    ) -> tuple[SensorConfig, ...]:
        """All sensors of one type, in config order."""
        return tuple(s for s in self.sensors if s.type == sensor_type)

    def rule_by_id(self, rule_id: str | None) -> RuleConfig | None:
        """Look up a rule by id, or None."""
        if not rule_id:
            return None
        for r in self.rules:
            if r.id == rule_id:
                return r
        return None

    def heatmap_profile_by_id(
        self, profile_id: str | None
    ) -> HeatmapProfileConfig | None:
        """Look up a saved heatmap profile by id, or None."""
        if not profile_id:
            return None
        for p in self.heatmap_profiles:
            if p.id == profile_id:
                return p
        return None

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> AreaConfig:
        """Parse a full area config dict; non-dict entries are skipped."""
        channels_raw = raw.get("channels")
        channels = {
            ch_id: ChannelConfig.from_dict(ch_id, ch)
            for ch_id, ch in (
                channels_raw.items() if isinstance(channels_raw, dict) else ()
            )
            if isinstance(ch, dict)
        }
        inputs_raw = raw.get("inputs")
        inputs = tuple(
            InputConfig.from_dict(inp)
            for inp in (inputs_raw if isinstance(inputs_raw, list) else [])
            if isinstance(inp, dict)
        )
        activities_raw = raw.get("activities")
        activities = tuple(
            ActivityConfig.from_dict(act)
            for act in (activities_raw if isinstance(activities_raw, list) else [])
            if isinstance(act, dict)
        )
        sensors_raw = raw.get("sensors")
        sensors = tuple(
            SensorConfig.from_dict(s)
            for s in (sensors_raw if isinstance(sensors_raw, list) else [])
            if isinstance(s, dict)
        )
        rules_raw = raw.get("rules")
        rules = tuple(
            RuleConfig.from_dict(r)
            for r in (rules_raw if isinstance(rules_raw, list) else [])
            if isinstance(r, dict)
        )
        profiles_raw = raw.get("heatmap_profiles")
        heatmap_profiles = tuple(
            HeatmapProfileConfig.from_dict(p)
            for p in (profiles_raw if isinstance(profiles_raw, list) else [])
            if isinstance(p, dict)
        )
        return cls(
            area_id=raw.get("area_id"),
            name=raw.get("name"),
            enabled=raw.get("enabled", True),
            manual_only=bool(raw.get("manual_only", False)),
            lux_threshold=raw.get("lux_threshold"),
            lux_watch_window=raw.get("lux_watch_window"),
            transition_on_seconds=raw.get("transition_on_seconds"),
            lux_ignore_active=raw.get("lux_ignore_active"),
            lux_ignore_scope=raw.get("lux_ignore_scope"),
            sensors=sensors,
            channels=channels,
            inputs=inputs,
            activities=activities,
            rules=rules,
            heatmap_profiles=heatmap_profiles,
        )
