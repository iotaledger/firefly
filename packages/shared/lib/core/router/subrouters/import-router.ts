import { get, writable } from 'svelte/store'

import { mnemonic, strongholdPassword } from '@lib/app'
import { getMigrationData } from '@lib/migration'
import { Platform } from '@lib/platform'
import { ImportType } from '@lib/typings/profile'
import { importFilePath } from '@lib/stronghold'
import { asyncRestoreBackup } from '@lib/wallet'

import { appRouter } from '../app-router'
import { ImportRoute } from '../enums'
import { Subrouter } from './subrouter'
import { FireflyEvent } from '../types'
import { UpdateStrongholdRouter, updateStrongholdRouter } from './update-stronghold-router'
import { getErrorMessage } from '@lib/shell/walletErrors'
import { ErrorType } from '@lib/typings/events'

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
                importFilePath.set(filePath)

                try {
                    await asyncRestoreBackup(this.importFilePath, '')
                    nextRoute = ImportRoute.BackupPassword
                } catch (err) {
                    if (err?.error?.match(getErrorMessage(ErrorType.OutdatedStrongholdVersion))) {
                        nextRoute = ImportRoute.UpdateStronghold
                        updateStrongholdRouter.set(new UpdateStrongholdRouter(this))
                    } else {
                        nextRoute = ImportRoute.BackupPassword
                    }
                }

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
                        await asyncRestoreBackup(this.importFilePath, password)
                        nextRoute = ImportRoute.Success
                    }
                } finally {
                    this.isGettingMigrationData.set(false)
                }
                break
            }
            case ImportRoute.UpdateStronghold:
                strongholdPassword.set(undefined)
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
