import { get, writable } from 'svelte/store'

import { mnemonic, strongholdPassword } from '@lib/app'
import { getMigrationData } from '@lib/migration'
import { Platform } from '@lib/platform'
import { newProfile } from '@lib/profile'
import { ImportType } from '@lib/typings/profile'
import { asyncRestoreBackup } from '@lib/wallet'

import { appRouter } from '../app-router'
import { ImportRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'
import { UpdateStrongholdRouter, updateStrongholdRouter } from '@core/router'

export const importRoute = writable<ImportRoute>(null)

export class ImportRouter extends Subrouter<ImportRoute> {
    public isGettingMigrationData = writable(false)
    public importType = writable<ImportType>(null)
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
                if (importType === ImportType.Seed || importType === ImportType.Mnemonic) {
                    nextRoute = ImportRoute.TextImport
                } else if (importType === ImportType.File) {
                    nextRoute = ImportRoute.FileImport
                } else if (importType === ImportType.Ledger) {
                    nextRoute = ImportRoute.LedgerImport
                }
                break
            }
            case ImportRoute.TextImport: {
                const { migrationSeed } = params
                const importType = get(this.importType)
                if (importType === ImportType.Seed) {
                    this.isGettingMigrationData.set(true)
                    await getMigrationData(migrationSeed)
                    this.isGettingMigrationData.set(false)
                    get(appRouter).next({ importType })
                } else if (importType === ImportType.Mnemonic) {
                    mnemonic.set(migrationSeed.split(' '))
                    nextRoute = ImportRoute.Success
                }
                break
            }
            case ImportRoute.FileImport: {
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
                nextRoute = ImportRoute.BackupPassword
                break
            }
            case ImportRoute.BackupPassword: {
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

                        nextRoute = ImportRoute.Success
                    } else {
                        /* eslint-disable no-constant-condition */
                        if (true) {
                            nextRoute = ImportRoute.UpdateStronghold
                            updateStrongholdRouter.set(new UpdateStrongholdRouter(this))
                        } else {
                            await asyncRestoreBackup(this.importFilePath, password)
                            strongholdPassword.set(undefined)
                            get(newProfile).lastStrongholdBackupTime = new Date()
                            nextRoute = ImportRoute.Success
                        }
                    }
                } finally {
                    this.isGettingMigrationData.set(false)
                }
                break
            }
            case ImportRoute.UpdateStronghold:
                // TODO: https://github.com/iotaledger/firefly/issues/6141
                await asyncRestoreBackup(this.importFilePath, get(strongholdPassword))
                strongholdPassword.set(undefined)
                get(newProfile).lastStrongholdBackupTime = new Date()
                get(appRouter).next({ importType: get(this.importType) })
                return
            case ImportRoute.LedgerImport: {
                const { importType } = params
                this.importType.set(importType)
                get(appRouter).next({ importType })
                break
            }
            case ImportRoute.Success:
                get(appRouter).next({ importType: get(this.importType) })
                return
        }
        this.setNext(nextRoute)
    }
}
