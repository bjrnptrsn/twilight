import { html, type TemplateResult } from 'lit'
import type { AttrEntry } from './types'

export function renderLightAttrCell(entry: AttrEntry | null, badge: string): TemplateResult {
  if (!entry) return html`<span>—</span>`
  const swatch = (css: string | null) =>
    css ? html`<div style="width:10px; height:10px; border-radius:3px; background:${css}; flex-shrink:0;"></div>` : ''
  const line = (label: string, swatchCss: string | null, isBadge: boolean) => html`
    <div style="display:flex; justify-content:center; align-items:center; gap:6px;">
      ${swatch(swatchCss)}
      <span class=${isBadge ? `mismatch-badge ${badge}` : ''}>${label}</span>
    </div>`

  if (!entry.deviates) return line(entry.actual, entry.actual_swatch, false)
  return html`
    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
      ${line(entry.actual, entry.actual_swatch, false)}
      ${line(entry.target, entry.target_swatch, true)}
    </div>`
}
