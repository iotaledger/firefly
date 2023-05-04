import { get, writable } from 'svelte/store'

import { onboardingProfile, RestoreProfileType } from '@contexts/onboarding'
import { Subrouter } from '@core/router'

import { ProfileRecoveryRoute } from '../../enums'
import { onboardingRouter } from '../onboarding-router'

export const profileRecoveryRoute = writable<ProfileRecoveryRoute>(null)
export const profileRecoveryRouter = writable<ProfileRecoveryRouter>(null)

export class ProfileRecoveryRouter extends Subrouter<ProfileRecoveryRoute> {
    public importFile: Buffer

    constructor() {
        super(
            getInitialRoute() ?? ProfileRecoveryRoute.ImportMnemonicPhrase,
            profileRecoveryRoute,
            get(onboardingRouter)
        )
    }

    resetRecovery(): void {
        get(onboardingRouter).resetRecovery()
    }

    resetRoute(): void {
        profileRecoveryRoute.set(getInitialRoute() ?? ProfileRecoveryRoute.ImportMnemonicPhrase)
    }

    next(): void {
        let nextRoute: ProfileRecoveryRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProfileRecoveryRoute.ImportMnemonicPhrase: {
                const restoreProfileType = get(onboardingProfile)?.restoreProfileType
                if (restoreProfileType === RestoreProfileType.Mnemonic) {
                    nextRoute = ProfileRecoveryRoute.Success
                }
                break
            }
            case ProfileRecoveryRoute.ImportStrongholdBackup: {
                nextRoute = ProfileRecoveryRoute.BackupPassword
                break
            }
            case ProfileRecoveryRoute.BackupPassword: {
                nextRoute = ProfileRecoveryRoute.Success
                break
            }
            case ProfileRecoveryRoute.Success:
                this.parentRouter.next()
                return
        }

        this.setNext(nextRoute)
    }
}

function getInitialRoute(): ProfileRecoveryRoute {
    switch (get(onboardingProfile)?.restoreProfileType) {
        case RestoreProfileType.Mnemonic:
            return ProfileRecoveryRoute.ImportMnemonicPhrase
        case RestoreProfileType.Stronghold:
            return ProfileRecoveryRoute.ImportStrongholdBackup
    }
}
