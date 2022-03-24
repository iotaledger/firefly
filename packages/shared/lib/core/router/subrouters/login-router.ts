import { get, writable } from 'svelte/store'

import { migrateProfile } from '@lib/profile'

import { appRouter } from '../app-router'
import { LoginRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const loginRoute = writable<LoginRoute>(null)

export class LoginRouter extends Subrouter<LoginRoute> {
    constructor() {
        super(LoginRoute.Init, loginRoute)
    }

    next(event?: FireflyEvent): void {
        let nextRoute: LoginRoute
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case LoginRoute.Init: {
                if (event?.shouldAddProfile) {
                    get(appRouter).next(event)
                } else {
                    nextRoute = LoginRoute.EnterPin
                }
                break
            }
            case LoginRoute.EnterPin:
                migrateProfile()
                get(appRouter).next(event)
                break
        }
        this.setNext(nextRoute)
    }
}
