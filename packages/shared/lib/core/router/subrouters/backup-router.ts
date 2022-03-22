import { get, writable } from 'svelte/store'

import { mnemonic, strongholdPassword } from '@lib/app'
import { asyncBackup, asyncCreateAccount, asyncStoreMnemonic, requestMnemonic } from '@lib/wallet'
import { Platform } from '@lib/platform'
import { updateProfile } from '@lib/profile'
import { getDefaultStrongholdName } from '@lib/utils'

import { appRouter } from '../app-router'
import { BackupRoutes } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const backupRoute = writable<BackupRoutes>(null)

export class BackupRouter extends Subrouter<BackupRoutes> {
    constructor() {
        super(BackupRoutes.Init, backupRoute)
    }

    async next(event: FireflyEvent): Promise<void> {
        let nextRoute: BackupRoutes

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case BackupRoutes.Init:
                await requestMnemonic()
                nextRoute = BackupRoutes.RecoveryPhrase
                break
            case BackupRoutes.RecoveryPhrase:
                nextRoute = BackupRoutes.Verify
                break

            case BackupRoutes.Verify:
                nextRoute = BackupRoutes.Backup
                break

            case BackupRoutes.Backup:
                if (event?.skip) {
                    await asyncStoreMnemonic(get(mnemonic).join(' '))
                    await asyncCreateAccount()
                    get(appRouter).next(event)
                } else {
                    const dest = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
                    if (dest) {
                        await asyncStoreMnemonic(get(mnemonic).join(' '))
                        await asyncCreateAccount()
                        await asyncBackup(dest, get(strongholdPassword))
                        updateProfile('lastStrongholdBackupTime', new Date())
                        get(appRouter).next(event)
                    }
                }
                break
        }
        this.setNext(nextRoute)
    }
}
