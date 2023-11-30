import { get } from 'svelte/store'

import { getSecretManagerPath, getStorageDirectoryOfProfile } from '@core/profile/utils'
import { StrongholdVersion } from '@core/stronghold/enums'

import { copyStrongholdFileToProfileDirectory } from '../helpers'
import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { initialiseOnboardingProfileWithSeretManager } from './initialiseProfileManagerFromOnboardingProfile'
import { api } from '@core/api'
import { clearProfileFromMemory } from '@core/profile'

export async function migrateStrongholdFromOnboardingProfile(password: string): Promise<void> {
    const profile = get(onboardingProfile)
    const profileDirectory = await getStorageDirectoryOfProfile(profile?.id)
    // TODO(2.0) Update getSecretManagerPath
    const secretManagerPath = getSecretManagerPath(profileDirectory)

    await copyStrongholdFileToProfileDirectory(profileDirectory, profile?.importFilePath ?? '')
    updateOnboardingProfile({ strongholdPassword: password, importFilePath: secretManagerPath, importFile: null })

    if (profile?.strongholdVersion === StrongholdVersion.V2) {
        await api.migrateStrongholdSnapshotV2ToV3(secretManagerPath, password, secretManagerPath, password)
        updateOnboardingProfile({ strongholdVersion: StrongholdVersion.V3 })
    }

    await clearProfileFromMemory()
    await initialiseOnboardingProfileWithSeretManager()
}
