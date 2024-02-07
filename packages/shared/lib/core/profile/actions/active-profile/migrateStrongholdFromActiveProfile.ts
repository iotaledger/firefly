import { StrongholdVersion } from '@core/stronghold/enums'
import { DirectoryManager } from '@core/profile/classes'
import { getActiveProfile, updateActiveProfile } from '../../stores'
import { api } from '@core/api'

export async function migrateStrongholdFromActiveProfile(password: string): Promise<void> {
    const profile = getActiveProfile()
    const strongholdPath = await DirectoryManager.forStronghold(profile?.id)

    if (!profile.strongholdVersion || profile.strongholdVersion === StrongholdVersion.V2) {
        await api.migrateStrongholdSnapshotV2ToV3(strongholdPath, password, strongholdPath, password)
        updateActiveProfile({ strongholdVersion: StrongholdVersion.V3 })
    }
}
