import { get, writable } from 'svelte/store'

import { strongholdPassword } from '@lib/app'

import { UpdateStrongholdRoute } from '../enums'
import { Subrouter } from '../subrouters/subrouter'
import { FireflyEvent } from '../types'
import { Router } from '../router'
import { Platform } from '@lib/platform'
import { WALLET } from '@lib/shell/walletApi'
import { newProfile } from '@lib/profile'
import { importFilePath } from '../stores'
import { api, destroyActor, initialise } from '@lib/wallet'
import { initAppSettings } from '@lib/appSettings'

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
            case UpdateStrongholdRoute.UpdateStronghold:
                if (event?.isRecovery) {
                    try {
                        const newProfileId = get(newProfile)?.id

                        // destroy existing actor
                        // destroyActor(newProfileId)

                        // get source and destination paths
                        const userDataPath = await Platform.getUserDataPath()
                        const profileStoragePath = `${userDataPath}/__storage__/${newProfileId}`
                        const migrationDestinationPath = `${profileStoragePath}/db/wallet.stronghold`

                        // migrate
                        const _importFilePath = get(importFilePath)
                        const _strongholdPassword = get(strongholdPassword)
                        console.log(_importFilePath, _strongholdPassword, migrationDestinationPath, _strongholdPassword)
                        WALLET.migrateStrongholdSnapshotV2ToV3(
                            _importFilePath,
                            _strongholdPassword,
                            `${__dirname}/migrated.stronghold`,
                            _strongholdPassword
                        )

                        // re-instantiate
                        const { sendCrashReports } = get(initAppSettings) ?? { sendCrashReports: false }
                        const machineId = await Platform.getMachineId()
                        // initialise(newProfileId, profileStoragePath, sendCrashReports, machineId)
                    } catch (err) {
                        console.trace()
                        console.error(err)
                    }
                }

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
