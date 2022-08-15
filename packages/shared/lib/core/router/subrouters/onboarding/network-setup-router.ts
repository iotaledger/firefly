import { get, writable } from 'svelte/store'

import { onboardingProfile } from '@contexts/onboarding'
import { NetworkType } from '@core/network'

import { NetworkSetupRoute } from '../../enums'
import { onboardingRouter } from '../../onboarding-router'
import { Subrouter } from '../subrouter'

export const networkSetupRoute = writable<NetworkSetupRoute>(null)
export const networkSetupRouter = writable<NetworkSetupRouter>(null)

export class NetworkSetupRouter extends Subrouter<NetworkSetupRoute> {
    constructor() {
        super(NetworkSetupRoute.ChooseProtocol, networkSetupRoute, get(onboardingRouter))
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
                } else {
                    this.parentRouter.next()
                }
                break
            }
            case NetworkSetupRoute.ChooseNetwork: {
                const networkType = _onboardingProfile?.networkType ?? NetworkType.Devnet
                if (networkType === NetworkType.PrivateNet) {
                    nextRoute = NetworkSetupRoute.SetupPrivateNetworkConnection
                } else {
                    this.parentRouter.next()
                }
                break
            }
            case NetworkSetupRoute.SetupPrivateNetworkConnection:
                this.parentRouter.next()
                break
        }

        this.setNext(nextRoute)
    }
}
