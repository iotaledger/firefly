import { NetworkProtocol } from '@core/network'
import { STRONGHOLD_VERSION } from '@core/stronghold'
import { generateRandomId } from '@core/utils'
import features from '@features/features'

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
        strongholdVersion: features.onboarding.strongholdVersionCheck.enabled ? STRONGHOLD_VERSION : undefined,
        ...(networkProtocol && { networkProtocol }),
    }
}
