import { writable } from 'svelte/store'

import { DashboardRoute } from './enums'
import { Router } from './router'

export const dashboardRouter = writable<DashboardRouter>(null)
export const dashboardRoute = writable<DashboardRoute>(null)

export class DashboardRouter extends Router<DashboardRoute> {
    constructor() {
        super(DashboardRoute.Wallet, dashboardRoute)
    }
}
