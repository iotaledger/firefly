import { get, writable } from 'svelte/store'

import { ProfileRecoveryType, profileRecoveryType } from '@contexts/onboarding'

import { appRouter } from '../app-router'
import { onboardingRouter } from '../onboarding-router'
import { LedgerRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const ledgerRoute = writable<LedgerRoute>(null)
export const ledgerRouter = writable<LedgerRouter>(null)

export class LedgerRouter extends Subrouter<LedgerRoute> {
    constructor() {
        super(LedgerRoute.LegacyIntro, ledgerRoute, onboardingRouter)
    }

    restartIfNotInLedgerFlow(): void {
        const setupType = get(profileRecoveryType)
        // reinitialize the init view only if we are not in the middle of a ledger flow
        if (this.history.length === 0) {
            if (setupType === ProfileRecoveryType.Seed || setupType === ProfileRecoveryType.FireflyLedger) {
                this.routeStore.set(LedgerRoute.Connect)
            } else {
                this.routeStore.set(LedgerRoute.LegacyIntro)
            }
        }
    }

    next(event: FireflyEvent): void {
        let nextRoute: LedgerRoute
        const currentRoute = get(this.routeStore)
        const setupType = get(profileRecoveryType)

        switch (currentRoute) {
            case LedgerRoute.Connect:
                if (setupType === ProfileRecoveryType.FireflyLedger) {
                    nextRoute = LedgerRoute.RestoreFromLedger
                } else if (setupType === ProfileRecoveryType.TrinityLedger) {
                    nextRoute = LedgerRoute.GenerateAddress
                } else {
                    get(appRouter).next(event)
                }
                break
            case LedgerRoute.RestoreFromLedger:
                get(appRouter).next(event)
                break
            case LedgerRoute.LegacyIntro:
                nextRoute = LedgerRoute.InstallationGuide
                break
            case LedgerRoute.InstallationGuide:
                nextRoute = LedgerRoute.Connect
                break
            case LedgerRoute.GenerateAddress:
                nextRoute = LedgerRoute.SwitchApps
                break
            case LedgerRoute.SwitchApps:
                nextRoute = LedgerRoute.AccountIndex
                break
            case LedgerRoute.AccountIndex:
                get(appRouter).next(event)
                break
        }

        this.setNext(nextRoute)
    }
}
