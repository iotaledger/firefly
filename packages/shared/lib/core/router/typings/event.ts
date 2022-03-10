import { SetupType } from 'shared/lib/typings/setup'
import { ImportType } from 'shared/lib/typings/profile'

export type FireflyEvent = {
    file?: Buffer
    fileName?: string
    filePath?: string
    importType?: ImportType
    migrationSeed?: string
    password?: string
    pin?: number
    protectionType?: string
    reset?: boolean
    setupType?: SetupType
    shouldAddProfile?: boolean
    skip?: boolean
    skippedMining?: boolean
}
