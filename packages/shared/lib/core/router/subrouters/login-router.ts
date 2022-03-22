import { get, writable } from 'svelte/store'

import { migrateProfile } from '@lib/profile'

import { appRouter } from '../app-router'
import { LoginRoutes } from '../enums'
import { Subrouter } from '../subrouters'
import { FireflyEvent } from '../types'

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
