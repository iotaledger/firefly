import { get, writable } from 'svelte/store'

import { mnemonic, mobile, strongholdPassword } from '@lib/app'
import { asyncBackup, asyncCreateAccount, asyncStoreMnemonic, requestMnemonic } from '@lib/wallet'
import { Platform } from '@lib/platform'
import { updateProfile } from '@lib/profile'
import { getDefaultStrongholdName } from '@lib/utils'

import { appRouter } from '../app-router'
import { BackupRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const backupRoute = writable<BackupRoute>(null)

export class BackupRouter extends Subrouter<BackupRoute> {
    constructor() {
        if (get(mobile)) {
            requestMnemonic()
            super(BackupRoute.RecoveryPhrase, backupRoute)
        } else {
            super(BackupRoute.Init, backupRoute)
        }
    }

    async next(event: FireflyEvent): Promise<void> {
        let nextRoute: BackupRoute

        const currentRoute = get(this.routeStore)
        if (get(mobile)) {
            switch (currentRoute) {
                case BackupRoute.RecoveryPhrase:
                    nextRoute = BackupRoute.Verify
                    break
                case BackupRoute.Verify:
                    await asyncStoreMnemonic(get(mnemonic).join(' '))
                    await asyncCreateAccount()
                    get(appRouter).next(event)
                    break
            }
        } else {
            switch (currentRoute) {
                case BackupRoute.Init:
                    await requestMnemonic()
                    nextRoute = BackupRoute.RecoveryPhrase
                    break
                case BackupRoute.RecoveryPhrase:
                    nextRoute = BackupRoute.Verify
                    break
                case BackupRoute.Verify:
                    nextRoute = BackupRoute.Backup
                    break
                case BackupRoute.Backup:
                    if (event?.skip) {
                        await asyncStoreMnemonic(get(mnemonic).join(' '))
                        await asyncCreateAccount()
                        get(appRouter).next(event)
                    } else {
                        const dest = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
                        if (dest) {
                            await asyncStoreMnemonic(get(mnemonic).join(' '))
                            await asyncCreateAccount()
                            await Platform.saveStrongholdBackup({ allowAccess: true })
                            await asyncBackup(dest, get(strongholdPassword))
                            await Platform.saveStrongholdBackup({ allowAccess: false })
                            updateProfile('lastStrongholdBackupTime', new Date())
                            get(appRouter).next(event)
                        }
                    }
                    break
            }
        }
        this.setNext(nextRoute)
    }
}
