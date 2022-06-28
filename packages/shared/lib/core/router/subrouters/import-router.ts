import {
    importFilePath,
    importType as profileImportType,
    isGettingMigrationData,
    mnemonic,
    newProfile,
} from '@contexts/onboarding'
import { NetworkProtocol } from '@core/network'
import { ProfileImportType } from '@core/profile'
import { get, writable } from 'svelte/store'
import { appRouter } from '../app-router'
import { ImportRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const importRoute = writable<ImportRoute>(null)

export class ImportRouter extends Subrouter<ImportRoute> {
    public importFile: Buffer

    constructor() {
        super(ImportRoute.Init, importRoute)
    }

    next(event: FireflyEvent): void {
        let nextRoute: ImportRoute
        const params = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ImportRoute.Init: {
                const { importType } = params
                profileImportType.set(importType)
                if (importType === ProfileImportType.Seed || importType === ProfileImportType.Mnemonic) {
                    nextRoute = ImportRoute.TextImport
                } else if (importType === ProfileImportType.File) {
                    nextRoute = ImportRoute.FileImport
                } else if (importType === ProfileImportType.Ledger) {
                    if (get(newProfile)?.networkProtocol === NetworkProtocol.Shimmer) {
                        profileImportType.set(ProfileImportType.FireflyLedger)
                        get(appRouter).next({ importType: ProfileImportType.FireflyLedger })
                        break
                    }
                    nextRoute = ImportRoute.LedgerImport
                }
                break
            }
            case ImportRoute.TextImport: {
                const { migrationSeed } = params
                const importType = get(profileImportType)
                if (importType === ProfileImportType.Seed) {
                    isGettingMigrationData.set(true)
                    // await getMigrationData(migrationSeed)
                    isGettingMigrationData.set(false)
                    get(appRouter).next({ importType })
                } else if (importType === ProfileImportType.Mnemonic) {
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
                    profileImportType.set(ProfileImportType.SeedVault)
                } else if (strongholdRegex.test(fileName)) {
                    profileImportType.set(ProfileImportType.Stronghold)
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
                const { importType } = params
                profileImportType.set(importType)
                get(appRouter).next({ importType })
                break
            }
            case ImportRoute.Success:
                get(appRouter).next({ importType: get(profileImportType) })
                break
        }
        this.setNext(nextRoute)
    }
}
