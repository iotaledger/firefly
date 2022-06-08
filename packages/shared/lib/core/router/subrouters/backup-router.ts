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

    next(event: FireflyEvent): void {
        let nextRoute: BackupRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case BackupRoute.Init:
                nextRoute = BackupRoute.RecoveryPhrase
                break

            case BackupRoute.RecoveryPhrase:
                nextRoute = BackupRoute.Verify
                break

            case BackupRoute.Verify:
                nextRoute = BackupRoute.Backup
                break

            case BackupRoute.Backup: {
                get(appRouter).next(event)
                break
            }
        }
        this.setNext(nextRoute)
    }
}
