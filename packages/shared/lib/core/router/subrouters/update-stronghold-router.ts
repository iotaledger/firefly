import { get, writable } from 'svelte/store'

import { appRouter } from '../app-router'
import { UpdateStrongholdRoute } from '../enums'
import { Subrouter } from './subrouter'

export const updateStrongholdRoute = writable<UpdateStrongholdRoute>(null)

export class UpdateStrongholdRouter extends Subrouter<UpdateStrongholdRoute> {
    constructor() {
        super(UpdateStrongholdRoute.Update, updateStrongholdRoute)
    }

    next(): void {
        let nextRoute: UpdateStrongholdRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case UpdateStrongholdRoute.Update:
                nextRoute = UpdateStrongholdRoute.ChangePassword
                break
            case UpdateStrongholdRoute.ChangePassword:
                nextRoute = UpdateStrongholdRoute.Success
                break
            case UpdateStrongholdRoute.Success:
                get(appRouter).next()
                return
        }

        this.setNext(nextRoute)
    }
}
