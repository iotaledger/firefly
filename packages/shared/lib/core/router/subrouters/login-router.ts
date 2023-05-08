import { get, writable } from 'svelte/store'

import { activeProfile, migrateProfile } from '@lib/profile'
import { isStrongholdOutdated } from '@lib/stronghold'

import { appRouter } from '../app-router'
import { LoginRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'
import { UpdateStrongholdRouter, updateStrongholdRouter } from './update-stronghold-router'

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
                    updateStrongholdRouter.set(new UpdateStrongholdRouter(this))
                } else {
                    migrateProfile()
                    get(appRouter).next(event)
                }
                break
            case LoginRoute.UpdateStronghold:
                migrateProfile()
                get(appRouter).next(event)
                break
        }
        this.setNext(nextRoute)
    }
}
