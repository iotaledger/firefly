import { writable } from 'svelte/store'

import { Router } from '@core/router'

import { DashboardRoute } from './enums'

export const dashboardRouter = writable<DashboardRouter>(null)
export const dashboardRoute = writable<DashboardRoute>(null)

export class DashboardRouter extends Router<DashboardRoute> {
    constructor() {
        super(DashboardRoute.Init, dashboardRoute)
    }
}
