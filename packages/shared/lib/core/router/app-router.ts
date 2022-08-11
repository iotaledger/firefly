import { get, writable } from 'svelte/store'

import { profiles } from '@core/profile'

import { AppRoute } from './enums'
import { Router } from './router'
import { FireflyEvent } from './types'

export const appRoute = writable<AppRoute>(null)
export const appRouter = writable<AppRouter>(null)

export class AppRouter extends Router<AppRoute> {
    constructor() {
        super(AppRoute.Onboarding, appRoute)
        this.init()
    }

    public init(): void {
        const hasCompletedOnboarding = get(profiles).length > 0
        this.routeStore.set(hasCompletedOnboarding ? AppRoute.Login : AppRoute.Onboarding)
    }

    public reset(): void {
        this.history = []
        this.init()
    }

    public next(event?: FireflyEvent): void {
        const params = event || {}
        let nextRoute: AppRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case AppRoute.Login: {
                if (params.shouldAddProfile) {
                    nextRoute = AppRoute.Onboarding
                } else {
                    nextRoute = AppRoute.Dashboard
                }
                break
            }
            case AppRoute.Dashboard: {
                if (params.reset) {
                    nextRoute = AppRoute.Login
                }
                break
            }
            case AppRoute.Onboarding: {
                nextRoute = AppRoute.Dashboard
                break
            }
        }

        this.setNext(nextRoute)
    }

    public forceNextRoute(route: AppRoute): void {
        this.setNext(route)
    }
}
