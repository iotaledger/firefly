import {
    deleteOnboardingProfile,
    initialiseOnboardingProfile,
    onboardingProfile,
    updateOnboardingProfile,
} from '@contexts/onboarding'
import { get } from 'svelte/store'

export async function resetOnboardingProfile(): Promise<void> {
    const onboardingProfileData = get(onboardingProfile)
    await deleteOnboardingProfile()
    await initialiseOnboardingProfile(onboardingProfileData?.isDeveloperProfile)
    const { id } = get(onboardingProfile)
    updateOnboardingProfile({ id, ...onboardingProfileData })
}
