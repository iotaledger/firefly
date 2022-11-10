import { get, writable } from 'svelte/store'

import { Subrouter } from '../../classes'
import { StrongholdSetupRoute } from '../../enums'
import { onboardingRouter } from '../../routers'

export const strongholdSetupRoute = writable<StrongholdSetupRoute>(null)
export const strongholdSetupRouter = writable<StrongholdSetupRouter>(null)

export class StrongholdSetupRouter extends Subrouter<StrongholdSetupRoute> {
    constructor() {
        super(StrongholdSetupRoute.SetupStrongholdPassword, strongholdSetupRoute, get(onboardingRouter))
    }

    next(): void {
        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case StrongholdSetupRoute.SetupStrongholdPassword:
                this.parentRouter.next()
                return
        }
    }
}
