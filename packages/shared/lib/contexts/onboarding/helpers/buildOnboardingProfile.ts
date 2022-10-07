import { NetworkProtocol } from '@core/network'
import { generateRandomId } from '@lib/utils'

import { IOnboardingProfile } from '../interfaces'

/**
 * Builds a blank onboarding profile with only an ID and a boolean flag indicating
 * if it is a developer profile.
 */
export function buildOnboardingProfile(
    isDeveloperProfile: boolean,
    networkProtocol?: NetworkProtocol
): Partial<IOnboardingProfile> {
    return {
        id: generateRandomId(),
        isDeveloperProfile,
        ...(networkProtocol && { networkProtocol }),
    }
}
