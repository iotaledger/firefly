import { ProfileImportType } from '@core/profile'
import { SetupType } from '@lib/typings/setup'
import { NetworkType } from '@core/network'

export type FireflyEvent = {
    file?: Buffer
    fileName?: string
    filePath?: string
    importType?: ProfileImportType
    migrationSeed?: string
    password?: string
    pin?: string
    protectionType?: string
    reset?: boolean
    setupType?: SetupType
    shouldAddProfile?: boolean
    skip?: boolean
    skippedMining?: boolean
    networkType?: NetworkType
}
