import { get, writable } from 'svelte/store'

import { Router } from '@core/router'
import { resetNewTokenTransactionDetails } from '@core/wallet'

import { closeDrawer, DrawerId } from '@/auxiliary/drawer'
import { SendRoute } from '../../enums'
import { resetRouterWithDrawerDelay } from '../../utils'

export const sendRoute = writable<SendRoute>(null)
export const sendRouter = writable<SendRouter>(null)

export class SendRouter extends Router<SendRoute> {
    constructor() {
        super(SendRoute.Token, sendRoute)
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
                nextRoute = SendRoute.Review
                break
            }
            case SendRoute.Review: {
                this.closeDrawer()
                return
            }
        }

        this.setNext(nextRoute)
    }

    previous(): void {
        if (this.history.length > 0) {
            super.previous()
        } else {
            this.closeDrawer()
        }
    }

    reset(): void {
        super.reset()
        resetNewTokenTransactionDetails()
    }

    closeDrawer(): void {
        closeDrawer(DrawerId.Send)
        resetRouterWithDrawerDelay(get(sendRouter))
    }
}
