import { ImportType } from '@lib/typings/profile'
import { SetupType } from '@lib/typings/setup'

export type FireflyEvent = {
    file?: Buffer
    fileName?: string
    filePath?: string
    importType?: ImportType
    migrationSeed?: string
    password?: string
    pin?: string
    protectionType?: string
    reset?: boolean
    setupType?: SetupType
    shouldAddProfile?: boolean
    skip?: boolean
    skippedMining?: boolean
    isRecovery?: boolean
}
