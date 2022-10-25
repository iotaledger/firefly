import { get, writable } from 'svelte/store'

import { appRouter } from '../app-router'
import { Subrouter } from '../classes'
import { LoginRoute } from '../enums'
import { FireflyEvent } from '../types'

export const loginRoute = writable<LoginRoute>(null)
export const loginRouter = writable<LoginRouter>(null)

export class LoginRouter extends Subrouter<LoginRoute> {
    constructor() {
        super(LoginRoute.SelectProfile, loginRoute, get(appRouter))
    }

    next(event?: FireflyEvent): void {
        let nextRoute: LoginRoute
        const currentRoute = get(this.routeStore)

        switch (currentRoute) {
            case LoginRoute.SelectProfile: {
                if (event?.shouldAddProfile) {
                    this.parentRouter.next(event)
                    return
                } else {
                    nextRoute = LoginRoute.EnterPin
                }
                break
            }
            case LoginRoute.EnterPin:
                nextRoute = LoginRoute.LoadProfile
                break
            case LoginRoute.LoadProfile:
                this.parentRouter.next(event)
                return
        }

        this.setNext(nextRoute)
    }
}
