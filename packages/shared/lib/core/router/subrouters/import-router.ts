import { get, writable } from 'svelte/store'

import { mnemonic } from '@lib/app'
import { getMigrationData } from '@lib/migration'
import { Platform } from '@lib/platform'
import { newProfile } from '@lib/profile'
import { ImportType } from '@lib/typings/profile'
import { asyncRestoreBackup } from '@lib/wallet'

import { appRouter } from '../app-router'
import { ImportRoutes } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'

export const importRoute = writable<ImportRoutes>(null)

export class ImportRouter extends Subrouter<ImportRoutes> {
    public isGettingMigrationData = writable(false)
    public importType = writable<ImportType>(null)
    public importFile: Buffer
    public importFilePath: string

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
                    this.isGettingMigrationData.set(true)
                    await getMigrationData(migrationSeed)
                    this.isGettingMigrationData.set(false)
                    get(appRouter).next({ importType })
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

                if (seedvaultRegex.test(fileName)) {
                    this.importType.set(ImportType.SeedVault)
                } else if (strongholdRegex.test(fileName)) {
                    this.importType.set(ImportType.Stronghold)
                }

                this.importFile = file
                this.importFilePath = filePath
                nextRoute = ImportRoutes.BackupPassword
                break
            }
            case ImportRoutes.BackupPassword: {
                const { password } = params
                try {
                    if (get(this.importType) === ImportType.SeedVault) {
                        // Instead of using "busy", we are deliberately using "isGettingMigrationData"
                        // We do not want to display the spinner in FileImport if stronghold is being imported.
                        this.isGettingMigrationData.set(true)

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
                    this.isGettingMigrationData.set(false)
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
        this.setNext(nextRoute)
    }
}
