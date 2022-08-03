import { get, writable } from 'svelte/store'

import { onboardingProfile, ProfileRecoveryType } from '@contexts/onboarding'

import { onboardingRouter } from '../onboarding-router'
import { LedgerSetupRoute } from '../enums'
import { Subrouter } from './subrouter'

export const ledgerSetupRoute = writable<LedgerSetupRoute>(null)
export const ledgerSetupRouter = writable<LedgerSetupRouter>(null)

export class LedgerSetupRouter extends Subrouter<LedgerSetupRoute> {
    constructor() {
        super(LedgerSetupRoute.LegacyIntro, ledgerSetupRoute, get(onboardingRouter))
    }

    restartIfNotInLedgerFlow(): void {
        const recoveryType = get(onboardingProfile)?.recoveryType
        // reinitialize the init view only if we are not in the middle of a ledger flow
        if (this.history.length === 0) {
            if (recoveryType === ProfileRecoveryType.Seed || recoveryType === ProfileRecoveryType.FireflyLedger) {
                this.routeStore.set(LedgerSetupRoute.Connect)
            } else {
                this.routeStore.set(LedgerSetupRoute.LegacyIntro)
            }
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
                } else if (recoveryType === ProfileRecoveryType.TrinityLedger) {
                    nextRoute = LedgerSetupRoute.GenerateAddress
                } else {
                    this.parentRouter.next()
                }
                break
            }
            case LedgerSetupRoute.RestoreFromLedger:
                this.parentRouter.next()
                break
            case LedgerSetupRoute.LegacyIntro:
                nextRoute = LedgerSetupRoute.InstallationGuide
                break
            case LedgerSetupRoute.InstallationGuide:
                nextRoute = LedgerSetupRoute.Connect
                break
            case LedgerSetupRoute.GenerateAddress:
                nextRoute = LedgerSetupRoute.SwitchApps
                break
            case LedgerSetupRoute.SwitchApps:
                nextRoute = LedgerSetupRoute.AccountIndex
                break
            case LedgerSetupRoute.AccountIndex:
                this.parentRouter.next()
                break
        }

        this.setNext(nextRoute)
    }
}
