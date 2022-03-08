import { Router } from 'shared/lib/core/router/router'
import { Tabs } from 'shared/lib/typings/routes'
import { writable } from 'svelte/store'

export const dashboardRouter = writable<DashboardRouter>(null)
export const dashboardRoute = writable<Tabs>(null)

export class DashboardRouter extends Router<Tabs> {
    constructor() {
        super(Tabs.Wallet, dashboardRoute)
    }
}
