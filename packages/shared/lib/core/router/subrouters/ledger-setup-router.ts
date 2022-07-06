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
        const setupType = get(profileRecoveryType)
        // reinitialize the init view only if we are not in the middle of a ledger flow
        if (this.history.length === 0) {
            if (setupType === ProfileRecoveryType.Seed || setupType === ProfileRecoveryType.FireflyLedger) {
                this.routeStore.set(LedgerSetupRoute.Connect)
            } else {
                this.routeStore.set(LedgerSetupRoute.LegacyIntro)
            }
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
                } else if (setupType === ProfileRecoveryType.TrinityLedger) {
                    nextRoute = LedgerSetupRoute.GenerateAddress
                } else {
                    this.parentRouter.next(event)
                }
                break
            case LedgerSetupRoute.RestoreFromLedger:
                this.parentRouter.next(event)
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
                this.parentRouter.next(event)
                break
        }

        this.setNext(nextRoute)
    }
}
