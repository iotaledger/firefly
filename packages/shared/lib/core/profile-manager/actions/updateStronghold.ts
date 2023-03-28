import { get } from 'svelte/store'

import { getStorageDirectoryOfProfile } from '@core/profile'
import {
    api,
    buildProfileManagerOptionsFromProfileData,
    destroyProfileManager,
    getSecretManagerPath,
    initialiseProfileManager,
    profileManager,
} from '@core/profile-manager'

import { activeProfile, activeProfileId, updateActiveProfile } from '@core/profile/stores'
import { STRONGHOLD_VERSION } from '@core/stronghold'

import { copyStrongholdFileToProfileDirectory } from '@contexts/onboarding/helpers'
import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding/stores'
import { initialiseProfileManagerFromOnboardingProfile } from '@contexts/onboarding'

export async function updateStronghold(password: string, isRecovery: boolean = false): Promise<void> {
    const profileId = isRecovery ? get(onboardingProfile)?.id : get(activeProfileId)
    const profileDirectory = await getStorageDirectoryOfProfile(profileId)
    const secretManagerPath = getSecretManagerPath(profileDirectory)

    if (isRecovery) {
        const { importFilePath } = get(onboardingProfile) ?? {}
        await copyStrongholdFileToProfileDirectory(profileDirectory, importFilePath)
        updateOnboardingProfile({ importFilePath: secretManagerPath, importFile: null })
    }

    await api.migrateStrongholdSnapshotV2ToV3(secretManagerPath, password, secretManagerPath, password)
    const updateProfile = isRecovery ? updateOnboardingProfile : updateActiveProfile
    updateProfile({ strongholdVersion: STRONGHOLD_VERSION })

    // TODO: This was a try to fix the XCHACHA20-POLY1305 issue by reseting profile manager, but it doesn't work. After the error is fixed in backend side, check if this code is needed.
    get(profileManager) && (await destroyProfileManager())
    if (isRecovery) {
        await initialiseProfileManagerFromOnboardingProfile()
    } else {
        const profileManagerOptions = await buildProfileManagerOptionsFromProfileData(get(activeProfile))
        const { storagePath, coinType, clientOptions, secretManager } = profileManagerOptions
        updateActiveProfile({ clientOptions })
        const manager = await initialiseProfileManager(
            storagePath,
            coinType,
            clientOptions,
            secretManager,
            get(activeProfileId)
        )
        profileManager.set(manager)
    }
}
