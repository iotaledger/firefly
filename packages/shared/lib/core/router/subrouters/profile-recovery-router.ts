import { get, writable } from 'svelte/store'

import { isGettingMigrationData, onboardingProfile, ProfileRecoveryType } from '@contexts/onboarding'

import { onboardingRouter } from '../onboarding-router'
import { ProfileRecoveryRoute } from '../enums'
import { Subrouter } from './subrouter'

export const profileRecoveryRoute = writable<ProfileRecoveryRoute>(null)
export const profileRecoveryRouter = writable<ProfileRecoveryRouter>(null)

export class ProfileRecoveryRouter extends Subrouter<ProfileRecoveryRoute> {
    public importFile: Buffer

    constructor() {
        super(getInitialRoute() ?? ProfileRecoveryRoute.TextImport, profileRecoveryRoute, get(onboardingRouter))
    }

    resetRoute(): void {
        profileRecoveryRoute.set(getInitialRoute() ?? ProfileRecoveryRoute.TextImport)
    }

    next(): void {
        let nextRoute: ProfileRecoveryRoute

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProfileRecoveryRoute.TextImport: {
                const _profileRecoveryType = get(onboardingProfile)?.recoveryType
                if (_profileRecoveryType === ProfileRecoveryType.Seed) {
                    isGettingMigrationData.set(true)
                    // await getMigrationData(migrationSeed)
                    isGettingMigrationData.set(false)
                    this.parentRouter.next()
                } else if (_profileRecoveryType === ProfileRecoveryType.Mnemonic) {
                    nextRoute = ProfileRecoveryRoute.Success
                }
                break
            }
            case ProfileRecoveryRoute.FileImport: {
                nextRoute = ProfileRecoveryRoute.BackupPassword
                break
            }
            case ProfileRecoveryRoute.BackupPassword: {
                nextRoute = ProfileRecoveryRoute.Success
                break
            }
            case ProfileRecoveryRoute.LedgerImport: {
                // const _profileRecoveryType = get(onboardingProfile)?.recoveryType
                // this.parentRouter.next()
                break
            }
            case ProfileRecoveryRoute.Success:
                this.parentRouter.next()
                break
        }

        this.setNext(nextRoute)
    }
}

function getInitialRoute(): ProfileRecoveryRoute {
    switch (get(onboardingProfile)?.recoveryType) {
        case ProfileRecoveryType.Mnemonic:
            return ProfileRecoveryRoute.TextImport
        case ProfileRecoveryType.Stronghold:
            return ProfileRecoveryRoute.FileImport
        case ProfileRecoveryType.Ledger:
            return ProfileRecoveryRoute.LedgerImport
    }
}
