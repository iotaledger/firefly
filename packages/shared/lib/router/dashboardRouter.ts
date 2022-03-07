import { dashboardRoute } from 'shared/lib/router'
import { Router } from 'shared/lib/router/router'
import { Tabs } from 'shared/lib/typings/routes'
import { get } from 'svelte/store'

export class DashboardRouter extends Router<Tabs> {
    constructor() {
        super(Tabs.Wallet, dashboardRoute)
    }

    next(event: { detail }): void {
        return
    }

    goTo(tab: Tabs): void {
        if (get(this.route) === tab) {
            return
        }
        this.setNext(tab)
    }
}
