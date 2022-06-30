import { get, writable } from 'svelte/store'
import { appRouter } from '../app-router'
import { LoginRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const loginRoute = writable<LoginRoute>(null)

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
                } else {
                    nextRoute = LoginRoute.EnterPin
                }
                break
            }
            case LoginRoute.EnterPin:
                this.parentRouter.next(event)
                break
        }

        this.setNext(nextRoute)
    }
}
