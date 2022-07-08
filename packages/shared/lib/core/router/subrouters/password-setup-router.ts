import { get, writable } from 'svelte/store'

import { PasswordSetupRoute } from '../enums'
import { onboardingRouter } from '../onboarding-router'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const passwordSetupRoute = writable<PasswordSetupRoute>(null)
export const passwordSetupRouter = writable<PasswordSetupRouter>(null)

export class PasswordSetupRouter extends Subrouter<PasswordSetupRoute> {
    constructor() {
        super(PasswordSetupRoute.SetPassword, passwordSetupRoute, get(onboardingRouter))
    }

    next(event?: FireflyEvent): void {
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case PasswordSetupRoute.SetPassword:
                this.parentRouter.next(event)
                break
        }
    }
}
