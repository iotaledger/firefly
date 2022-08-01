import { get, writable } from 'svelte/store'

import { onboardingProfile } from '@contexts/onboarding'
import { NetworkType } from '@core/network'

import { onboardingRouter } from '../onboarding-router'
import { NetworkSetupRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const networkSetupRoute = writable<NetworkSetupRoute>(null)
export const networkSetupRouter = writable<NetworkSetupRouter>(null)

export class NetworkSetupRouter extends Subrouter<NetworkSetupRoute> {
    constructor() {
        super(NetworkSetupRoute.Protocol, networkSetupRoute, get(onboardingRouter))
    }

    next(event?: FireflyEvent): void {
        let nextRoute: NetworkSetupRoute
        const params = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case NetworkSetupRoute.Protocol: {
                const isDeveloperProfile = get(onboardingProfile)?.isDeveloperProfile
                if (isDeveloperProfile) {
                    nextRoute = NetworkSetupRoute.Network
                } else {
                    this.parentRouter.next()
                }
                break
            }
            case NetworkSetupRoute.Network: {
                const networkType = params?.networkType ?? NetworkType.Devnet
                if (networkType === NetworkType.PrivateNet) {
                    nextRoute = NetworkSetupRoute.CustomNetwork
                } else {
                    this.parentRouter.next()
                }
                break
            }
            case NetworkSetupRoute.CustomNetwork:
                this.parentRouter.next()
                break
        }

        this.setNext(nextRoute)
    }
}
