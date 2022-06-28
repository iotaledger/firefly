import { get, writable } from 'svelte/store'

import { NetworkRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'
import { newProfile } from '@core/profile'
import { onboardingRouter } from '@core/router'
import { NetworkType } from '@core/network'

export const networkRoute = writable<NetworkRoute>(null)
export const networkRouter = writable<NetworkRouter>(null)

export class NetworkRouter extends Subrouter<NetworkRoute> {
    constructor() {
        super(NetworkRoute.Protocol, networkRoute, onboardingRouter)
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
                    get(onboardingRouter).next()
                }
                break
            }
            case NetworkRoute.Network: {
                const networkType = params?.networkType ?? NetworkType.Devnet
                if (networkType === NetworkType.PrivateNet) {
                    nextRoute = NetworkRoute.CustomNetwork
                } else {
                    get(onboardingRouter).next()
                }
                break
            }
            case NetworkRoute.CustomNetwork:
                get(onboardingRouter).next()
                break
        }

        this.setNext(nextRoute)
    }
}
