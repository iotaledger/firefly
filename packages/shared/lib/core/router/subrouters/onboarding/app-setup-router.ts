import { get, writable } from 'svelte/store'

import { AppSetupRoute } from '../../enums'
import { onboardingRouter } from '../../onboarding-router'
import { Subrouter } from '../subrouter'

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
                nextRoute = AppSetupRoute.Legal
                break
            case AppSetupRoute.Legal:
                nextRoute = AppSetupRoute.LanguageAndAppearance
                break
            case AppSetupRoute.LanguageAndAppearance:
                this.parentRouter.next()
                break
        }

        this.setNext(nextRoute)
    }
}
