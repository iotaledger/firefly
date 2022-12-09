import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { AccountSwitcherRoute } from '../../enums'
import { dashboardRouter } from '../dashboard-router'

export const accountSwitcherRoute = writable<AccountSwitcherRoute>(null)
export const accountSwitcherRouter = writable<AccountSwitcherRouter>(null)

export class AccountSwitcherRouter extends Subrouter<AccountSwitcherRoute> {
    constructor() {
        super(AccountSwitcherRoute.Switcher, accountSwitcherRoute, get(dashboardRouter))
    }

    next(): void {
        let nextRoute: AccountSwitcherRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case AccountSwitcherRoute.Switcher: {
                nextRoute = AccountSwitcherRoute.CreateAccount
                break
            }
            case AccountSwitcherRoute.CreateAccount: {
                nextRoute = AccountSwitcherRoute.Password
                break
            }
        }

        this.setNext(nextRoute)
    }
}
