import { get, writable } from 'svelte/store'

import { appRouter } from '../app-router'
import { ProtectRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const protectRoute = writable<ProtectRoute>(null)

export class ProtectRouter extends Subrouter<ProtectRoute> {
    constructor() {
        super(ProtectRoute.SetupPinProtection, protectRoute)
    }

    next(event: FireflyEvent): void {
        let nextRoute: ProtectRoute
        const { protectionType } = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProtectRoute.ChooseProtectionMethod:
                if (protectionType === 'pin') {
                    nextRoute = ProtectRoute.SetupPinProtection
                } else if (protectionType === 'biometric') {
                    nextRoute = ProtectRoute.SetupBiometricProtection
                }
                break

            case ProtectRoute.SetupPinProtection:
                get(appRouter).next(event)
                break
        }
        this.setNext(nextRoute)
    }
}
