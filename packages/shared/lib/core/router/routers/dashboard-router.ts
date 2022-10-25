import { writable } from 'svelte/store'

import { Router } from '../classes'
import { DashboardRoute } from '../enums'

export const dashboardRouter = writable<DashboardRouter>(null)
export const dashboardRoute = writable<DashboardRoute>(null)

export class DashboardRouter extends Router<DashboardRoute> {
    constructor() {
        super(DashboardRoute.Wallet, dashboardRoute)
    }
}
