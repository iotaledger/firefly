import { get, writable } from 'svelte/store'

import { UpdateStrongholdRoute } from '../enums'
import { Subrouter } from '../subrouters/subrouter'
import { FireflyEvent } from '../types'
import { appRouter } from '@core/router'
import { Router } from '@core/router/router'
import { strongholdPassword } from '@lib/app'

export const updateStrongholdRoute = writable<UpdateStrongholdRoute>(null)
export const updateStrongholdRouter = writable<UpdateStrongholdRouter>(null)

export class UpdateStrongholdRouter extends Subrouter<UpdateStrongholdRoute> {
    private readonly _parentRouter: Router<unknown>

    constructor(parentRouter: Router<unknown>) {
        super(UpdateStrongholdRoute.UpdateStronghold, updateStrongholdRoute)
        this._parentRouter = parentRouter
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

    previous(): void {
        if (this.history.length === 0) {
            strongholdPassword.set(undefined)
            this._parentRouter.previous()
        } else {
            super.previous()
        }
    }
}
