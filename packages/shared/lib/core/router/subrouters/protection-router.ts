import { get, writable } from 'svelte/store'

import { onboardingProfile, ProfileProtectionType } from '@contexts/onboarding'

import { onboardingRouter } from '../onboarding-router'
import { ProtectionRoute } from '../enums'
import { Subrouter } from './subrouter'

export const protectionRoute = writable<ProtectionRoute>(null)
export const protectionRouter = writable<ProtectionRouter>(null)

export class ProtectionRouter extends Subrouter<ProtectionRoute> {
    constructor() {
        super(ProtectionRoute.SetupPinProtection, protectionRoute, get(onboardingRouter))
    }

    next(): void {
        let nextRoute: ProtectionRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProtectionRoute.ChooseProtectionMethod: {
                const protectionType = get(onboardingProfile)?.protectionType
                if (protectionType === ProfileProtectionType.Pin) {
                    nextRoute = ProtectionRoute.SetupPinProtection
                } else if (protectionType === ProfileProtectionType.Biometric) {
                    nextRoute = ProtectionRoute.SetupBiometricProtection
                }
                break
            }
            case ProtectionRoute.SetupPinProtection:
                this.parentRouter.next()
                break
        }

        this.setNext(nextRoute)
    }
}
