import { get, writable } from 'svelte/store'

import { AppStage, appStage } from '@core/app'
import { updateNewProfile } from '@contexts/onboarding'

import { AppSetupRoute } from '../enums'
import { Subrouter } from './subrouter'
import { onboardingRouter } from '../onboarding-router'

export const appSetupRoute = writable<AppSetupRoute>(null)
export const appSetupRouter = writable<AppSetupRouter>(null)

export class AppSetupRouter extends Subrouter<AppSetupRoute> {
    constructor() {
        super(AppSetupRoute.Legal, appSetupRoute, get(onboardingRouter))
    }

    next(): void {
        let nextRoute: AppSetupRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case AppSetupRoute.Legal:
                nextRoute = AppSetupRoute.CrashReporting
                break
            case AppSetupRoute.CrashReporting:
                nextRoute = AppSetupRoute.LanguageAndAppearance
                break
            case AppSetupRoute.LanguageAndAppearance:
                if (get(appStage) !== AppStage.PROD) {
                    updateNewProfile({ isDeveloperProfile: true })
                }
                this.parentRouter.next()
                break
        }

        this.setNext(nextRoute)
    }
}
