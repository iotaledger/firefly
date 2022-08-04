import { get } from 'svelte/store'

import { initialiseProfileManager, profileManager } from '@core/profile-manager'

import { buildProfileManagerOptionsFromOnboardingProfile } from '../helpers'
import { onboardingProfile } from '../stores'

export async function initialiseProfileManagerFromOnboardingProfile(checkForExistingManager?: boolean): Promise<void> {
    if (checkForExistingManager && get(profileManager)) {
        return
    }

    const { storagePath, coinType, clientOptions, secretManager } =
        await buildProfileManagerOptionsFromOnboardingProfile(get(onboardingProfile))
    const manager = initialiseProfileManager(storagePath, coinType, clientOptions, secretManager)
    profileManager.set(manager)
}
