import { IPersistedProfile } from '@core/profile/interfaces'
import { DEFAULT_PERSISTED_PROFILE_OBJECT } from '@core/profile/constants'

import { IOnboardingProfile } from '../interfaces'

export function convertOnboardingProfileToPersistedProfile(
    onboardingProfile: Partial<IOnboardingProfile>
): IPersistedProfile {
    return {
        ...DEFAULT_PERSISTED_PROFILE_OBJECT,
        ...(onboardingProfile?.id && { id: onboardingProfile.id }),
        ...(onboardingProfile?.name && { name: onboardingProfile.name }),
        ...(onboardingProfile?.type && { type: onboardingProfile.type }),
        ...(onboardingProfile?.networkProtocol && { networkProtocol: onboardingProfile.networkProtocol }),
        ...(onboardingProfile?.networkType && { networkType: onboardingProfile.networkType }),
        ...(onboardingProfile?.lastStrongholdBackupTime && {
            lastStrongholdBackupTime: onboardingProfile.lastStrongholdBackupTime,
        }),
        ...(onboardingProfile?.settings && { settings: onboardingProfile.settings }),
        ...(onboardingProfile?.accountMetadata && { accountMetadata: onboardingProfile.accountMetadata }),
        ...(onboardingProfile?.isDeveloperProfile && { isDeveloperProfile: onboardingProfile.isDeveloperProfile }),
        ...(onboardingProfile?.hasVisitedDashboard && { hasVisitedDashboard: onboardingProfile.hasVisitedDashboard }),
        ...(onboardingProfile?.lastUsedAccountIndex && {
            lastUsedAccountIndex: onboardingProfile.lastUsedAccountIndex,
        }),
        ...(onboardingProfile?.clientOptions && { clientOptions: onboardingProfile.clientOptions }),
    }
}
