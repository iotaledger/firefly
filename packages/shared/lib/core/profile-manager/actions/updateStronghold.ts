import { get } from 'svelte/store'

import { getStorageDirectoryOfProfile } from '@core/profile'
import { activeProfile, activeProfileId, updateActiveProfile } from '@core/profile/stores'
import { api, buildProfileManagerOptionsFromProfileData, destroyProfileManager } from '@core/profile-manager'
import { initialiseProfileManager } from '@core/profile-manager/actions'
import { profileManager } from '@core/profile-manager/stores'
import { getSecretManagerPath } from '@core/profile-manager/utils'
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
