import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { AccountAction } from '../../../../lib/contexts/dashboard'
import { AccountActionsRoute } from '../../enums'
import { IAccountActionsRouterEvent } from '../../interfaces'
import { dashboardRouter } from '../dashboard-router'

export const accountActionsRoute = writable<AccountActionsRoute>(null)
export const accountActionsRouter = writable<AccountActionsRouter>(null)

export class AccountActionsRouter extends Subrouter<AccountActionsRoute> {
    constructor() {
        super(AccountActionsRoute.Actions, accountActionsRoute, get(dashboardRouter))
    }

    next(event: IAccountActionsRouterEvent = {}): void {
        const { action } = event
        let nextRoute: AccountActionsRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case AccountActionsRoute.Actions: {
                switch (action) {
                    case AccountAction.Customize: {
                        nextRoute = AccountActionsRoute.Customize
                        break
                    }
                    case AccountAction.Delete: {
                        nextRoute = AccountActionsRoute.DeleteConfirmation
                        break
                    }
                }
            }
        }
        this.setNext(nextRoute)
    }
}
