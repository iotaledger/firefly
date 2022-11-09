import { get } from 'svelte/store'
import { dashboardRouter } from '@core/router/routers'

export function resetDashboardRouters(): void {
    get(dashboardRouter).reset()
}
