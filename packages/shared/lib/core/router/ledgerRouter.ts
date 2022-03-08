import { LedgerRoutes, SetupType } from 'shared/lib/typings/routes'
import { Router } from 'shared/lib/core/router/router'
import { get } from 'svelte/store'
import { appRouter, ledgerRoute, walletSetupType } from 'shared/lib/router'

export class LedgerRouter extends Router<LedgerRoutes> {
    constructor() {
        super(LedgerRoutes.LegacyIntro, ledgerRoute)
    }

    restartIfNotInLedgerFlow(): void {
        const setupType = get(walletSetupType)

        // reinitialize the init view only if we are not in the middle of a ledger flow
        if (!get(this.history).length) {
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
        if (get(this.history).length === 0) {
            get(appRouter).previous()
        } else {
            this.previous()
        }
    }
}
