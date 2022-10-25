import { get, writable } from 'svelte/store'
import { Subrouter } from './subrouter'
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
        }

        this.setNext(nextRoute)
    }
}
