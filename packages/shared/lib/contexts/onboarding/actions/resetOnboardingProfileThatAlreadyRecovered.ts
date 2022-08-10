import {
    deleteOnboardingProfile,
    initialiseOnboardingProfile,
    IOnboardingProfile,
    onboardingProfile,
    updateOnboardingProfile,
} from '@contexts/onboarding'
import { get } from 'svelte/store'

export async function resetOnboardingProfileThatAlreadyRecovered(): Promise<void> {
    const onboardingProfileData: Partial<IOnboardingProfile> = { ...get(onboardingProfile) }
    await deleteOnboardingProfile()
    await initialiseOnboardingProfile(onboardingProfileData?.isDeveloperProfile)
    const { id } = get(onboardingProfile)
    updateOnboardingProfile({
        ...onboardingProfileData,
        id,
        type: null,
        recoveryType: null,
        hasRecoveredProfile: false,
    })
}
