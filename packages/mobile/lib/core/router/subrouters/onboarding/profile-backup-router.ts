import { get, writable } from 'svelte/store'

import { ProfileBackupRoute } from '../../enums'
import { onboardingRouter } from '../../onboarding-router'
import { Subrouter } from '@core/router'

export const profileBackupRoute = writable<ProfileBackupRoute>(null)
export const profileBackupRouter = writable<ProfileBackupRouter>(null)

export class ProfileBackupRouter extends Subrouter<ProfileBackupRoute> {
    constructor() {
        super(ProfileBackupRoute.ViewMnemonic, profileBackupRoute, get(onboardingRouter))
    }

    next(): void {
        let nextRoute: ProfileBackupRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProfileBackupRoute.BackupMnemonic:
                nextRoute = ProfileBackupRoute.ViewMnemonic
                break

            case ProfileBackupRoute.ViewMnemonic:
                nextRoute = ProfileBackupRoute.VerifyMnemonic
                break

            case ProfileBackupRoute.VerifyMnemonic:
                this.parentRouter.next()
                break

            case ProfileBackupRoute.BackupStronghold: {
                this.parentRouter.next()
                return
            }
        }

        this.setNext(nextRoute)
    }
}
