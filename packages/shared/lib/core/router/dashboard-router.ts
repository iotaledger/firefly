import { writable } from 'svelte/store'

import { DashboardRoutes } from './enums'
import { Router } from './router'

export const dashboardRouter = writable<DashboardRouter>(null)
export const dashboardRoute = writable<DashboardRoutes>(null)

export class DashboardRouter extends Router<DashboardRoutes> {
    constructor() {
        super(DashboardRoutes.Wallet, dashboardRoute)
    }
}
