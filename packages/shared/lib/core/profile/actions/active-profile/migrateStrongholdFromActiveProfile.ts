import { get } from 'svelte/store'

import { api } from '@core/profile-manager/api'
import { getSecretManagerPath } from '@core/profile-manager/utils'
import { StrongholdVersion } from '@core/stronghold/enums'

import { getStorageDirectoryOfProfile } from '../../utils'
import { activeProfile, updateActiveProfile } from '../../stores'

export async function migrateStrongholdFromActiveProfile(password: string): Promise<void> {
    const profile = get(activeProfile)
    const profileDirectory = await getStorageDirectoryOfProfile(profile?.id)
    const secretManagerPath = getSecretManagerPath(profileDirectory)

    if (!profile.strongholdVersion || profile.strongholdVersion === StrongholdVersion.V2) {
        await api.migrateStrongholdSnapshotV2ToV3(secretManagerPath, password, secretManagerPath, password)
        updateActiveProfile({ strongholdVersion: StrongholdVersion.V3 })
    }
}
