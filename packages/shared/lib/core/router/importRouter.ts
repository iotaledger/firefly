import { get, writable } from 'svelte/store'
import { appRouter, ImportRoutes } from '@core/router'
import { Router } from '@core/router/router'
import { ImportType } from 'shared/lib/typings/profile'
import { getMigrationData } from 'shared/lib/migration'
import { mnemonic } from 'shared/lib/app'
import { Platform } from 'shared/lib/platform'
import { asyncRestoreBackup } from 'shared/lib/wallet'
import { newProfile } from 'shared/lib/profile'
import { FireflyEvent } from '@core/router/typings/event'

export const importRoute = writable<ImportRoutes>(null)

export class ImportRouter extends Router<ImportRoutes> {
    public importType = writable<ImportType>(null)
    public importFile: Buffer
    public importFilePath: string
    public isGettingMigrationData = false

    constructor() {
        super(ImportRoutes.Init, importRoute)
    }

    async next(event: FireflyEvent): Promise<void> {
        let nextRoute: ImportRoutes
        const params = event || {}

        const currentRoute = get(this.routeStore)
        switch (currentRoute) {
            case ImportRoutes.Init: {
                const { importType } = params
                this.importType.set(importType)
                if (importType === ImportType.Seed || importType === ImportType.Mnemonic) {
                    nextRoute = ImportRoutes.TextImport
                } else if (importType === ImportType.File) {
                    nextRoute = ImportRoutes.FileImport
                } else if (importType === ImportType.Ledger) {
                    nextRoute = ImportRoutes.LedgerImport
                }
                break
            }
            case ImportRoutes.TextImport: {
                const { migrationSeed } = params
                const importType = get(this.importType)
                if (importType === ImportType.Seed) {
                    this.isGettingMigrationData = true
                    await getMigrationData(migrationSeed)
                    get(appRouter).next({ importType })
                    this.isGettingMigrationData = false
                } else if (importType === ImportType.Mnemonic) {
                    mnemonic.set(migrationSeed.split(' '))
                    nextRoute = ImportRoutes.Success
                }
                break
            }
            case ImportRoutes.FileImport: {
                const strongholdRegex = /\.(stronghold)$/i
                const seedvaultRegex = /\.(kdbx)$/i
                const { file, fileName, filePath } = params
                this.importFile = file
                this.importFilePath = filePath

                if (seedvaultRegex.test(fileName)) {
                    this.importType.set(ImportType.SeedVault)
                } else if (strongholdRegex.test(fileName)) {
                    this.importType.set(ImportType.Stronghold)
                }
                nextRoute = ImportRoutes.BackupPassword
                break
            }
            case ImportRoutes.BackupPassword: {
                const { password } = params
                try {
                    if (get(this.importType) === ImportType.SeedVault) {
                        // Instead of using "busy", we are deliberately using "isGettingMigrationData"
                        // We do not want to display the spinner in FileImport if stronghold is being imported.
                        this.isGettingMigrationData = true

                        const legacySeed = await Platform.importLegacySeed(this.importFile, password)

                        if (legacySeed) {
                            await getMigrationData(legacySeed)
                        }
                    } else {
                        await asyncRestoreBackup(this.importFilePath, password)
                        get(newProfile).lastStrongholdBackupTime = new Date()
                    }

                    nextRoute = ImportRoutes.Success
                } finally {
                    this.isGettingMigrationData = false
                }
                break
            }
            case ImportRoutes.LedgerImport: {
                const { importType } = params
                this.importType.set(importType)
                get(appRouter).next({ importType })
                break
            }
            case ImportRoutes.Success:
                get(appRouter).next({ importType: get(this.importType) })
                break
        }
        if (nextRoute) {
            this.setNext(nextRoute)
        }
    }

    previous(): void {
        if (this.history.length === 0) {
            get(appRouter).previous()
        } else {
            super.previous()
        }
    }
}
