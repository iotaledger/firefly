import { IPersistedProfile } from '@core/profile'

import { ProfileProtectionType, ProfileRecoveryType, ProfileSetupType } from '../enums'
import { ImportFile } from '../types'

export interface IOnboardingProfile extends IPersistedProfile {
    setupType: ProfileSetupType
    recoveryType?: ProfileRecoveryType
    protectionType?: ProfileProtectionType
    importFile?: ImportFile
    importFilePath?: string
}
