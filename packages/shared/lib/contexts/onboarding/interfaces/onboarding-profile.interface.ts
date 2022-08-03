import { IPersistedProfile } from '@core/profile'

import { ProfileProtectionType, ProfileRecoveryType, ProfileSetupType } from '../enums'

export interface IOnboardingProfile extends IPersistedProfile {
    setupType: ProfileSetupType
    recoveryType?: ProfileRecoveryType
    protectionType?: ProfileProtectionType
}
