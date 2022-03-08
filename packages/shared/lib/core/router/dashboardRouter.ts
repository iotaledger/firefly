import { dashboardRoute } from 'shared/lib/router'
import { Router } from 'shared/lib/core/router/router'
import { Tabs } from 'shared/lib/typings/routes'

export class DashboardRouter extends Router<Tabs> {
    constructor() {
        super(Tabs.Wallet, dashboardRoute)
    }
}
