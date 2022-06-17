import { get, writable } from 'svelte/store'

import { appRouter } from '../app-router'
import { ProtectRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const protectRoute = writable<ProtectRoute>(null)

export class ProtectRouter extends Subrouter<ProtectRoute> {
    constructor() {
        super(ProtectRoute.Pin, protectRoute)
    }

    next(event: FireflyEvent): void {
        let nextRoute: ProtectRoute
        const { protectionType } = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProtectRoute.Init:
                if (protectionType === 'pin') {
                    nextRoute = ProtectRoute.Pin
                } else if (protectionType === 'biometric') {
                    nextRoute = ProtectRoute.Biometric
                }
                break

            case ProtectRoute.Pin:
                nextRoute = ProtectRoute.RepeatPin
                break

            case ProtectRoute.RepeatPin:
                get(appRouter).next(event)
                break
        }
        this.setNext(nextRoute)
    }
}
