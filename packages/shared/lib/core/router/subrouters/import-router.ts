import { newProfile, ProfileImportType } from '@core/profile'
import { restoreBackup } from '@core/profile-manager'
import { mnemonic } from '@contexts/onboarding'
import { getMigrationData } from '@lib/migration'
import { Platform } from '@lib/platform'
import { get, writable } from 'svelte/store'
import { appRouter } from '../app-router'
import { ImportRoute } from '../enums'
import { FireflyEvent } from '../types'
import { Subrouter } from './subrouter'

export const importRoute = writable<ImportRoute>(null)

export class ImportRouter extends Subrouter<ImportRoute> {
    public isGettingMigrationData = writable(false)
    public importType = writable<ProfileImportType>(null)
    public importFile: Buffer
    public importFilePath: string

    constructor() {
        super(ImportRoute.Init, importRoute)
    }

    async next(event: FireflyEvent): Promise<void> {
        let nextRoute: ImportRoute
        const params = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ImportRoute.Init: {
                const { importType } = params
                this.importType.set(importType)
                if (importType === ProfileImportType.Seed || importType === ProfileImportType.Mnemonic) {
                    nextRoute = ImportRoute.TextImport
                } else if (importType === ProfileImportType.File) {
                    nextRoute = ImportRoute.FileImport
                } else if (importType === ProfileImportType.Ledger) {
                    nextRoute = ImportRoute.LedgerImport
                }
                break
            }
            case ImportRoute.TextImport: {
                const { migrationSeed } = params
                const importType = get(this.importType)
                if (importType === ProfileImportType.Seed) {
                    this.isGettingMigrationData.set(true)
                    await getMigrationData(migrationSeed)
                    this.isGettingMigrationData.set(false)
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
                    this.importType.set(ProfileImportType.SeedVault)
                } else if (strongholdRegex.test(fileName)) {
                    this.importType.set(ProfileImportType.Stronghold)
                }

                this.importFile = file
                this.importFilePath = filePath
                nextRoute = ImportRoute.BackupPassword
                break
            }
            case ImportRoute.BackupPassword: {
                const { password } = params
                try {
                    if (get(this.importType) === ProfileImportType.SeedVault) {
                        // Instead of using "busy", we are deliberately using "isGettingMigrationData"
                        // We do not want to display the spinner in FileImport if stronghold is being imported.
                        this.isGettingMigrationData.set(true)

                        const legacySeed = await Platform.importLegacySeed(this.importFile, password)

                        if (legacySeed) {
                            await getMigrationData(legacySeed)
                        }
                    } else {
                        await restoreBackup(this.importFilePath, password)
                        get(newProfile).lastStrongholdBackupTime = new Date()
                    }

                    nextRoute = ImportRoute.Success
                } catch (err) {
                    console.error(err)
                }
                this.isGettingMigrationData.set(false)
                break
            }
            case ImportRoute.LedgerImport: {
                const { importType } = params
                this.importType.set(importType)
                get(appRouter).next({ importType })
                break
            }
            case ImportRoute.Success:
                get(appRouter).next({ importType: get(this.importType) })
                break
        }
        this.setNext(nextRoute)
    }
}
