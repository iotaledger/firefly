import { get, writable } from 'svelte/store'

import { NetworkProtocol } from '@core/network'
import { newProfile } from '@core/profile'
import {
    mnemonic,
    isGettingMigrationData,
    importFilePath,
    profileRecoveryType,
    ProfileRecoveryType,
} from '@contexts/onboarding'
import { getMigrationData } from '@lib/migration'

import { appRouter } from '../app-router'
import { ImportRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const importRoute = writable<ImportRoute>(null)
export const importRouter = writable<ImportRouter>(null)

export class ImportRouter extends Subrouter<ImportRoute> {
    public importFile: Buffer

    constructor() {
        super(ImportRoute.Init, importRoute)
    }

    async next(event: FireflyEvent): Promise<void> {
        let nextRoute: ImportRoute
        const params = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ImportRoute.Init: {
                const _profileRecoveryType = params?.profileRecoveryType
                profileRecoveryType.set(_profileRecoveryType)
                if (
                    _profileRecoveryType === ProfileRecoveryType.Seed ||
                    _profileRecoveryType === ProfileRecoveryType.Mnemonic
                ) {
                    nextRoute = ImportRoute.TextImport
                } else if (_profileRecoveryType === ProfileRecoveryType.File) {
                    nextRoute = ImportRoute.FileImport
                } else if (_profileRecoveryType === ProfileRecoveryType.Ledger) {
                    if (get(newProfile)?.networkProtocol === NetworkProtocol.Shimmer) {
                        profileRecoveryType.set(ProfileRecoveryType.FireflyLedger)
                        get(appRouter).next({ profileRecoveryType: ProfileRecoveryType.FireflyLedger })
                        break
                    }
                    nextRoute = ImportRoute.LedgerImport
                }
                break
            }
            case ImportRoute.TextImport: {
                const { migrationSeed } = params
                const _profileRecoveryType = get(profileRecoveryType)
                if (_profileRecoveryType === ProfileRecoveryType.Seed) {
                    isGettingMigrationData.set(true)
                    await getMigrationData(migrationSeed)
                    isGettingMigrationData.set(false)
                    get(appRouter).next({ profileRecoveryType: _profileRecoveryType })
                } else if (_profileRecoveryType === ProfileRecoveryType.Mnemonic) {
                    mnemonic.set(migrationSeed?.split(' '))
                    nextRoute = ImportRoute.Success
                }
                break
            }
            case ImportRoute.FileImport: {
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
                nextRoute = ImportRoute.BackupPassword
                break
            }
            case ImportRoute.BackupPassword: {
                nextRoute = ImportRoute.Success
                break
            }
            case ImportRoute.LedgerImport: {
                const _profileRecoveryType = params?.profileRecoveryType
                profileRecoveryType.set(_profileRecoveryType)
                get(appRouter).next({ profileRecoveryType: _profileRecoveryType })
                break
            }
            case ImportRoute.Success:
                get(appRouter).next({ profileRecoveryType: get(profileRecoveryType) })
                break
        }

        this.setNext(nextRoute)
    }
}
