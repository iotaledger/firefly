import { get, writable } from 'svelte/store'

import { AppStage, appStage } from '@core/app'
import { updateNewProfile } from '@core/profile'

import { AppSetupRoute } from '../enums'
import { Subrouter } from './subrouter'
import { onboardingRouter } from '../onboarding-router'

export const appSetupRoute = writable<AppSetupRoute>(null)
export const appSetupRouter = writable<AppSetupRouter>(null)

export class AppSetupRouter extends Subrouter<AppSetupRoute> {
    constructor() {
        super(AppSetupRoute.Legal, appSetupRoute)
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
                get(onboardingRouter).next()
                break
        }

        this.setNext(nextRoute)
    }
}
