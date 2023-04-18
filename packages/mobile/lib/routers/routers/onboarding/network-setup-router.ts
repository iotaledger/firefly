import { get, writable } from 'svelte/store'

import { IOnboardingProfile, onboardingProfile } from '@contexts/onboarding'
import { NetworkId } from '@core/network'
import { Subrouter } from '@core/router'

import { NetworkSetupRoute } from '../../enums'
import { onboardingRouter } from '../onboarding-router'

export const networkSetupRoute = writable<NetworkSetupRoute>(null)
export const networkSetupRouter = writable<NetworkSetupRouter>(null)

export class NetworkSetupRouter extends Subrouter<NetworkSetupRoute> {
    constructor() {
        super(NetworkSetupRoute.ChooseNetwork, networkSetupRoute, get(onboardingRouter))
    }

    next(): void {
        let nextRoute: NetworkSetupRoute

        const _onboardingProfile: IOnboardingProfile = get(onboardingProfile)
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case NetworkSetupRoute.ChooseNetwork: {
                const networkId = _onboardingProfile?.network?.id ?? NetworkId.Shimmer
                if (networkId === NetworkId.Custom) {
                    nextRoute = NetworkSetupRoute.SetupPrivateNetworkConnection
                    break
                } else {
                    this.parentRouter.next()
                    return
                }
            }
            case NetworkSetupRoute.SetupPrivateNetworkConnection:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
