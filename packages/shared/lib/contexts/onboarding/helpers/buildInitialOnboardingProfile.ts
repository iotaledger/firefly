import { generateRandomId } from '@core/utils'
import { STRONGHOLD_VERSION } from '@core/stronghold'
import { IOnboardingProfile } from '../interfaces'

/**
 * Builds a blank onboarding profile with only an ID and a boolean flag indicating
 * if it is a developer profile.
 */
export function buildInitialOnboardingProfile(isDeveloperProfile: boolean): Partial<IOnboardingProfile> {
    return {
        id: generateRandomId(),
        isDeveloperProfile,
        strongholdVersion: STRONGHOLD_VERSION,
    }
}
