import { get, writable } from 'svelte/store'

import { onboardingProfile, ProfileProtectionType } from '@contexts/onboarding'

import { onboardingRouter } from '../../onboarding-router'
import { ProtectionRoute } from '../../enums'
import { Subrouter } from '../subrouter'

export const storageProtectionSetupRoute = writable<ProtectionRoute>(null)
export const storageProtectionSetupRouter = writable<StorageProtectionSetupRouter>(null)

export class StorageProtectionSetupRouter extends Subrouter<ProtectionRoute> {
    constructor() {
        super(ProtectionRoute.SetupPinProtection, storageProtectionSetupRoute, get(onboardingRouter))
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
