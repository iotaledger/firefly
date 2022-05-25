import { NetworkProtocol, NetworkType } from '@core/network'
import { ProfileImportType } from '@core/profile'
import { SetupType } from '@lib/typings/setup'

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
    networkProtocol?: NetworkProtocol
    networkType?: NetworkType
}
