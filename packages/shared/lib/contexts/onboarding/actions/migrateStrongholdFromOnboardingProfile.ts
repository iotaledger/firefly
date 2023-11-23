import { get } from 'svelte/store'

import { getStorageDirectoryOfProfile } from '@core/profile/utils'
import { clearProfileFromMemory } from '@core/profile-manager/actions'
import { api } from '@core/profile-manager/api'
import { getSecretManagerPath } from '@core/profile-manager/utils'
import { StrongholdVersion } from '@core/stronghold/enums'

import { copyStrongholdFileToProfileDirectory } from '../helpers'
import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { initialiseProfileManagerFromOnboardingProfile } from './initialiseProfileManagerFromOnboardingProfile'

export async function migrateStrongholdFromOnboardingProfile(password: string): Promise<void> {
    const profile = get(onboardingProfile)
    const profileDirectory = await getStorageDirectoryOfProfile(profile?.id)
    const secretManagerPath = getSecretManagerPath(profileDirectory)

    await copyStrongholdFileToProfileDirectory(profileDirectory, profile?.importFilePath ?? '')
    updateOnboardingProfile({ strongholdPassword: password, importFilePath: secretManagerPath, importFile: null })

    if (profile?.strongholdVersion === StrongholdVersion.V2) {
        await api.migrateStrongholdSnapshotV2ToV3(secretManagerPath, password, secretManagerPath, password)
        updateOnboardingProfile({ strongholdVersion: StrongholdVersion.V3 })
    }

    await clearProfileFromMemory()
    await initialiseProfileManagerFromOnboardingProfile()
}
