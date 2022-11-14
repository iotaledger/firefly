import { get } from 'svelte/store'

import { DashboardRoute } from '@core/router/enums'
import { dashboardRouter, settingsRouter } from '@core/router/routers'

export function openSettings(): void {
    get(dashboardRouter).goTo(DashboardRoute.Settings)
    get(settingsRouter).reset()
}
