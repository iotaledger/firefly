import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { SendFlowRoute } from './send-flow-route.enum'

export const sendFlowRoute = writable<SendFlowRoute>(undefined)
export const sendFlowRouter = writable<SendFlowRouter>(undefined)

export class SendFlowRouter extends Subrouter<SendFlowRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(SendFlowRoute.InputTokenAmount, sendFlowRoute, parentRouter)
    }

    next(): void {
        let nextRoute: SendFlowRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case SendFlowRoute.SelectToken:
                nextRoute = SendFlowRoute.InputTokenAmount
                break
            case SendFlowRoute.InputTokenAmount:
                nextRoute = SendFlowRoute.InputDestination
                break
            case SendFlowRoute.InputDestination:
                nextRoute = SendFlowRoute.TransactionSummary
                break
            case SendFlowRoute.TransactionSummary:
                return
        }

        this.setNext(nextRoute)
    }
}
