import { getStorageDirectoryOfProfile, IPersistedProfile } from '@core/profile'
import { ProfileManagerOptions } from '@core/profile-manager'
import { COIN_TYPE, getDefaultClientOptions } from '@core/network'

export async function buildProfileManagerOptionsFromProfileData(
    profileData: Partial<IPersistedProfile>
): Promise<ProfileManagerOptions> {
    const { id, networkProtocol } = profileData
    const storagePath = await getStorageDirectoryOfProfile(id)
    const coinType = COIN_TYPE[networkProtocol]
    const clientOptions =
        profileData?.clientOptions ?? getDefaultClientOptions(networkProtocol, profileData?.networkType)
    const secretManager = {
        Stronghold: { snapshotPath: `${storagePath}/wallet.stronghold` },
    }

    return {
        storagePath,
        coinType,
        clientOptions,
        secretManager,
    }
}
