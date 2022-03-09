import { DashboardRoutes } from '@core/router/enum/routes'
import { Router } from 'shared/lib/core/router/router'
import { writable } from 'svelte/store'

export const dashboardRouter = writable<DashboardRouter>(null)
export const dashboardRoute = writable<DashboardRoutes>(null)

export class DashboardRouter extends Router<DashboardRoutes> {
    constructor() {
        super(DashboardRoutes.Wallet, dashboardRoute)
    }
}
