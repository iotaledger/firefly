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
        ...(onboardingProfile?.network && { network: onboardingProfile.network }),
        ...(onboardingProfile?.lastStrongholdBackupTime && {
            lastStrongholdBackupTime: onboardingProfile.lastStrongholdBackupTime,
        }),
        ...(onboardingProfile?.settings && { settings: onboardingProfile.settings }),
        ...(onboardingProfile?.strongholdVersion && { strongholdVersion: onboardingProfile.strongholdVersion }),
        ...(onboardingProfile?.accountPersistedData && {
            accountPersistedData: onboardingProfile.accountPersistedData,
        }),
        ...(onboardingProfile?.isDeveloperProfile && { isDeveloperProfile: onboardingProfile.isDeveloperProfile }),
        ...(onboardingProfile?.hasVisitedDashboard && { hasVisitedDashboard: onboardingProfile.hasVisitedDashboard }),
        ...(onboardingProfile?.lastUsedWalletId && {
            lastUsedAccountIndex: onboardingProfile.lastUsedWalletId,
        }),
        ...(onboardingProfile?.clientOptions && { clientOptions: onboardingProfile.clientOptions }),
    }
}
