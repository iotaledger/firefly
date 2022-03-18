import { DashboardRoutes } from '@core/router'
import { Router } from './router'
import { writable } from 'svelte/store'

export const dashboardRouter = writable<DashboardRouter>(null)
export const dashboardRoute = writable<DashboardRoutes>(null)

export class DashboardRouter extends Router<DashboardRoutes> {
    constructor() {
        super(DashboardRoutes.Wallet, dashboardRoute)
    }
}
