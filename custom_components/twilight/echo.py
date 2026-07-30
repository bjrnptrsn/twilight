"""Echo detection — distinguish Twilight's own service-call side effects
from external state changes, based on the Context-ID chain.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from .const import CONTEXT_PREFIX


@dataclass(frozen=True)
class EchoOrigin:
    """Parsed identity of a Twilight-originated context ID.

    `channel_id` and `suffix` reflect `BaseCallHandler._make_context_id()`'s
    `f"{CONTEXT_PREFIX}{area_id}_{channel_id}_{suffix}"` format. Both are None
    if the context ID doesn't split into that shape (unexpected, but the
    caller should not crash over a logging/diagnostics detail).
    """

    channel_id: str | None
    suffix: str | None


def _parse_context_id(context_id: str, area_id: str) -> EchoOrigin | None:
    prefix = f"{CONTEXT_PREFIX}{area_id}_"
    if not context_id.startswith(prefix):
        return None
    remainder = context_id[len(prefix) :]
    channel_id, sep, suffix = remainder.partition("_")
    if not sep:
        return EchoOrigin(channel_id=None, suffix=remainder or None)
    return EchoOrigin(channel_id=channel_id, suffix=suffix)


def identify_echo(context: Any, area_id: str) -> EchoOrigin | None:
    """Return the parsed origin if the event context is one of this area's
    own Twilight calls, else None.

    Two detection paths, same as `is_own_echo()`:
    1. Direct context ID (test mocks, some HA paths write state with the
       call's context directly).
    2. `origin_event` chain (production HA wraps the state_changed event).
    """
    context_id = getattr(context, "id", None)
    if context_id:
        origin = _parse_context_id(context_id, area_id)
        if origin is not None:
            return origin

    origin_event = getattr(context, "origin_event", None)
    if (
        origin_event is not None
        and getattr(origin_event, "event_type", None) == "call_service"
    ):
        origin_context = getattr(origin_event, "context", None)
        origin_context_id = getattr(origin_context, "id", None)
        if origin_context_id:
            origin = _parse_context_id(origin_context_id, area_id)
            if origin is not None:
                return origin

    return None


def is_own_echo(context: Any, area_id: str) -> bool:
    """Return True if the event context originates from this area's Twilight calls."""
    return identify_echo(context, area_id) is not None
