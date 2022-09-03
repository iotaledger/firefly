import { NetworkType } from '@core/network'
import { ProfileRecoveryType, ProfileSetupType } from '@contexts/onboarding'

export type FireflyEvent = {
    profileSetupType?: ProfileSetupType
    profileRecoveryType?: ProfileRecoveryType
    file?: Buffer
    fileName?: string
    filePath?: string
    password?: string
    pin?: string
    protectionType?: string
    reset?: boolean
    shouldAddProfile?: boolean
    skip?: boolean
    skippedMining?: boolean
    networkType?: NetworkType
}
