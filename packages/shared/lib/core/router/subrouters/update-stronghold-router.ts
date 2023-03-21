import { get, writable } from 'svelte/store'

import { UpdateStrongholdRoute } from '../enums'
import { Subrouter } from '../subrouters'
import { FireflyEvent } from '../types'

export const updateStrongholdRoute = writable<UpdateStrongholdRoute>(null)
export const updateStrongholdRouter = writable<UpdateStrongholdRouter>(null)

export class UpdateStrongholdRouter extends Subrouter<UpdateStrongholdRoute> {
    constructor() {
        super(UpdateStrongholdRoute.UpdateStronghold, updateStrongholdRoute)
    }

    next(_?: FireflyEvent): void {
        let nextRoute: UpdateStrongholdRoute
        const currentRoute = get(updateStrongholdRoute)
        switch (currentRoute) {
            case UpdateStrongholdRoute.UpdateStronghold:
                nextRoute = UpdateStrongholdRoute.ChangePassword
                break
            case UpdateStrongholdRoute.ChangePassword:
                nextRoute = UpdateStrongholdRoute.SaveBackup
                break
            case UpdateStrongholdRoute.SaveBackup:
                return
        }
        this.setNext(nextRoute)
    }
}
