import { get, writable } from 'svelte/store'
import { appRouter, LedgerRoutes } from '@core/router'
import { Router } from './router'
import { SetupType } from 'shared/lib/typings/setup'
import { walletSetupType } from 'shared/lib/wallet'

export const ledgerRoute = writable<LedgerRoutes>(null)
export const ledgerRouter = writable<LedgerRouter>(null)

export class LedgerRouter extends Router<LedgerRoutes> {
    constructor() {
        super(LedgerRoutes.LegacyIntro, ledgerRoute)
    }

    restartIfNotInLedgerFlow(): void {
        const setupType = get(walletSetupType)

        // reinitialize the init view only if we are not in the middle of a ledger flow
        if (this.history.length !== 0) {
            if (setupType === SetupType.New || setupType === SetupType.FireflyLedger) {
                this.setNext(LedgerRoutes.Connect)
            } else {
                this.setNext(LedgerRoutes.LegacyIntro)
            }
        }
    }

    next(event: CustomEvent): void {
        let nextRoute: LedgerRoutes
        const currentRoute = get(this.routeStore)
        const setupType = get(walletSetupType)

        switch (currentRoute) {
            case LedgerRoutes.Connect:
                if (setupType === SetupType.New) {
                    get(appRouter).next(event)
                } else if (setupType === SetupType.FireflyLedger) {
                    nextRoute = LedgerRoutes.RestoreFromLedger
                } else if (setupType === SetupType.TrinityLedger) {
                    nextRoute = LedgerRoutes.GenerateAddress
                }
                break
            case LedgerRoutes.RestoreFromLedger:
                get(appRouter).next(event)
                break
            case LedgerRoutes.LegacyIntro:
                nextRoute = LedgerRoutes.InstallationGuide
                break
            case LedgerRoutes.InstallationGuide:
                nextRoute = LedgerRoutes.Connect
                break
            case LedgerRoutes.GenerateAddress:
                nextRoute = LedgerRoutes.SwitchApps
                break
            case LedgerRoutes.SwitchApps:
                nextRoute = LedgerRoutes.AccountIndex
                break
            case LedgerRoutes.AccountIndex:
                get(appRouter).next(event)
                break
        }

        if (nextRoute) {
            this.setNext(nextRoute)
        }
    }

    previousIfPossible(): void {
        if (this.history.length === 0) {
            get(appRouter).previous()
        } else {
            this.previous()
        }
    }
}
