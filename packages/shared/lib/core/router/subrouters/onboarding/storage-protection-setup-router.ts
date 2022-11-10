import { get, writable } from 'svelte/store'

import { onboardingProfile, ProfileProtectionType } from '@contexts/onboarding'

import { Subrouter } from '../../classes'
import { StorageProtectionSetupRoute } from '../../enums'
import { onboardingRouter } from '../../routers'

export const storageProtectionSetupRoute = writable<StorageProtectionSetupRoute>(null)
export const storageProtectionSetupRouter = writable<StorageProtectionSetupRouter>(null)

export class StorageProtectionSetupRouter extends Subrouter<StorageProtectionSetupRoute> {
    constructor() {
        super(StorageProtectionSetupRoute.SetupPinProtection, storageProtectionSetupRoute, get(onboardingRouter))
    }

    next(): void {
        let nextRoute: StorageProtectionSetupRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case StorageProtectionSetupRoute.ChooseProtectionMethod: {
                const protectionType = get(onboardingProfile)?.protectionType
                if (protectionType === ProfileProtectionType.Pin) {
                    nextRoute = StorageProtectionSetupRoute.SetupPinProtection
                } else if (protectionType === ProfileProtectionType.Biometric) {
                    nextRoute = StorageProtectionSetupRoute.SetupBiometricProtection
                }
                break
            }
            case StorageProtectionSetupRoute.SetupPinProtection:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
