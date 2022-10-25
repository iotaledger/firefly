import { get, writable } from 'svelte/store'

import { Subrouter } from '@core/router'

import { AppSetupRoute } from '../../enums'
import { onboardingRouter } from '../../onboarding-router'

export const appSetupRoute = writable<AppSetupRoute>(null)
export const appSetupRouter = writable<AppSetupRouter>(null)

export class AppSetupRouter extends Subrouter<AppSetupRoute> {
    constructor() {
        super(AppSetupRoute.Welcome, appSetupRoute, get(onboardingRouter))
    }

    next(): void {
        let nextRoute: AppSetupRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case AppSetupRoute.Welcome:
                this.parentRouter.next()
                return
            case AppSetupRoute.Legal:
                nextRoute = AppSetupRoute.Welcome
                break
        }

        this.setNext(nextRoute)
    }
}
