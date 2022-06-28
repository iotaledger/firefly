import { get, writable } from 'svelte/store'

import { onboardingRouter } from '../onboarding-router'
import { ProtectionRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const protectionRoute = writable<ProtectionRoute>(null)
export const protectionRouter = writable<ProtectionRouter>(null)

export class ProtectionRouter extends Subrouter<ProtectionRoute> {
    constructor() {
        super(ProtectionRoute.SetupPinProtection, protectionRoute, onboardingRouter)
    }

    next(event: FireflyEvent): void {
        let nextRoute: ProtectionRoute
        const { protectionType } = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProtectionRoute.ChooseProtectionMethod:
                if (protectionType === 'pin') {
                    nextRoute = ProtectionRoute.SetupPinProtection
                } else if (protectionType === 'biometric') {
                    nextRoute = ProtectionRoute.SetupBiometricProtection
                }
                break

            case ProtectionRoute.SetupPinProtection:
                get(onboardingRouter).next(event)
                break
        }

        this.setNext(nextRoute)
    }
}
