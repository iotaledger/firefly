import { get } from 'svelte/store'

import { getStorageDirectoryOfProfile } from '@core/profile'
import { getSecretManagerPath, migrateStrongholdSnapshotV2ToV3 } from '@core/profile-manager'

import { updateOnboardingProfile } from '@contexts/onboarding/stores'
import { activeProfileId, updateActiveProfile } from '@core/profile/stores'
import { STRONGHOLD_VERSION } from '@core/stronghold'

export async function updateStronghold(password: string, isRecovery: boolean = false): Promise<void> {
    const activeProfileStorageDirectory = await getStorageDirectoryOfProfile(get(activeProfileId))
    const strongholdDestination = getSecretManagerPath(activeProfileStorageDirectory)
    await migrateStrongholdSnapshotV2ToV3(strongholdDestination, password, strongholdDestination, password)
    if (isRecovery) {
        updateOnboardingProfile({ strongholdVersion: STRONGHOLD_VERSION })
    } else {
        updateActiveProfile({ strongholdVersion: STRONGHOLD_VERSION })
    }
}
