import { appRouter, MigrateRoutes } from '@core/router'
import { Subrouter } from '@core/router/subrouters/subrouter'
import { FireflyEvent } from '@core/router/typings/event'
import { hasBundlesWithSpentAddresses, hasSingleBundle } from 'shared/lib/migration'
import { get, writable } from 'svelte/store'

export const migrateRoute = writable<MigrateRoutes>(null)

export class MigrateRouter extends Subrouter<MigrateRoutes> {
    constructor() {
        super(MigrateRoutes.Init, migrateRoute)
    }

    next(event: FireflyEvent): void {
        let nextRoute: MigrateRoutes
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case MigrateRoutes.Init:
                if (get(hasBundlesWithSpentAddresses)) {
                    nextRoute = MigrateRoutes.BundleMiningWarning
                    break
                }

                if (get(hasSingleBundle)) {
                    get(appRouter).next()
                } else {
                    nextRoute = MigrateRoutes.TransferFragmentedFunds
                }

                break

            case MigrateRoutes.TransferFragmentedFunds:
                get(appRouter).next()
                break
            case MigrateRoutes.BundleMiningWarning:
                nextRoute = MigrateRoutes.SecureSpentAddresses
                break
            case MigrateRoutes.SecureSpentAddresses: {
                nextRoute = event?.skippedMining
                    ? MigrateRoutes.TransferFragmentedFunds
                    : MigrateRoutes.SecuringSpentAddresses
                break
            }
            case MigrateRoutes.SecuringSpentAddresses:
                nextRoute = MigrateRoutes.SecurityCheckCompleted
                break
            case MigrateRoutes.SecurityCheckCompleted:
                nextRoute = MigrateRoutes.TransferFragmentedFunds
                break
        }
        this.setNext(nextRoute)
    }
}
