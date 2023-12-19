import { StrongholdVersion } from '@core/stronghold/enums'
import { getSecretManagerPath, getStorageDirectoryOfProfile } from '../../utils'
import { getActiveProfile, updateActiveProfile } from '../../stores'
import { api } from '@core/api'

export async function migrateStrongholdFromActiveProfile(password: string): Promise<void> {
    const profile = getActiveProfile()
    const profileDirectory = await getStorageDirectoryOfProfile(profile?.id)
    const secretManagerPath = getSecretManagerPath(profileDirectory)

    if (!profile.strongholdVersion || profile.strongholdVersion === StrongholdVersion.V2) {
        await api.migrateStrongholdSnapshotV2ToV3(secretManagerPath, password, secretManagerPath, password)
        updateActiveProfile({ strongholdVersion: StrongholdVersion.V3 })
    }
}
