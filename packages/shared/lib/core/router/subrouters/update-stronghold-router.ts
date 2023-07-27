import { get, writable } from 'svelte/store'

import { strongholdPassword } from '@lib/app'
import { migrateStrongholdForLogin, migrateStrongholdForRecovery, STRONGHOLD_DECRYPTION_ERROR } from '@lib/stronghold'

import { UpdateStrongholdRoute } from '../enums'
import { Subrouter } from '../subrouters/subrouter'
import { FireflyEvent } from '../types'
import { Router } from '../router'
import { showAppNotification } from '@lib/notifications'

export const updateStrongholdRoute = writable<UpdateStrongholdRoute>(null)
export const updateStrongholdRouter = writable<UpdateStrongholdRouter>(null)

export class UpdateStrongholdRouter extends Subrouter<UpdateStrongholdRoute> {
    private readonly _parentRouter: Router<unknown>

    constructor(parentRouter: Router<unknown>) {
        super(UpdateStrongholdRoute.UpdateStronghold, updateStrongholdRoute)
        this._parentRouter = parentRouter
    }

    async next(event?: FireflyEvent): Promise<void> {
        let nextRoute: UpdateStrongholdRoute
        const currentRoute = get(updateStrongholdRoute)
        switch (currentRoute) {
            case UpdateStrongholdRoute.UpdateStronghold: {
                const migrateFn = event?.isRecovery ? migrateStrongholdForRecovery : migrateStrongholdForLogin
                try {
                    await migrateFn()
                    nextRoute = UpdateStrongholdRoute.ChangePassword
                    break
                } catch (err) {
                    if (err?.message?.match(STRONGHOLD_DECRYPTION_ERROR)) {
                        strongholdPassword.set(undefined)
                    } else {
                        showAppNotification({
                            type: 'error',
                            message: err?.message ?? err?.error ?? err,
                        })
                    }
                    return
                }
            }
            case UpdateStrongholdRoute.ChangePassword:
                nextRoute = UpdateStrongholdRoute.SaveBackup
                break
            case UpdateStrongholdRoute.SaveBackup:
                strongholdPassword.set(null)
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
