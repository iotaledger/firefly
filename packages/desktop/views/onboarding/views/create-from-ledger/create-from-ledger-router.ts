import { Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { createProfileRouter } from '../create-profile/create-profile-router'
import { CreateFromLedgerRoute } from './create-from-ledger-route.enum'

export const createFromLedgerRoute = writable<CreateFromLedgerRoute>(undefined)
export const createFromLedgerRouter = writable<CreateFromLedgerRouter>(undefined)

export class CreateFromLedgerRouter extends Subrouter<CreateFromLedgerRoute> {
    constructor() {
        super(CreateFromLedgerRoute.InstallLedger, createFromLedgerRoute, get(createProfileRouter))
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
