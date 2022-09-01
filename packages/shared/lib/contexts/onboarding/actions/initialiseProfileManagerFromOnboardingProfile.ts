import { get } from 'svelte/store'

import {
    buildProfileManagerOptionsFromProfileData,
    initialiseProfileManager,
    profileManager,
} from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { cleanupOnboardingProfileManager } from '@contexts/onboarding/actions/cleanupOnboardingProfileManager'

export async function initialiseProfileManagerFromOnboardingProfile(): Promise<void> {
    // Always start with a clean profile manager
    await cleanupOnboardingProfileManager()

    const profileManagerOptions = await buildProfileManagerOptionsFromProfileData(get(onboardingProfile))
    const { storagePath, coinType, clientOptions, secretManager } = profileManagerOptions
    const manager = initialiseProfileManager(storagePath, coinType, clientOptions, secretManager)
    profileManager.set(manager)

    updateOnboardingProfile({ hasInitialisedProfileManager: true })
}
