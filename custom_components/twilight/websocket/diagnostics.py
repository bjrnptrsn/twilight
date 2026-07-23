"""Diagnostics WebSocket command for Twilight."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from ..diagnostics import build_diagnostics


def _ws_diagnostics() -> websocket_api.WebSocketCommandHandler:
    @websocket_api.websocket_command({vol.Required("type"): "twilight/diagnostics"})
    @websocket_api.require_admin
    @callback
    def handle(
        hass: HomeAssistant,
        connection: websocket_api.ActiveConnection,
        msg: dict[str, Any],
    ) -> None:
        connection.send_result(msg["id"], build_diagnostics(hass))

    return handle
