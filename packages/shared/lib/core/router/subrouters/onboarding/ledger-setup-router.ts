import { get, writable } from 'svelte/store'

import { onboardingProfile, ProfileRecoveryType } from '@contexts/onboarding'

import { LedgerSetupRoute } from '../../enums'
import { onboardingRouter } from '../../onboarding-router'
import { Subrouter } from '../subrouter'

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

    next(): void {
        let nextRoute: LedgerSetupRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case LedgerSetupRoute.Connect: {
                const recoveryType = get(onboardingProfile)?.recoveryType
                if (recoveryType === ProfileRecoveryType.FireflyLedger) {
                    nextRoute = LedgerSetupRoute.RestoreFromLedger
                } else {
                    this.parentRouter.next()
                }
                break
            }

            case LedgerSetupRoute.RestoreFromLedger: {
                this.parentRouter.next()
                break
            }
            case LedgerSetupRoute.InstallationGuide: {
                nextRoute = LedgerSetupRoute.Connect
                break
            }
        }

        this.setNext(nextRoute)
    }
}
