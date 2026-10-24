import { ReactiveController, ReactiveControllerHost } from 'lit'

export interface DraftControllerOptions<T> {
  // May return the server's normalized version of the saved value (e.g. with
  // auto-generated ids filled in) — if provided, it replaces the draft so the
  // UI reflects backend-assigned values without a full reload.
  onSave?: (value: T) => Promise<T | void>
}

export class DraftController<T> implements ReactiveController {
  private _host: ReactiveControllerHost
  private _options: DraftControllerOptions<T>

  public original: T | null = null
  public draft: T | null = null
  public saving = false
  public loading = false
  public saveError: unknown = null
  public isDirty = false

  constructor(host: ReactiveControllerHost, options: DraftControllerOptions<T> = {}) {
    this._host = host
    this._options = options
    this._host.addController(this)
  }

  hostConnected() {}
  hostDisconnected() {}

  public init(value: T) {
    this.original = structuredClone(value)
    this.draft = structuredClone(value)
    this.isDirty = false
    this._host.requestUpdate()
  }

  public update(partial: Partial<T> | ((d: T) => void)) {
    if (!this.draft) return
    if (typeof partial === 'function') {
      // Mutate a copy, then swap the reference in. Mutating this.draft in place
      // would leave its identity unchanged, which silently defeats save()'s
      // `sent === this.draft` stale guard: an edit arriving mid-save would
      // either be overwritten by the server result or marked clean while still
      // unsaved. The object form below already produces a new reference.
      const next = { ...this.draft }
      partial(next)
      this.draft = next
    } else {
      this.draft = { ...this.draft, ...partial }
    }
    this.isDirty = true
    this._host.requestUpdate()
  }

  public async save() {
    if (!this.draft || this.saving) return
    this.saving = true
    this.saveError = null
    this._host.requestUpdate()
    // Snapshot what is actually being sent — update() may keep mutating
    // this.draft while we're awaiting, and that must not be silently marked
    // clean once the in-flight save resolves.
    const sent = this.draft
    let draftUnchanged = true
    let saveOk = false
    try {
      if (this._options.onSave) {
        const result = await this._options.onSave(sent)
        saveOk = true
        draftUnchanged = (sent === this.draft)
        if (result !== undefined && draftUnchanged) {
          this.draft = result
        }
      } else {
        saveOk = true
      }
      // Only mark clean if nothing changed the draft while we were saving —
      // otherwise those newer changes are still unsaved and isDirty must stay.
      if (draftUnchanged) {
        this.original = structuredClone(this.draft)
        this.isDirty = false
      }
    } catch (err) {
      console.error('Error saving draft', err)
      this.saveError = err
    } finally {
      this.saving = false
      this._host.requestUpdate()
    }
    // The draft changed while the save was in flight: those newer changes are
    // still unsaved. Kick off another save so the latest state is persisted
    // too — but only after a successful run, otherwise a persistent failure
    // plus continued edits would loop forever.
    if (saveOk && !draftUnchanged) {
      void this.save()
    }
  }

  public cancel() {
    if (!this.original) return
    this.draft = structuredClone(this.original)
    this.isDirty = false
    this._host.requestUpdate()
  }

  public reset() {
    this.original = null
    this.draft = null
    this.saving = false
    this.loading = false
    this.saveError = null
    this.isDirty = false
    this._host.requestUpdate()
  }
}
