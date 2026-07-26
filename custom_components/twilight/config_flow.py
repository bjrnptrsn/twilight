"""Minimal config flow for Twilight — not user-facing configuration.

Twilight is configured entirely via `twilight:` in configuration.yaml plus the
sidebar panel — no Config Flow for actual settings. This flow exists solely to
anchor a single, silently self-created config entry that the HA device registry
requires to group button/switch entities per area into a device.
`single_config_entry: true` in manifest.json makes HA reject any second attempt
automatically.
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN


class TwilightConfigFlow(ConfigFlow, domain=DOMAIN):
    """Auto-created, single-instance config entry — anchors the device registry."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle a flow initialized by the user (not part of the intended UX)."""
        if user_input is not None:
            return self.async_create_entry(title="Twilight", data={})
        return self.async_show_form(step_id="user")

    async def async_step_import(
        self, import_data: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Self-create the single entry on first boot — no user interaction."""
        return self.async_create_entry(title="Twilight", data={})
