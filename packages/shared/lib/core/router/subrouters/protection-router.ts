import { get, writable } from 'svelte/store'

import { appRouter } from '../app-router'
import { ProtectionRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const protectionRoute = writable<ProtectionRoute>(null)
export const protectionRouter = writable<ProtectionRouter>(null)

export class ProtectionRouter extends Subrouter<ProtectionRoute> {
    constructor() {
        super(ProtectionRoute.SetupPinProtection, protectionRoute)
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
                get(appRouter).next(event)
                break
        }

        this.setNext(nextRoute)
    }
}
