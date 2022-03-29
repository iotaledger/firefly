import { get, writable } from 'svelte/store'

import { hasBundlesWithSpentAddresses, hasSingleBundle } from '@lib/migration'

import { appRouter } from '../app-router'
import { MigrateRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const migrateRoute = writable<MigrateRoute>(null)

export class MigrateRouter extends Subrouter<MigrateRoute> {
    constructor() {
        super(MigrateRoute.Init, migrateRoute)
    }

    next(event: FireflyEvent): void {
        let nextRoute: MigrateRoute
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case MigrateRoute.Init:
                if (get(hasBundlesWithSpentAddresses)) {
                    nextRoute = MigrateRoute.BundleMiningWarning
                    break
                }
                if (get(hasSingleBundle)) {
                    get(appRouter).next()
                } else {
                    nextRoute = MigrateRoute.TransferFragmentedFunds
                }
                break
            case MigrateRoute.BundleMiningWarning:
                nextRoute = MigrateRoute.SecureSpentAddresses
                break
            case MigrateRoute.SecureSpentAddresses: {
                nextRoute = event?.skippedMining
                    ? MigrateRoute.TransferFragmentedFunds
                    : MigrateRoute.SecuringSpentAddresses
                break
            }
            case MigrateRoute.SecuringSpentAddresses:
                nextRoute = MigrateRoute.SecurityCheckCompleted
                break
            case MigrateRoute.SecurityCheckCompleted:
                nextRoute = MigrateRoute.TransferFragmentedFunds
                break
            case MigrateRoute.TransferFragmentedFunds:
                get(appRouter).next()
                break
        }
        this.setNext(nextRoute)
    }
}
