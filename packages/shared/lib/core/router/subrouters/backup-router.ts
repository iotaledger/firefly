import { updateNewProfile } from '@core/profile'
import { backup, storeMnemonic } from '@core/profile-manager'
import { mnemonic, strongholdPassword } from '@lib/app'
import { Platform } from '@lib/platform'
import { getDefaultStrongholdName } from '@lib/utils'
import { createAccount, generateAndStoreMnemonic } from '@lib/wallet'
import { get, writable } from 'svelte/store'
import { appRouter } from '../app-router'
import { BackupRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const backupRoute = writable<BackupRoute>(null)

export class BackupRouter extends Subrouter<BackupRoute> {
    constructor() {
        super(BackupRoute.Init, backupRoute)
    }

    async next(event: FireflyEvent): Promise<void> {
        let nextRoute: BackupRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case BackupRoute.Init:
                await generateAndStoreMnemonic()
                nextRoute = BackupRoute.RecoveryPhrase
                break

            case BackupRoute.RecoveryPhrase:
                nextRoute = BackupRoute.Verify
                break

            case BackupRoute.Verify:
                nextRoute = BackupRoute.Backup
                break

            case BackupRoute.Backup: {
                await storeMnemonic(get(mnemonic).join(' '))
                await createAccount()
                const shouldCreateBackup = !event?.skip
                if (shouldCreateBackup) {
                    const dest = await Platform.getStrongholdBackupDestination(getDefaultStrongholdName())
                    if (dest) {
                        await backup(dest, get(strongholdPassword))
                        updateNewProfile({ lastStrongholdBackupTime: new Date() })
                    }
                }
                get(appRouter).next(event)
                break
            }
        }
        this.setNext(nextRoute)
    }
}
