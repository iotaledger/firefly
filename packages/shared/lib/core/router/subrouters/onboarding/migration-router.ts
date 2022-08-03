import { get, writable } from 'svelte/store'

import { hasBundlesWithSpentAddresses, hasSingleBundle } from '@lib/migration'

import { onboardingRouter } from '../../onboarding-router'
import { MigrationRoute } from '../../enums'
import { FireflyEvent } from '../../types'
import { Subrouter } from '../subrouter'

export const migrationRoute = writable<MigrationRoute>(null)
export const migrationRouter = writable<MigrationRouter>(null)

export class MigrationRouter extends Subrouter<MigrationRoute> {
    constructor() {
        super(MigrationRoute.Init, migrationRoute, get(onboardingRouter))
    }

    next(event?: FireflyEvent): void {
        let nextRoute: MigrationRoute
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case MigrationRoute.Init:
                if (get(hasBundlesWithSpentAddresses)) {
                    nextRoute = MigrationRoute.BundleMiningWarning
                    break
                }
                if (get(hasSingleBundle)) {
                    this.parentRouter.next()
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
                this.parentRouter.next()
                break
        }

        this.setNext(nextRoute)
    }
}
