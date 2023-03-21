import { get, writable } from 'svelte/store'

import { activeProfile, migrateProfile } from '@lib/profile'

import { appRouter } from '../app-router'
import { LoginRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'
import { isStrongholdOutdated } from '@lib/wallet'
import { UpdateStrongholdRouter, updateStrongholdRouter } from '@core/router'

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
                if (isStrongholdOutdated(get(activeProfile))) {
                    nextRoute = LoginRoute.UpdateStronghold
                } else {
                    migrateProfile()
                    get(appRouter).next(event)
                }
                break
        }
        this.setNext(nextRoute)
    }
}
