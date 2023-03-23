import { get } from 'svelte/store'

import { getStorageDirectoryOfProfile } from '@core/profile'
import { api, getSecretManagerPath } from '@core/profile-manager'

import { activeProfileId, updateActiveProfile } from '@core/profile/stores'
import { STRONGHOLD_VERSION } from '@core/stronghold'

import { getTemporaryProfileManagerStorageDirectory } from '@contexts/onboarding/helpers'
import { updateOnboardingProfile } from '@contexts/onboarding/stores'

export async function updateStronghold(password: string, isRecovery: boolean = false): Promise<void> {
    const storageDirectory = isRecovery
        ? await getTemporaryProfileManagerStorageDirectory()
        : await getStorageDirectoryOfProfile(get(activeProfileId))
    const strongholdDestination = getSecretManagerPath(storageDirectory)
    await api.migrateStrongholdSnapshotV2ToV3(strongholdDestination, password, strongholdDestination, password)
    const updateProfile = isRecovery ? updateOnboardingProfile : updateActiveProfile
    updateProfile({ strongholdVersion: STRONGHOLD_VERSION })
}
