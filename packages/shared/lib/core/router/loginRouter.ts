import { get, writable } from 'svelte/store'
import { appRouter, LoginRoutes } from '@core/router'
import { Router } from '@core/router/router'
import { migrateProfile } from 'shared/lib/profile'

export const loginRoute = writable<LoginRoutes>(null)

export class LoginRouter extends Router<LoginRoutes> {
    constructor() {
        super(LoginRoutes.Init, loginRoute)
    }

    next(event?: CustomEvent): void {
        let nextRoute: LoginRoutes
        const params = event?.detail || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case LoginRoutes.Init: {
                const { shouldAddProfile } = params
                if (shouldAddProfile) {
                    get(appRouter).next(event)
                } else {
                    nextRoute = LoginRoutes.EnterPin
                }
                break
            }
            case LoginRoutes.EnterPin:
                migrateProfile()
                get(appRouter).next(event)
                break
        }
        if (nextRoute) {
            this.setNext(nextRoute)
        }
    }

    previous(): void {
        super.previous()
        if (get(this.history).length === 0) {
            get(appRouter).previous()
        }
    }
}
