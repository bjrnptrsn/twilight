"""Typed configuration model for Twilight areas.

Parsed once per engine from the (store-normalized) raw config dict. All
structural data — channels, slots, inputs, activities — is exposed as frozen
dataclasses so consumers get attribute access and IDE/mypy coverage instead of
`.get()` chains with hand-rolled `isinstance` guards (the root cause of a past
binary-input matching bug from missing type guards).

Scalar settings (lux_threshold, retry_send, transition_seconds, …) deliberately
stay in the raw dict and are read through `get(key)`: their `None means
"inherit"` semantics drive the 3-level fallback in `helpers.get_config_value`
(area → global → const default), which duck-types on `.get()`. Every dataclass
here therefore offers a dict-compatible `get()` bridging to its raw dict.

The model is immutable by design: mutating config after engine setup is not
supported — rebuild the engine (that is what `area/save` does).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, cast

from .const import ActionType, InputType, SensorType, StartType


class _RawGetMixin:
    """Dict-compatible `get()` bridge shared by all config dataclasses.

    Each concrete class supplies `raw` as its own frozen dataclass field (so
    field ordering stays under the subclass's control). The mixin deliberately
    does not annotate `raw` — a plain annotation conflicts with the read-only
    frozen field, and a runtime descriptor would shadow it — so it reads the
    field reflectively for the `get_config_value` / legacy-call-site bridge.
    """

    def get(self, key: str, default: Any = None) -> Any:
        """Dict-compatible bridge for get_config_value / legacy call sites."""
        raw = cast("dict[str, Any]", getattr(self, "raw", {}))
        return raw.get(key, default)


@dataclass(frozen=True)
class SlotConfig(_RawGetMixin):
    """One slot of a channel (astral zone or fixed local time)."""

    id: str | None
    name: str | None
    start_type: str
    zone: str | None
    fixed_time: str | None
    offset_minutes: int
    scene_entity_id: str | None
    configured_entities: tuple[str, ...]
    raw: dict[str, Any] = field(repr=False, compare=False, default_factory=dict)

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
            raw=raw,
        )


@dataclass(frozen=True)
class ChannelConfig(_RawGetMixin):
    """One channel of an area (Primary or custom)."""

    id: str
    name: str | None
    enabled: bool
    slots: tuple[SlotConfig, ...]
    transition_on_seconds: int | None = None
    raw: dict[str, Any] = field(repr=False, compare=False, default_factory=dict)

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
            raw=raw,
        )


@dataclass(frozen=True)
class SensorConfig(_RawGetMixin):
    """One sensor mapping (e.g. illuminance)."""

    id: str | None
    type: str
    name: str | None = None
    raw: dict[str, Any] = field(repr=False, compare=False, default_factory=dict)

    @classmethod
    def _base_kwargs(cls, raw: dict[str, Any]) -> dict[str, Any]:
        """Shared field parsing, reused by every subclass's from_dict()."""
        return dict(
            id=raw.get("id"),
            type=raw.get("type") or "",
            name=raw.get("name"),
            raw=raw,
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
class InputConfig(_RawGetMixin):
    """One input mapping (motion/binary/event/timer/button → activity).

    `enabled` keeps three states on purpose: `False` means explicitly disabled
    by the user (adds the "user" disabler), `True`/`None` mean enabled —
    matching the raw-dict semantics where an absent key is not a disable.
    """

    id: str | None
    type: str
    entity_ids: tuple[str, ...]
    activity: str | None
    enabled: bool | None
    name: str | None = None
    raw: dict[str, Any] = field(repr=False, compare=False, default_factory=dict)

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
            enabled=raw.get("enabled"),
            name=raw.get("name"),
            raw=raw,
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

    trigger_time: str | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> TimerInputConfig:
        if not raw:
            raw = {}
        return cls(**InputConfig._base_kwargs(raw), trigger_time=raw.get("trigger_time"))


@dataclass(frozen=True)
class ButtonInputConfig(InputConfig):
    """Button input configuration."""

    button_mode: str | None = None
    label: str | None = None
    create_entity: bool | None = None

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
class ActionConfig(_RawGetMixin):
    """Base class for all activity actions."""

    type: str | None
    raw: dict[str, Any] = field(repr=False, compare=False, default_factory=dict)

    @classmethod
    def _base_kwargs(cls, raw: dict[str, Any]) -> dict[str, Any]:
        """Shared field parsing, reused by every subclass's from_dict()."""
        return dict(type=raw.get("type"), raw=raw)

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
        rgb_color = raw.get("rgb_color")
        return cls(
            **ActionConfig._base_kwargs(raw),
            targets=tuple(raw.get("targets") or ()),
            state=raw.get("state"),
            brightness=raw.get("brightness"),
            color_temp=raw.get("color_temp"),
            rgb_color=(rgb_color[0], rgb_color[1], rgb_color[2])
            if rgb_color and len(rgb_color) == 3
            else None,
        )


@dataclass(frozen=True)
class SlotActionConfig(ActionConfig):
    """Action that schedules slots."""

    excluded_slot_ids: dict[str, tuple[str, ...]] | None = None

    @classmethod
    def from_dict(cls, raw: dict[str, Any] | None) -> SlotActionConfig:
        if not raw:
            raw = {}
        excluded_slot_ids = raw.get("excluded_slot_ids")
        return cls(
            **ActionConfig._base_kwargs(raw),
            excluded_slot_ids={
                channel_id: tuple(slot_ids)
                for channel_id, slot_ids in excluded_slot_ids.items()
                if isinstance(slot_ids, list | tuple)
            }
            if isinstance(excluded_slot_ids, dict)
            else None,
        )


@dataclass(frozen=True)
class NoneActionConfig(ActionConfig):
    """No-op action."""


@dataclass(frozen=True)
class TurnOffActionConfig(ActionConfig):
    """Release-side only action to turn off lights."""


@dataclass(frozen=True)
class SimulationActionConfig(ActionConfig):
    """Action for presence simulation."""


@dataclass(frozen=True)
class EntityTargetConfig:
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
    ActionType.NONE: NoneActionConfig,
    ActionType.TURN_OFF: TurnOffActionConfig,
    ActionType.SIMULATION: SimulationActionConfig,
    ActionType.RESET: ResetActionConfig,
}


@dataclass(frozen=True)
class ActivityConfig(_RawGetMixin):
    """One activity definition (freely named, referenced by inputs).

    `action`/`release_action` are parsed to ActionConfig objects, and
    `None`-typed actions fall back to the global default in the coordinator.
    """

    id: str
    suppress_inputs: tuple[str, ...]
    auto_expire: str | None
    expire_check_mode: str | None
    action: ActionConfig | None
    release_action: ActionConfig | None
    transition_off_seconds: int | None
    raw: dict[str, Any] = field(repr=False, compare=False, default_factory=dict)

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> ActivityConfig:
        """Parse an activity dict (store-normalized or test-provided)."""
        action = raw.get("action")
        release = raw.get("release_action")
        return cls(
            id=raw.get("id") or "",
            suppress_inputs=tuple(raw.get("suppress_inputs") or ()),
            auto_expire=raw.get("auto_expire"),
            expire_check_mode=raw.get("expire_check_mode"),
            action=ActionConfig.from_dict(action) if isinstance(action, dict) else None,
            release_action=ActionConfig.from_dict(release)
            if isinstance(release, dict)
            else None,
            transition_off_seconds=raw.get("transition_off_seconds"),
            raw=raw,
        )


@dataclass(frozen=True)
class AreaConfig(_RawGetMixin):
    """The full typed configuration of one Twilight area.

    Replaces the raw dict as `engine.config`. Structural access goes through
    the typed fields/helpers below; scalar settings and unknown keys go through
    `get()` (raw dict), preserving the 3-level fallback semantics.
    """

    area_id: str | None
    name: str | None
    enabled: bool
    manual_only: bool
    sensors: tuple[SensorConfig, ...]
    channels: dict[str, ChannelConfig]
    inputs: tuple[InputConfig, ...]
    activities: tuple[ActivityConfig, ...]
    raw: dict[str, Any] = field(repr=False, compare=False, default_factory=dict)

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
        return cls(
            area_id=raw.get("area_id"),
            name=raw.get("name"),
            enabled=raw.get("enabled", True),
            manual_only=bool(raw.get("manual_only", False)),
            sensors=sensors,
            channels=channels,
            inputs=inputs,
            activities=activities,
            raw=raw,
        )
