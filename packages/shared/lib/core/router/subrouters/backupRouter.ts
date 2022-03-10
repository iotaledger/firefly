import { get, writable } from 'svelte/store'
import { appRouter, BackupRoutes } from '@core/router'
import { Router } from '@core/router/router'
import { asyncBackup, asyncCreateAccount, asyncStoreMnemonic, requestMnemonic } from 'shared/lib/wallet'
import { mnemonic, strongholdPassword } from 'shared/lib/app'
import { Platform } from 'shared/lib/platform'
import { getDefaultStrongholdName } from 'shared/lib/utils'
import { updateProfile } from 'shared/lib/profile'
import { FireflyEvent } from '@core/router/typings/event'
import { Subrouter } from '@core/router/subrouters/subrouter'

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
        if (nextRoute) {
            this.setNext(nextRoute)
        }
    }
}
