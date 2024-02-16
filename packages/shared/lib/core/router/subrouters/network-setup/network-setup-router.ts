import { onboardingProfile } from '@contexts/onboarding/stores'
import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { NetworkSetupRoute } from './network-setup-route.enum'

export const networkSetupRoute = writable<NetworkSetupRoute>(null)
export const networkSetupRouter = writable<NetworkSetupRouter>(null)

export class NetworkSetupRouter extends Subrouter<NetworkSetupRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(NetworkSetupRoute.ChooseNetwork, networkSetupRoute, parentRouter)
    }

    next(): void {
        let nextRoute: NetworkSetupRoute

        const _onboardingProfile = get(onboardingProfile)
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case NetworkSetupRoute.ChooseNetwork: {
                const network = _onboardingProfile?.network
                if (network) {
                    this.parentRouter.next()
                    return
                } else {
                    nextRoute = NetworkSetupRoute.CustomNetwork
                    break
                }
            }
            case NetworkSetupRoute.CustomNetwork:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
