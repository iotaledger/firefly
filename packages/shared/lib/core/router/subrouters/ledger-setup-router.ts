import { get, writable } from 'svelte/store'

import { ProfileRecoveryType, profileRecoveryType } from '@contexts/onboarding'

import { onboardingRouter } from '../onboarding-router'
import { LedgerSetupRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const ledgerSetupRoute = writable<LedgerSetupRoute>(null)
export const ledgerSetupRouter = writable<LedgerSetupRouter>(null)

export class LedgerSetupRouter extends Subrouter<LedgerSetupRoute> {
    constructor() {
        super(LedgerSetupRoute.LegacyIntro, ledgerSetupRoute, get(onboardingRouter))
    }

    restartIfNotInLedgerFlow(): void {
        // reinitialize the init view only if we are not in the middle of a ledger flow
        if (this.history.length === 0) {
            this.routeStore.set(LedgerSetupRoute.InstallationGuide)
        }
    }

    next(event?: FireflyEvent): void {
        let nextRoute: LedgerSetupRoute
        const currentRoute = get(this.routeStore)
        const setupType = get(profileRecoveryType)

        switch (currentRoute) {
            case LedgerSetupRoute.Connect:
                if (setupType === ProfileRecoveryType.FireflyLedger) {
                    nextRoute = LedgerSetupRoute.RestoreFromLedger
                } else {
                    this.parentRouter.next(event)
                }
                break
            case LedgerSetupRoute.RestoreFromLedger:
                this.parentRouter.next(event)
                break
            case LedgerSetupRoute.InstallationGuide:
                nextRoute = LedgerSetupRoute.Connect
                break
        }

        this.setNext(nextRoute)
    }
}
