"""Optional HA switch entities for toggle-mode Twilight button inputs.

Twilight has no user-facing Config Flow — entities are managed manually via a
single, integration-owned EntityComponent instead of the usual
async_setup_entry/platform-forwarding path. A single, silently self-created
config entry (config_flow.py) is attached to the platform below purely so the
device registry has a config_entry_id to anchor per-area devices to.
"""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_component import EntityComponent

from .config_model import AreaConfig, ButtonInputConfig
from .const import DOMAIN, SIGNAL_STATE_CHANGED
from .helpers import dispatch_button_input
from .state import RunState
from .twilight_entity import TwilightEntity, attach_config_entry

_LOGGER = logging.getLogger(__name__)

PLATFORM = "switch"


class TwilightSwitchEntity(TwilightEntity, SwitchEntity):
    """A toggleable HA switch backing a toggle-mode Twilight button input.

    No own state is kept — is_on reads live from RunState.inputs_active, the
    same source ButtonInputHandler.toggle() writes on every trigger, whether
    it came from the WS/panel path or from this entity.
    """

    async def async_added_to_hass(self) -> None:
        await super().async_added_to_hass()

        @callback
        def _state_changed(
            area_id: str, old_state: RunState, new_state: RunState
        ) -> None:
            if area_id == self._area_id and old_state.inputs_active.get(
                self._input_id
            ) != new_state.inputs_active.get(self._input_id):
                self.async_write_ha_state()

        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_STATE_CHANGED, _state_changed)
        )

    @property
    def name(self) -> str | None:
        inp = self._get_input_config()
        if isinstance(inp, ButtonInputConfig):
            return inp.name or inp.label or self._input_id
        return self._input_id

    @property
    def is_on(self) -> bool:
        engine = self._engine
        if engine is None:
            return False
        return engine.run_state.inputs_active.get(self._input_id, False)

    async def async_turn_on(self, **kwargs: Any) -> None:
        dispatch_button_input(self.hass, self._area_id, self._input_id, active=True)
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        dispatch_button_input(self.hass, self._area_id, self._input_id, active=False)
        self.async_write_ha_state()


def async_setup(hass: HomeAssistant) -> None:
    """Create the shared switch EntityComponent for Twilight (idempotent)."""
    hass.data.setdefault(DOMAIN, {})
    if "switch_component" in hass.data[DOMAIN]:
        return
    component = EntityComponent[TwilightSwitchEntity](_LOGGER, PLATFORM, hass)
    attach_config_entry(hass, component)
    hass.data[DOMAIN]["switch_component"] = component


async def async_sync_switch_entities(
    hass: HomeAssistant, area_id: str, area_config: AreaConfig | dict[str, Any]
) -> None:
    """Reconcile HA switch entities for one area against its current button inputs."""
    async_setup(hass)
    component: EntityComponent[TwilightSwitchEntity] = hass.data[DOMAIN][
        "switch_component"
    ]
    attach_config_entry(hass, component)
    config = (
        area_config
        if isinstance(area_config, AreaConfig)
        else AreaConfig.from_dict(area_config)
    )

    wanted_ids = {
        inp.id
        for inp in config.inputs
        if inp.id
        and isinstance(inp, ButtonInputConfig)
        and (inp.button_mode or "click") == "toggle"
        and inp.create_entity is True
    }

    existing_entities = {
        entity._input_id: entity
        for entity in component.entities
        if isinstance(entity, TwilightSwitchEntity) and entity._area_id == area_id
    }

    to_add = [
        TwilightSwitchEntity(hass, area_id, input_id)
        for input_id in wanted_ids
        if input_id not in existing_entities
    ]
    if to_add:
        await component.async_add_entities(to_add)

    for input_id, entity in existing_entities.items():
        if input_id not in wanted_ids:
            await component.async_remove_entity(entity.entity_id)
        else:
            # Reflect a possible name change (area/input save) immediately
            # instead of waiting for the entity's next unrelated state write.
            entity.async_write_ha_state()
