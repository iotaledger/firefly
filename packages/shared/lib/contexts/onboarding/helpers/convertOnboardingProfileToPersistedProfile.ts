import { IPersistedProfile } from '@core/profile'
import { DEFAULT_ACTIVE_PROFILE_VALUE } from '@core/profile/constants/default-active-profile-values.constant'

import { IOnboardingProfile } from '../interfaces'

export function convertOnboardingProfileToPersistedProfile(
    onboardingProfile: Partial<IOnboardingProfile>
): IPersistedProfile {
    return {
        ...DEFAULT_ACTIVE_PROFILE_VALUE,
        ...onboardingProfile,
    }
}
