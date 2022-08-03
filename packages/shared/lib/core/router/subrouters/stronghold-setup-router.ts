import { get, writable } from 'svelte/store'

import { StrongholdSetupRoute } from '../enums'
import { onboardingRouter } from '../onboarding-router'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const strongholdSetupRoute = writable<StrongholdSetupRoute>(null)
export const strongholdSetupRouter = writable<StrongholdSetupRouter>(null)

export class StrongholdSetupRouter extends Subrouter<StrongholdSetupRoute> {
    constructor() {
        super(StrongholdSetupRoute.SetupStrongholdPassword, strongholdSetupRoute, get(onboardingRouter))
    }

    next(event?: FireflyEvent): void {
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case StrongholdSetupRoute.SetupStrongholdPassword:
                this.parentRouter.next(event)
                break
        }
    }
}
