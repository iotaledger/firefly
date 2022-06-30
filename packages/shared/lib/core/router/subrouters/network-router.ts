import { get, writable } from 'svelte/store'

import { newProfile } from '@contexts/onboarding'
import { NetworkType } from '@core/network'

import { onboardingRouter } from '../onboarding-router'
import { NetworkRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const networkRoute = writable<NetworkRoute>(null)
export const networkRouter = writable<NetworkRouter>(null)

export class NetworkRouter extends Subrouter<NetworkRoute> {
    constructor() {
        super(NetworkRoute.Protocol, networkRoute, get(onboardingRouter))
    }

    next(event?: FireflyEvent): void {
        let nextRoute: NetworkRoute
        const params = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case NetworkRoute.Protocol: {
                const isDeveloperProfile = get(newProfile)?.isDeveloperProfile
                if (isDeveloperProfile) {
                    nextRoute = NetworkRoute.Network
                } else {
                    this.parentRouter.next()
                }
                break
            }
            case NetworkRoute.Network: {
                const networkType = params?.networkType ?? NetworkType.Devnet
                if (networkType === NetworkType.PrivateNet) {
                    nextRoute = NetworkRoute.CustomNetwork
                } else {
                    this.parentRouter.next()
                }
                break
            }
            case NetworkRoute.CustomNetwork:
                this.parentRouter.next()
                break
        }

        this.setNext(nextRoute)
    }
}
