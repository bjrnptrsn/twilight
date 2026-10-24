import './prelude'
import { customElement } from 'lit/decorators.js'
import { TwilightPanelBase } from './panel-base'
import type { TabConfig } from './components/tab-bar'

// Import only production views to ensure dev views are tree-shaken
import './views/areas-view'
import './views/analytics-view'
import './views/timeline-view'
import './views/settings-view'

const PROD_TABS: TabConfig[] = [
  { id: 'areas', label: 'Areas' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'settings', label: 'Settings' },
]

@customElement('twilight-panel')
export class TwilightPanel extends TwilightPanelBase {
  constructor() {
    super()
    this.tabs = PROD_TABS
  }
}
