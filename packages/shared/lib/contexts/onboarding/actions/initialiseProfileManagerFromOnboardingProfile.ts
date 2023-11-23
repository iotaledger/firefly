import { get } from 'svelte/store'

import {
    getSecretManagerFromProfileType
} from '@core/profile-manager'
import { onboardingProfileSecretManager } from '../stores'

import { getStorageDirectoryOfProfile, removeProfileFolder } from '@core/profile'
import { onboardingProfile, updateOnboardingProfile } from '../stores'

export async function initialiseProfileManagerFromOnboardingProfile(checkForExistingSecretManager?: boolean): Promise<void> {
    const secretManager = get(onboardingProfileSecretManager)
    const activeOnboardingProfile = get(onboardingProfile)

    if (!activeOnboardingProfile) {
        return
    }

    if (secretManager) {
        if (!checkForExistingSecretManager) {
            removeProfileFolder(activeOnboardingProfile.id)
        } else {
            return
        }
    }

    const storagePath = await getStorageDirectoryOfProfile(activeOnboardingProfile.id)

    const secretManagerOptions = getSecretManagerFromProfileType(activeOnboardingProfile.type, storagePath)

    updateOnboardingProfile({ secretManagerOptions, hasInitialisedProfileManager: true })
}
