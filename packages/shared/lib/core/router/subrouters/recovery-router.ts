import { get, writable } from 'svelte/store'

import { isGettingMigrationData, profileRecoveryType, ProfileRecoveryType } from '@contexts/onboarding'
// import { getMigrationData } from '@lib/migration'

import { onboardingRouter } from '../onboarding-router'
import { RecoveryRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const recoveryRoute = writable<RecoveryRoute>(null)
export const recoveryRouter = writable<RecoveryRouter>(null)

export class RecoveryRouter extends Subrouter<RecoveryRoute> {
    public importFile: Buffer

    constructor() {
        super(getInitialRoute() ?? RecoveryRoute.TextImport, recoveryRoute, get(onboardingRouter))
    }

    resetRoute(): void {
        recoveryRoute.set(getInitialRoute() ?? RecoveryRoute.TextImport)
    }

    next(event?: FireflyEvent): void {
        let nextRoute: RecoveryRoute
        const params = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case RecoveryRoute.TextImport: {
                const _profileRecoveryType = get(profileRecoveryType)
                if (_profileRecoveryType === ProfileRecoveryType.Seed) {
                    isGettingMigrationData.set(true)
                    // await getMigrationData(migrationSeed)
                    isGettingMigrationData.set(false)
                    this.parentRouter.next({ profileRecoveryType: _profileRecoveryType })
                } else if (_profileRecoveryType === ProfileRecoveryType.Mnemonic) {
                    nextRoute = RecoveryRoute.Success
                }
                break
            }
            case RecoveryRoute.FileImport: {
                nextRoute = RecoveryRoute.BackupPassword
                break
            }
            case RecoveryRoute.BackupPassword: {
                nextRoute = RecoveryRoute.Success
                break
            }
            case RecoveryRoute.LedgerImport: {
                const _profileRecoveryType = params?.profileRecoveryType
                this.parentRouter.next({ profileRecoveryType: _profileRecoveryType })
                break
            }
            case RecoveryRoute.Success:
                this.parentRouter.next({ profileRecoveryType: get(profileRecoveryType) })
                break
        }

        this.setNext(nextRoute)
    }
}

function getInitialRoute(): RecoveryRoute {
    switch (get(profileRecoveryType)) {
        case ProfileRecoveryType.Mnemonic:
            return RecoveryRoute.TextImport
        case ProfileRecoveryType.Stronghold:
            return RecoveryRoute.FileImport
        case ProfileRecoveryType.Ledger:
            return RecoveryRoute.LedgerImport
    }
}
