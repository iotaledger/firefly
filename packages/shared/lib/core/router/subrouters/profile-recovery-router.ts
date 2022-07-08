import { get, writable } from 'svelte/store'

import { isGettingMigrationData, profileRecoveryType, ProfileRecoveryType } from '@contexts/onboarding'
// import { getMigrationData } from '@lib/migration'

import { onboardingRouter } from '../onboarding-router'
import { ProfileRecoveryRoute } from '../enums'
import { FireflyEvent } from '../types'
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

    next(event?: FireflyEvent): void {
        let nextRoute: ProfileRecoveryRoute
        const params = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ProfileRecoveryRoute.TextImport: {
                const _profileRecoveryType = get(profileRecoveryType)
                if (_profileRecoveryType === ProfileRecoveryType.Seed) {
                    isGettingMigrationData.set(true)
                    // await getMigrationData(migrationSeed)
                    isGettingMigrationData.set(false)
                    this.parentRouter.next({ profileRecoveryType: _profileRecoveryType })
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
                const _profileRecoveryType = params?.profileRecoveryType
                this.parentRouter.next({ profileRecoveryType: _profileRecoveryType })
                break
            }
            case ProfileRecoveryRoute.Success:
                this.parentRouter.next({ profileRecoveryType: get(profileRecoveryType) })
                break
        }

        this.setNext(nextRoute)
    }
}

function getInitialRoute(): ProfileRecoveryRoute {
    switch (get(profileRecoveryType)) {
        case ProfileRecoveryType.Mnemonic:
            return ProfileRecoveryRoute.TextImport
        case ProfileRecoveryType.Stronghold:
            return ProfileRecoveryRoute.FileImport
        case ProfileRecoveryType.Ledger:
            return ProfileRecoveryRoute.LedgerImport
    }
}
