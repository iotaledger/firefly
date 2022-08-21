import { COIN_TYPE, getDefaultClientOptions } from '@core/network'
import { getStorageDirectoryOfProfile, IPersistedProfile } from '@core/profile'
import { getSecretManagerPath, ProfileManagerOptions } from '@core/profile-manager'

export async function buildProfileManagerOptionsFromProfileData(
    profileData: Partial<IPersistedProfile>
): Promise<ProfileManagerOptions> {
    const { id, networkProtocol } = profileData
    const storagePath = await getStorageDirectoryOfProfile(id)
    const coinType = COIN_TYPE[networkProtocol]
    const useDefaultClientOptions = !profileData.clientOptions || profileData?.clientOptions?.nodes?.length < 1
    const clientOptions = useDefaultClientOptions
        ? getDefaultClientOptions(networkProtocol, profileData?.networkType)
        : profileData?.clientOptions
    const secretManager = {
        Stronghold: { snapshotPath: getSecretManagerPath(storagePath) },
    }

    return {
        storagePath,
        coinType,
        clientOptions,
        secretManager,
    }
}
