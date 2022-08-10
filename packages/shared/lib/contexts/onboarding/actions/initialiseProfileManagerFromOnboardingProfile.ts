import { get } from 'svelte/store'

import {
    buildProfileManagerOptionsFromProfileData,
    initialiseProfileManager,
    profileManager,
} from '@core/profile-manager'

import { onboardingProfile } from '../stores'

export async function initialiseProfileManagerFromOnboardingProfile(checkForExistingManager?: boolean): Promise<void> {
    if (checkForExistingManager && get(profileManager)) {
        return
    }

    const profileManagerOptions = await buildProfileManagerOptionsFromProfileData(get(onboardingProfile))
    const { storagePath, coinType, clientOptions, secretManager } = profileManagerOptions
    const { id } = get(onboardingProfile)
    const manager = initialiseProfileManager(storagePath, coinType, clientOptions, secretManager, id)
    profileManager.set(manager)
}
