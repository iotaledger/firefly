import { get, writable } from 'svelte/store'

import { appRouter } from '../app-router'
import { UpdateStrongholdRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types/event'
import { STRONGHOLD_DECRYPTION_ERROR, migrateStrongholdForLogin, migrateStrongholdForRecovery } from '@lib/stronghold'
import { showAppNotification } from '@lib/notifications'
import { strongholdPassword } from '@lib/app'

export const updateStrongholdRoute = writable<UpdateStrongholdRoute>(null)

export class UpdateStrongholdRouter extends Subrouter<UpdateStrongholdRoute> {
    constructor() {
        super(UpdateStrongholdRoute.Update, updateStrongholdRoute)
    }

    async next(event?: FireflyEvent): Promise<void> {
        let nextRoute: UpdateStrongholdRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case UpdateStrongholdRoute.Update:
                try {
                    await migrateFunction(event?.isRecovery)()
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

function migrateFunction(isRecovery: boolean): () => Promise<void> {
    if (isRecovery) {
        return migrateStrongholdForRecovery
    } else {
        return migrateStrongholdForLogin
    }
}
