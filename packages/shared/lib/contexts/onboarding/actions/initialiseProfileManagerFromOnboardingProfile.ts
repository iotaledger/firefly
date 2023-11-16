import { get } from 'svelte/store'

import {
    buildProfileManagerOptionsFromProfileData,
    initialiseProfileManager,
    profileManager,
} from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { removeProfileFolder } from '@core/profile'

export async function initialiseProfileManagerFromOnboardingProfile(checkForExistingManager?: boolean): Promise<void> {
    const existingManager = get(profileManager)
    if (existingManager) {
        if (!checkForExistingManager) {
            await existingManager.destroy()
            removeProfileFolder(existingManager.id)
        } else {
            return
        }
    }

    const profileManagerOptions = await buildProfileManagerOptionsFromProfileData(get(onboardingProfile))
    const { storagePath, coinType, clientOptions, secretManager } = profileManagerOptions
    const { id } = get(onboardingProfile)
    const manager = await initialiseProfileManager(id, storagePath, coinType, clientOptions, secretManager)
    profileManager.set(manager)
    updateOnboardingProfile({ hasInitialisedProfileManager: true })
}
