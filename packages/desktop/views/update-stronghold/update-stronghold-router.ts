import { Subrouter } from '@core/router/classes'
import { IRouter } from '@core/router/interfaces'
import { get, writable } from 'svelte/store'
import { UpdateStrongholdRoute } from './update-stronghold-route.enum'

export const updateStrongholdRoute = writable<UpdateStrongholdRoute>(null)
export const updateStrongholdRouter = writable<UpdateStrongholdRouter>(null)

export class UpdateStrongholdRouter extends Subrouter<UpdateStrongholdRoute> {
    constructor(parentRouter: IRouter) {
        super(UpdateStrongholdRoute.Update, updateStrongholdRoute, parentRouter)
    }

    next(): void {
        let nextRoute: UpdateStrongholdRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case UpdateStrongholdRoute.Update:
                nextRoute = UpdateStrongholdRoute.ChangePassword
                break
            case UpdateStrongholdRoute.ChangePassword:
                nextRoute = UpdateStrongholdRoute.SaveBackup
                break
            case UpdateStrongholdRoute.SaveBackup:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}
