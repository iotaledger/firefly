import { get } from 'svelte/store'

import { getStorageDirectoryOfProfile } from '@core/profile'
import { activeProfileId, updateActiveProfile } from '@core/profile/stores'
import { api, destroyProfileManager } from '@core/profile-manager'
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

    if (isRecovery) {
        await destroyProfileManager()
        await initialiseProfileManagerFromOnboardingProfile()
    }
}
