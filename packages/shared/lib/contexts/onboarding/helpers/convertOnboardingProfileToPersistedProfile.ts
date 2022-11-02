import { IPersistedProfile } from '@core/profile/interfaces'
import { DEFAULT_PERSISTED_PROFILE_OBJECT } from '@core/profile/constants'

import { IOnboardingProfile } from '../interfaces'
import { sanitizeOnboardingProfile } from './sanitizeOnboardingProfile'

export function convertOnboardingProfileToPersistedProfile(
    onboardingProfile: Partial<IOnboardingProfile>
): IPersistedProfile {
    return {
        ...DEFAULT_PERSISTED_PROFILE_OBJECT,
        ...sanitizeOnboardingProfile(onboardingProfile),
    }
}
