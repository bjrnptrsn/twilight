"""Echo detection — distinguish Twilight's own service-call side effects
from external state changes, based on the Context-ID chain.
"""

from __future__ import annotations

from collections.abc import Iterable
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


def _parse_context_id(
    context_id: str, area_id: str, known_channel_ids: Iterable[str] = ()
) -> EchoOrigin | None:
    prefix = f"{CONTEXT_PREFIX}{area_id}_"
    if not context_id.startswith(prefix):
        return None
    remainder = context_id[len(prefix) :]

    # Channel ids are free-form slugs derived from the channel name
    # ("wall_lights") or seeded from the area template ("channel_e0c3dd6b"), so
    # they routinely contain underscores. A plain partition("_") split them in
    # the middle — "wall_lights_evening" became channel="wall",
    # suffix="lights_evening" — making the channel/suffix in echo debug logs
    # wrong for every multi-word channel.
    #
    # Match against the ids the engine actually has instead of guessing a
    # shape. Longest first, so a channel id that is a prefix of another one
    # ("wall" vs "wall_lights") cannot shadow the longer match.
    candidates: list[str] = sorted(known_channel_ids, key=len, reverse=True)
    if candidates:
        for channel_id in candidates:
            if remainder == channel_id:
                return EchoOrigin(channel_id=channel_id, suffix=None)
            if remainder.startswith(f"{channel_id}_"):
                return EchoOrigin(
                    channel_id=channel_id, suffix=remainder[len(channel_id) + 1 :]
                )
        return None

    # No channel list supplied: fall back to naive split.
    parts = remainder.split("_", 1)
    return EchoOrigin(
        channel_id=parts[0] if parts[0] else None,
        suffix=parts[1] if len(parts) > 1 else None,
    )


def identify_echo(
    context: Any, area_id: str, known_channel_ids: Iterable[str] = ()
) -> EchoOrigin | None:
    """Return the parsed origin if the event context is one of this area's
    own Twilight calls, else None.

    Two detection paths, same as `is_own_echo()`:
    1. Direct context ID (test mocks, some HA paths write state with the
       call's context directly).
    2. `origin_event` chain (production HA wraps the state_changed event).

    `known_channel_ids` (the engine's configured channel ids) lets the parser
    split `channel_id` from `suffix` correctly for channel ids containing
    underscores. It only sharpens the reported origin — whether something *is*
    an echo depends solely on the area prefix.
    """
    context_id = getattr(context, "id", None)
    if context_id:
        origin = _parse_context_id(context_id, area_id, known_channel_ids)
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
            origin = _parse_context_id(
                origin_context_id, area_id, known_channel_ids
            )
            if origin is not None:
                return origin

    return None


def is_own_echo(context: Any, area_id: str) -> bool:
    """Return True if the event context originates from this area's Twilight calls."""
    return identify_echo(context, area_id) is not None
