import { onboardingProfile } from '@contexts/onboarding'
import { NetworkId } from '@core/network'
import { get, writable } from 'svelte/store'
import { Subrouter } from '../../classes'
import { NetworkSetupRoute } from '../../enums'
import { onboardingRouter } from '../../routers'

export const networkSetupRoute = writable<NetworkSetupRoute>(null)
export const networkSetupRouter = writable<NetworkSetupRouter>(null)

export class NetworkSetupRouter extends Subrouter<NetworkSetupRoute> {
    constructor() {
        super(NetworkSetupRoute.ChooseNetwork, networkSetupRoute, get(onboardingRouter))
    }

    next(): void {
        let nextRoute: NetworkSetupRoute

        const _onboardingProfile = get(onboardingProfile)
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case NetworkSetupRoute.ChooseNetwork: {
                const networkId = _onboardingProfile?.network ?? NetworkId.Custom
                if (networkId === NetworkId.Custom) {
                    nextRoute = NetworkSetupRoute.SetupCustomNetworkConnection
                    break
                } else {
                    this.parentRouter.next()
                    return
                }
            }
            case NetworkSetupRoute.SetupCustomNetworkConnection:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
