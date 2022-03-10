import { get, writable } from 'svelte/store'
import { appRouter, LedgerRoutes } from '@core/router'
import { SetupType } from 'shared/lib/typings/setup'
import { walletSetupType } from 'shared/lib/wallet'
import { FireflyEvent } from '@core/router/typings/event'
import { Subrouter } from '@core/router/subrouters/subrouter'

export const ledgerRoute = writable<LedgerRoutes>(null)
export const ledgerRouter = writable<LedgerRouter>(null)

export class LedgerRouter extends Subrouter<LedgerRoutes> {
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

    next(event: FireflyEvent): void {
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
}
