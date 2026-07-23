# Changelog

## 0.1.0 - 2026-07-23

First public (experimental) release. Twilight is functional but not
feature-complete; the configuration model is still evolving and breaking
changes between versions are expected.

### ✨ Features

*   **Solar-aware scheduling**: 10 astral zones per area (dawn to dusk, golden hour to night), with per-slot scene/script and offset configuration.

*   **Multi-channel areas**: a fixed Primary channel plus up to 3 custom channels per area, each with its own slot set and transition, sharing the area's sensors and inputs.

*   **Input-driven activities**: motion, binary sensor, event, timer, and button inputs mapped to freely named activities; per-activity start/release actions (slot/scene/script/light/turn-off/none).

*   **Multi-entity inputs**: several entities per input — motion with configurable re-trigger, binary with `any`/`all`/`count` aggregation.

*   **Lux gating**: illuminance sensors as a per-input threshold, with configurable ignore scopes.

*   **Anticipatory transitions**: two-stage slot fades with a per-light retry loop and deviation watching.

*   **Full Web UI**: a Lit-based sidebar panel (Areas, Analytics, Timeline, Settings) — all configuration happens in the UI, no YAML beyond `twilight:` in `configuration.yaml`.

*   **Analytics & timeline**: uPlot charts over real Recorder data, plus day/year sun-path visualizations.

*   **Config backup & restore**: versioned export/import of the full store.
