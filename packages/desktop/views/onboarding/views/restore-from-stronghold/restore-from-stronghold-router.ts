import { Router, Subrouter } from '@core/router'
import { get, writable } from 'svelte/store'
import { RestoreFromStrongholdRoute } from './restore-from-stronghold-route.enum'

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
                nextRoute = RestoreFromStrongholdRoute.UnlockStronghold
                break
            case RestoreFromStrongholdRoute.UnlockStronghold:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
