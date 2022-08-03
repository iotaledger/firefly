import { get, writable } from 'svelte/store'

import { onboardingRouter } from '../onboarding-router'
import { ProfileBackupRoute } from '../enums'
import { Subrouter } from './subrouter'

export const profileBackupRoute = writable<ProfileBackupRoute>(null)
export const profileBackupRouter = writable<ProfileBackupRouter>(null)

export class ProfileBackupRouter extends Subrouter<ProfileBackupRoute> {
    constructor() {
        super(ProfileBackupRoute.Init, profileBackupRoute, get(onboardingRouter))
    }

    next(): void {
        let nextRoute: ProfileBackupRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProfileBackupRoute.Init:
                nextRoute = ProfileBackupRoute.RecoveryPhrase
                break

            case ProfileBackupRoute.RecoveryPhrase:
                nextRoute = ProfileBackupRoute.Verify
                break

            case ProfileBackupRoute.Verify:
                nextRoute = ProfileBackupRoute.Backup
                break

            case ProfileBackupRoute.Backup: {
                this.parentRouter.next()
                break
            }
        }

        this.setNext(nextRoute)
    }
}
