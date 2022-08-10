import {
    deleteOnboardingProfile,
    initialiseOnboardingProfile,
    IOnboardingProfile,
    onboardingProfile,
    updateOnboardingProfile,
} from '@contexts/onboarding'
import { get } from 'svelte/store'

export async function resetOnboardingProfileWithProfileManager(): Promise<void> {
    if (!get(onboardingProfile)?.hasInitialisedProfileManager) {
        return
    } else {
        const onboardingProfileData: Partial<IOnboardingProfile> = { ...get(onboardingProfile) }
        await deleteOnboardingProfile()
        await initialiseOnboardingProfile(onboardingProfileData?.isDeveloperProfile)
        const { id } = get(onboardingProfile)
        updateOnboardingProfile({
            ...onboardingProfileData,
            id,
            type: null,
            recoveryType: null,
            hasInitialisedProfileManager: false,
        })
    }
}
