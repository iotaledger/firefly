import { get, writable } from 'svelte/store'

import { Subrouter } from '../../classes'
import { LedgerSetupRoute } from '../../enums'
import { onboardingRouter } from '../../routers'

export const ledgerSetupRoute = writable<LedgerSetupRoute>(null)
export const ledgerSetupRouter = writable<LedgerSetupRouter>(null)

export class LedgerSetupRouter extends Subrouter<LedgerSetupRoute> {
    constructor() {
        super(LedgerSetupRoute.LedgerInstallationGuide, ledgerSetupRoute, get(onboardingRouter))
    }

    restartIfNotInLedgerFlow(): void {
        // reinitialize the init view only if we are not in the middle of a ledger flow
        if (this.history.length === 0) {
            this.routeStore.set(LedgerSetupRoute.LedgerInstallationGuide)
        }
    }

    next(): void {
        let nextRoute: LedgerSetupRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case LedgerSetupRoute.LedgerInstallationGuide: {
                nextRoute = LedgerSetupRoute.ConnectLedger
                break
            }
            case LedgerSetupRoute.ConnectLedger: {
                this.parentRouter.next()
                return
            }
        }

        this.setNext(nextRoute)
    }
}
