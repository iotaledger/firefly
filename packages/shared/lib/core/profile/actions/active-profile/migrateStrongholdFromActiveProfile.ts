import { StrongholdVersion } from '@core/stronghold/enums'
import { DirectoryManager } from '@core/profile/classes'
import { getActiveProfile, updateActiveProfile } from '../../stores'
import { api } from '@core/api'

export async function migrateStrongholdFromActiveProfile(password: string): Promise<void> {
    const profile = getActiveProfile()
    const secretManagerPath = await DirectoryManager.forSecretManager(profile?.id)

    if (!profile.strongholdVersion || profile.strongholdVersion === StrongholdVersion.V2) {
        await api.migrateStrongholdSnapshotV2ToV3(secretManagerPath, password, secretManagerPath, password)
        updateActiveProfile({ strongholdVersion: StrongholdVersion.V3 })
    }
}
