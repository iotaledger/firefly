import { get, writable } from 'svelte/store'

import { profiles } from '@core/profile'
import { IRouterEvent, Router } from '@core/router'

import { AppRoute, LoginRoute } from './enums'
import { loginRoute } from './subrouters'

export const appRoute = writable<AppRoute>(null)
export const appRouter = writable<AppRouter>(null)

export class AppRouter extends Router<AppRoute> {
    constructor() {
        super(AppRoute.Onboarding, appRoute)
        this.init()
    }

    public init(): void {
        const hasCompletedOnboarding = get(profiles)?.length > 0
        this.routeStore.set(hasCompletedOnboarding ? AppRoute.Login : AppRoute.Onboarding)
    }

    public reset(): void {
        this.history = []
        this.init()
    }

    public next(event?: IRouterEvent): void {
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
                if (params.shouldAddProfile) {
                    nextRoute = AppRoute.Onboarding
                } else {
                    loginRoute.set(LoginRoute.LoadProfile)
                    nextRoute = AppRoute.Login
                }
                break
            }
        }

        this.setNext(nextRoute)
    }

    public forceNextRoute(route: AppRoute): void {
        this.setNext(route)
    }
}
