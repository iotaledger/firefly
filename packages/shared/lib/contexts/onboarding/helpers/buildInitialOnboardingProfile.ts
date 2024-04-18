import { generateRandomId } from '@core/utils'
import { IOnboardingProfile } from '../interfaces'

/**
 * Builds a blank onboarding profile with only an ID and a boolean flag indicating
 * if it is a developer profile.
 */
export function buildInitialOnboardingProfile(isDeveloperProfile: boolean): IOnboardingProfile {
    return {
        id: generateRandomId(),
        isDeveloperProfile,
    }
}
