import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { RestoreFromStrongholdRoute } from './restore-from-stronghold-route.enum'
import { onboardingProfile } from '@contexts/onboarding/stores'
import { isLatestStrongholdVersion } from '@core/app/utils'
import { UpdateStrongholdRouter, updateStrongholdRouter } from '@core/router'

export const restoreFromStrongholdRoute = writable<RestoreFromStrongholdRoute>(undefined)
export const restoreFromStrongholdRouter = writable<RestoreFromStrongholdRouter>(undefined)

export class RestoreFromStrongholdRouter extends Subrouter<RestoreFromStrongholdRoute> {
    constructor(parentRouter: Router<unknown>) {
        super(RestoreFromStrongholdRoute.ImportStronghold, restoreFromStrongholdRoute, parentRouter)
    }

    next(): void {
        let nextRoute: RestoreFromStrongholdRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case RestoreFromStrongholdRoute.ImportStronghold:
                if (isLatestStrongholdVersion(get(onboardingProfile)?.strongholdVersion)) {
                    nextRoute = RestoreFromStrongholdRoute.UnlockStronghold
                } else {
                    updateStrongholdRouter.set(new UpdateStrongholdRouter(this))
                    nextRoute = RestoreFromStrongholdRoute.UpdateStronghold
                }
                break
            case RestoreFromStrongholdRoute.UnlockStronghold:
            case RestoreFromStrongholdRoute.UpdateStronghold:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
