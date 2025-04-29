import { get } from 'svelte/store'

import {
    buildProfileManagerOptionsFromProfileData,
    getSecretManagerFromProfileType,
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
    const { storagePath, coinType, clientOptions } = profileManagerOptions
    const { id, strongholdPassword, type } = get(onboardingProfile)
    const secretManager = getSecretManagerFromProfileType(type, storagePath, strongholdPassword)
    const manager = await initialiseProfileManager(storagePath, coinType, clientOptions, secretManager, id)
    profileManager.set(manager)
    updateOnboardingProfile({ hasInitialisedProfileManager: true })
}
