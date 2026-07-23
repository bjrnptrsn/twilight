"""Input trigger WebSocket commands for Twilight."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from ..helpers import dispatch_button_input


def _ws_trigger_input() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command(
        {
            vol.Required("type"): "twilight/trigger_input",
            vol.Required("area_id"): str,
            vol.Required("input_id"): str,
            vol.Optional("active"): bool,
        }
    )
    @websocket_api.require_admin
    @callback
    def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        area_id = msg["area_id"]
        input_id = msg["input_id"]
        active = msg.get("active", False)

        error = dispatch_button_input(hass, area_id, input_id, active)
        if error == "not_found":
            connection.send_error(
                msg["id"],
                "not_found",
                f"Input '{input_id}' not found in area '{area_id}'",
            )
            return
        if error == "invalid_format":
            connection.send_error(
                msg["id"], "invalid_format", f"Input '{input_id}' is not a button input"
            )
            return

        connection.send_result(msg["id"], {})

    return handle
