"""Echo detection — distinguish Twilight's own service-call side effects
from external state changes, based on the Context-ID chain.

See docs/architecture/echo_detection.md for the analysis and rationale.
"""

from __future__ import annotations

from typing import Any

from .const import CONTEXT_PREFIX


def is_own_echo(context: Any, area_id: str) -> bool:
    """Return True if the event context originates from this area's Twilight calls."""
    prefix = f"{CONTEXT_PREFIX}{area_id}_"

    context_id = getattr(context, "id", None)
    if context_id and context_id.startswith(prefix):
        return True

    origin_event = getattr(context, "origin_event", None)
    if (
        origin_event is not None
        and getattr(origin_event, "event_type", None) == "call_service"
    ):
        origin_context = getattr(origin_event, "context", None)
        origin_context_id = getattr(origin_context, "id", None)
        if origin_context_id and origin_context_id.startswith(prefix):
            return True

    return False
