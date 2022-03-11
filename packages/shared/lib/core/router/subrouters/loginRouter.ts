import { get, writable } from 'svelte/store'
import { appRouter, LoginRoutes } from '@core/router'
import { migrateProfile } from 'shared/lib/profile'
import { FireflyEvent } from '@core/router/typings/event'
import { Subrouter } from '@core/router/subrouters/subrouter'

export const loginRoute = writable<LoginRoutes>(null)

export class LoginRouter extends Subrouter<LoginRoutes> {
    constructor() {
        super(LoginRoutes.Init, loginRoute)
    }

    next(event?: FireflyEvent): void {
        let nextRoute: LoginRoutes
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case LoginRoutes.Init: {
                if (event?.shouldAddProfile) {
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
        this.setNext(nextRoute)
    }
}
