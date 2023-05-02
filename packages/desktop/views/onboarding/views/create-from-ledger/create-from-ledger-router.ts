import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { CreateFromLedgerRoute } from './create-from-ledger-route.enum'

export const createFromLedgerRoute = writable<CreateFromLedgerRoute>(undefined)
export const createFromLedgerRouter = writable<CreateFromLedgerRouter>(undefined)

export class CreateFromLedgerRouter extends Subrouter<CreateFromLedgerRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(CreateFromLedgerRoute.InstallLedger, createFromLedgerRoute, parentRouter)
    }

    next(): void {
        let nextRoute: CreateFromLedgerRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case CreateFromLedgerRoute.InstallLedger:
                nextRoute = CreateFromLedgerRoute.ConnectLedger
                break
            case CreateFromLedgerRoute.ConnectLedger:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
