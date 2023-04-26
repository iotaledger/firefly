import { Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { restoreProfileRouter } from '../restore-profile/restore-profile-router'
import { RestoreFromStrongholdRoute } from './restore-from-stronghold-route.enum'

export const restoreFromStrongholdRoute = writable<RestoreFromStrongholdRoute>(undefined)
export const restoreFromStrongholdRouter = writable<RestoreFromStrongholdRouter>(undefined)

export class RestoreFromStrongholdRouter extends Subrouter<RestoreFromStrongholdRoute> {
    constructor() {
        super(RestoreFromStrongholdRoute.ImportStronghold, restoreFromStrongholdRoute, get(restoreProfileRouter))
    }

    next(): void {
        let nextRoute: RestoreFromStrongholdRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case RestoreFromStrongholdRoute.ImportStronghold:
                nextRoute = RestoreFromStrongholdRoute.UnlockStronghold
                break
            case RestoreFromStrongholdRoute.UnlockStronghold:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
