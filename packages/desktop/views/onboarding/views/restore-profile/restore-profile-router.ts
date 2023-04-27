import { OnboardingType, RestoreProfileType, onboardingProfile } from '@contexts/onboarding'
import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import {
    /* `RestoreProfileRoute` is an enum that defines the different routes available in the restore
    profile flow. It is used to keep track of the current route and to determine the next route
    to navigate to. */
    RestoreProfileRoute,
} from './restore-profile-route.enum'

export const restoreProfileRoute = writable<RestoreProfileRoute>(undefined)
export const restoreProfileRouter = writable<RestoreProfileRouter>(undefined)

export class RestoreProfileRouter extends Subrouter<RestoreProfileRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(RestoreProfileRoute.ChooseRestoreProfileFlow, restoreProfileRoute, parentRouter)
    }

    next(): void {
        let nextRoute: RestoreProfileRoute

        const _onboardingProfile = get(onboardingProfile)
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case RestoreProfileRoute.ChooseRestoreProfileFlow:
                switch (_onboardingProfile.restoreProfileType) {
                    case RestoreProfileType.Mnemonic:
                        nextRoute = RestoreProfileRoute.RestoreFromMnemonic
                        break
                    case RestoreProfileType.Stronghold:
                        nextRoute = RestoreProfileRoute.RestoreFromStronghold
                        break
                    case RestoreProfileType.Ledger:
                        nextRoute = RestoreProfileRoute.RestoreFromLedger
                        break
                }
                break
            case RestoreProfileRoute.RestoreFromMnemonic:
            case RestoreProfileRoute.RestoreFromStronghold:
            case RestoreProfileRoute.RestoreFromLedger:
                if (_onboardingProfile.onboardingType === OnboardingType.Claim) {
                    nextRoute = RestoreProfileRoute.ClaimFinder
                } else {
                    this.parentRouter.next()
                    return
                }
                break
            case RestoreProfileRoute.BalanceFinder:
            case RestoreProfileRoute.ClaimFinder:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
