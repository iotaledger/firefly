import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'
import { resetNewTokenTransactionDetails } from '@core/wallet'

import { dashboardRouter } from '../dashboard-router'
import { SendRoute } from '../enums'
import { ISendRouterEvent } from '../interfaces'
import { resetRouterWithDrawerDelay } from '../utils'

export const sendRoute = writable<SendRoute>(null)
export const sendRouter = writable<SendRouter>(null)

export class SendRouter extends Subrouter<SendRoute> {
    constructor() {
        super(SendRoute.Token, sendRoute, get(dashboardRouter))
    }

    next(event: ISendRouterEvent = {}): void {
        const { needsUnlock } = event

        let nextRoute: SendRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case SendRoute.Token: {
                nextRoute = SendRoute.Recipient
                break
            }
            case SendRoute.Recipient: {
                nextRoute = SendRoute.Amount
                break
            }
            case SendRoute.Amount: {
                if (needsUnlock) {
                    nextRoute = SendRoute.Password
                } else {
                    this.closeDrawer()
                }
                break
            }
            case SendRoute.Password: {
                super.previous()
                break
            }
        }

        this.setNext(nextRoute)
    }

    closeDrawer(): void {
        resetRouterWithDrawerDelay(get(sendRouter))
        get(dashboardRouter).previous()
        resetNewTokenTransactionDetails()
    }
}
