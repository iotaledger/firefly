import { get, writable } from 'svelte/store'

import { onboardingProfile } from '@contexts/onboarding'
import { NetworkType } from '@core/network'

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
            case NetworkSetupRoute.ChooseProtocol: {
                const isDeveloperProfile = _onboardingProfile?.isDeveloperProfile
                if (isDeveloperProfile) {
                    nextRoute = NetworkSetupRoute.ChooseNetwork
                    break
                } else {
                    this.parentRouter.next()
                    return
                }
            }
            case NetworkSetupRoute.ChooseNetwork: {
                const networkType = _onboardingProfile?.networkType ?? NetworkType.Devnet
                if (networkType === NetworkType.PrivateNet) {
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
