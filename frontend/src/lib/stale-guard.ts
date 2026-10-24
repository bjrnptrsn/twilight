/**
 * Guard against out-of-order async responses.
 *
 * Views load data asynchronously (area details, sun year data, heatmaps). When
 * the user switches area/tab faster than a response arrives, a *stale* response
 * can land after a newer one and overwrite it — e.g. area A's config ending up
 * in area B's draft.
 *
 * Each `begin()` invalidates every earlier token; `isCurrent()` tells a
 * resolving request whether it is still the one whose result should be applied.
 *
 * Usage:
 * ```ts
 * private _load = new StaleGuard()
 * ...
 * const token = this._load.begin()
 * const result = await api.something(...)
 * if (!token.isCurrent()) return   // a newer load superseded this one
 * this._data = result
 * ```
 */
export class StaleGuard {
  private _seq = 0

  /** Start a new request, superseding all earlier ones. */
  begin(): StaleToken {
    const id = ++this._seq
    return { isCurrent: () => id === this._seq }
  }

  /**
   * Invalidate all in-flight requests without starting a new one.
   * Use on disconnect, or when clearing state on purpose.
   */
  cancel(): void {
    this._seq++
  }
}

export interface StaleToken {
  /** True while this is still the most recent request from its guard. */
  isCurrent(): boolean
}
