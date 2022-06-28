import { get, writable } from 'svelte/store'

import {
    importFilePath,
    isGettingMigrationData,
    mnemonic,
    profileRecoveryType,
    ProfileRecoveryType,
} from '@contexts/onboarding'
import { getMigrationData } from '@lib/migration'

import { onboardingRouter } from '../onboarding-router'
import { RecoveryRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const recoveryRoute = writable<RecoveryRoute>(null)
export const recoveryRouter = writable<RecoveryRouter>(null)

export class RecoveryRouter extends Subrouter<RecoveryRoute> {
    public importFile: Buffer

    constructor() {
        super(getInitialRoute() ?? RecoveryRoute.TextImport, recoveryRoute, onboardingRouter)
    }

    async next(event: FireflyEvent): Promise<void> {
        let nextRoute: RecoveryRoute
        const params = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case RecoveryRoute.TextImport: {
                const { migrationSeed } = params
                const _profileRecoveryType = get(profileRecoveryType)
                if (_profileRecoveryType === ProfileRecoveryType.Seed) {
                    isGettingMigrationData.set(true)
                    await getMigrationData(migrationSeed)
                    isGettingMigrationData.set(false)
                    get(onboardingRouter).next({ profileRecoveryType: _profileRecoveryType })
                } else if (_profileRecoveryType === ProfileRecoveryType.Mnemonic) {
                    mnemonic.set(migrationSeed?.split(' '))
                    nextRoute = RecoveryRoute.Success
                }
                break
            }
            case RecoveryRoute.FileImport: {
                const strongholdRegex = /\.(stronghold)$/i
                const seedvaultRegex = /\.(kdbx)$/i
                const { file, fileName, filePath } = params

                if (seedvaultRegex.test(fileName)) {
                    profileRecoveryType.set(ProfileRecoveryType.SeedVault)
                } else if (strongholdRegex.test(fileName)) {
                    profileRecoveryType.set(ProfileRecoveryType.Stronghold)
                } else {
                    throw new Error('Unsupported file extension!')
                }

                this.importFile = file
                importFilePath.set(filePath)
                nextRoute = RecoveryRoute.BackupPassword
                break
            }
            case RecoveryRoute.BackupPassword: {
                nextRoute = RecoveryRoute.Success
                break
            }
            case RecoveryRoute.LedgerImport: {
                const _profileRecoveryType = params?.profileRecoveryType
                profileRecoveryType.set(_profileRecoveryType)
                get(onboardingRouter).next({ profileRecoveryType: _profileRecoveryType })
                break
            }
            case RecoveryRoute.Success:
                get(onboardingRouter).next({ profileRecoveryType: get(profileRecoveryType) })
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
