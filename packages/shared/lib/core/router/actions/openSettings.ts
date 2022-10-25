import { get } from 'svelte/store'

import { DashboardRoute } from '../enums'
import { dashboardRouter, settingsRouter } from '../routers'

export function openSettings(): void {
    get(dashboardRouter).goTo(DashboardRoute.Settings)
    get(settingsRouter).reset()
}
