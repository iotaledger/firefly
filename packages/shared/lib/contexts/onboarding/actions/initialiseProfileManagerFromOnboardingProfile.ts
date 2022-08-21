import { get } from 'svelte/store'

import {
    buildProfileManagerOptionsFromProfileData,
    deleteAccountsAndDatabase,
    initialiseProfileManager,
    profileManager,
} from '@core/profile-manager'

import { onboardingProfile, updateOnboardingProfile } from '../stores'

export async function initialiseProfileManagerFromOnboardingProfile(checkForExistingManager?: boolean): Promise<void> {
    if (get(profileManager)) {
        if (!checkForExistingManager) {
            await deleteAccountsAndDatabase()
            await get(profileManager)?.destroy()
        } else {
            return
        }
    }

    const profileManagerOptions = await buildProfileManagerOptionsFromProfileData(get(onboardingProfile))
    const { storagePath, coinType, clientOptions, secretManager } = profileManagerOptions
    const { id } = get(onboardingProfile)
    const manager = initialiseProfileManager(storagePath, coinType, clientOptions, secretManager, id)
    profileManager.set(manager)
    updateOnboardingProfile({ hasInitialisedProfileManager: true })
}
