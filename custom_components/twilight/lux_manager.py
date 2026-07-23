"""LuxManager for Twilight coordinator."""

from __future__ import annotations

import logging
import statistics
from typing import TYPE_CHECKING

from .config_model import IlluminanceSensorConfig
from .const import DEFAULT_LUX_AGGREGATION, SensorType

if TYPE_CHECKING:
    from .coordinator import Coordinator

_LOGGER = logging.getLogger(__name__)


class LuxManager:
    """Manages reading and aggregating illuminance (lux) sensors."""

    def __init__(self, coordinator: Coordinator) -> None:
        """Initialize the LuxManager."""
        self._c = coordinator
        self.hass = coordinator.engine.hass

    def get_current_lux(self) -> float | None:
        """Get the aggregated lux value across all configured lux sensors."""
        # Get all illuminance sensors
        illuminance_sensors = self._c.engine.config.sensors_of_type(
            SensorType.ILLUMINANCE
        )
        if not illuminance_sensors:
            return None

        # Twilight supports at most one illuminance sensor entry per area at this time
        sensor = illuminance_sensors[0]
        if not isinstance(sensor, IlluminanceSensorConfig):
            return None

        values = []
        for entity_id in sensor.entity_ids:
            state = self.hass.states.get(entity_id)
            if not state:
                continue
            try:
                values.append(float(state.state))
            except (ValueError, TypeError):
                continue

        if not values:
            return None

        aggregation = sensor.aggregation or DEFAULT_LUX_AGGREGATION
        return self._aggregate_group(values, aggregation)

    def _aggregate_group(self, values: list[float], aggregation: str) -> float | None:
        """Aggregate a list of float values using the specified method."""
        if not values:
            return None
        if aggregation == "max":
            return max(values)
        if aggregation == "mean":
            return sum(values) / len(values)
        if aggregation == "median":
            return statistics.median(values)

        return min(values)

    def update_lux_state(self) -> None:
        """Calculate current lux and update the coordinator run state."""
        lux_val = self.get_current_lux()
        self._c.update_state(lux_value=lux_val)
