import { get } from 'svelte/store'

import { StrongholdVersion } from '@core/stronghold/enums'

import { copyStrongholdFileToProfileDirectory } from '../helpers'
import { onboardingProfile, updateOnboardingProfile } from '../stores'
import { initialiseOnboardingProfileWithSecretManager } from './initialiseOnboardingProfileWithSecretManager'
import { api } from '@core/api'
import { clearProfileFromMemory, DirectoryManager } from '@core/profile'

export async function migrateStrongholdFromOnboardingProfile(password: string): Promise<void> {
    const profile = get(onboardingProfile)

    const strongholdPath = await DirectoryManager.forStronghold(profile?.id)

    await copyStrongholdFileToProfileDirectory(profile?.id, profile?.importFilePath ?? '')
    updateOnboardingProfile({ strongholdPassword: password, importFilePath: strongholdPath })

    if (profile?.strongholdVersion === StrongholdVersion.V2) {
        await api.migrateStrongholdSnapshotV2ToV3(strongholdPath, password, strongholdPath, password)
        updateOnboardingProfile({ strongholdVersion: StrongholdVersion.V3 })
    }

    await clearProfileFromMemory()
    await initialiseOnboardingProfileWithSecretManager()
}
