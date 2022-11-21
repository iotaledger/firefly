import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { dashboardRouter } from '../dashboard-router'
import { SendRoute } from '../enums'

export const sendRoute = writable<SendRoute>(null)
export const sendRouter = writable<SendRouter>(null)

export class SendRouter extends Subrouter<SendRoute> {
    constructor() {
        super(SendRoute.Token, sendRoute, get(dashboardRouter))
    }

    next(): void {
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
                nextRoute = SendRoute.Password
                break
            }
            case SendRoute.Password: {
                super.previous()
                break
            }
        }

        this.setNext(nextRoute)
    }
}
