import { get, writable } from 'svelte/store'

import { hasBundlesWithSpentAddresses, hasSingleBundle } from '@lib/migration'

import { appRouter } from '../app-router'
import { MigrationRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const migrationRoute = writable<MigrationRoute>(null)
export const migrationRouter = writable<MigrationRouter>(null)

export class MigrationRouter extends Subrouter<MigrationRoute> {
    constructor() {
        super(MigrationRoute.Init, migrationRoute)
    }

    next(event: FireflyEvent): void {
        let nextRoute: MigrationRoute
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case MigrationRoute.Init:
                if (get(hasBundlesWithSpentAddresses)) {
                    nextRoute = MigrationRoute.BundleMiningWarning
                    break
                }
                if (get(hasSingleBundle)) {
                    get(appRouter).next()
                } else {
                    nextRoute = MigrationRoute.TransferFragmentedFunds
                }
                break
            case MigrationRoute.BundleMiningWarning:
                nextRoute = MigrationRoute.SecureSpentAddresses
                break
            case MigrationRoute.SecureSpentAddresses: {
                nextRoute = event?.skippedMining
                    ? MigrationRoute.TransferFragmentedFunds
                    : MigrationRoute.SecuringSpentAddresses
                break
            }
            case MigrationRoute.SecuringSpentAddresses:
                nextRoute = MigrationRoute.SecurityCheckCompleted
                break
            case MigrationRoute.SecurityCheckCompleted:
                nextRoute = MigrationRoute.TransferFragmentedFunds
                break
            case MigrationRoute.TransferFragmentedFunds:
                get(appRouter).next()
                break
        }

        this.setNext(nextRoute)
    }
}
