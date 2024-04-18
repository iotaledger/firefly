import { RestoreProfileType, onboardingProfile } from '@contexts/onboarding'
import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { CreateFromLedgerRouter, createFromLedgerRouter } from '../create-from-ledger'
import { RestoreFromMnemonicRouter, restoreFromMnemonicRouter } from '../restore-from-mnemonic'
import { RestoreProfileRoute } from './restore-profile-route.enum'
import { RestoreFromStrongholdRouter, restoreFromStrongholdRouter } from '../restore-from-stronghold'

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
                        restoreFromMnemonicRouter.set(new RestoreFromMnemonicRouter(get(restoreProfileRouter)))
                        nextRoute = RestoreProfileRoute.RestoreFromMnemonic
                        break
                    case RestoreProfileType.Stronghold:
                        restoreFromStrongholdRouter.set(new RestoreFromStrongholdRouter(get(restoreProfileRouter)))
                        nextRoute = RestoreProfileRoute.RestoreFromStronghold
                        break
                    case RestoreProfileType.Ledger:
                        createFromLedgerRouter.set(new CreateFromLedgerRouter(get(restoreProfileRouter)))
                        nextRoute = RestoreProfileRoute.RestoreFromLedger
                        break
                }
                break
            case RestoreProfileRoute.RestoreFromMnemonic:
            case RestoreProfileRoute.RestoreFromStronghold:
            case RestoreProfileRoute.RestoreFromLedger:
                // TODO: We need to adapt the Shimmer Claiming logic
                // if (_onboardingProfile.onboardingType === OnboardingType.Claim) {
                //     nextRoute = RestoreProfileRoute.ClaimFinder
                // } else {

                //     return
                // }

                this.parentRouter.next()
                break
            case RestoreProfileRoute.BalanceFinder:
                // case RestoreProfileRoute.ClaimFinder:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
