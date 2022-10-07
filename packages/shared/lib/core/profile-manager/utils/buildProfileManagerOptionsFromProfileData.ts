import { getStorageDirectoryOfProfile, IPersistedProfile } from '@core/profile'
import { getSecretManagerFromProfileType, ProfileManagerOptions } from '@core/profile-manager'
import { COIN_TYPE, getDefaultClientOptions } from '@core/network'

export async function buildProfileManagerOptionsFromProfileData(
    profileData: Partial<IPersistedProfile>
): Promise<ProfileManagerOptions> {
    const { id, networkProtocol, type } = profileData
    const storagePath = await getStorageDirectoryOfProfile(id)
    const coinType = COIN_TYPE[networkProtocol]
    const useDefaultClientOptions = !profileData.clientOptions || profileData?.clientOptions?.nodes?.length < 1
    const clientOptions = useDefaultClientOptions
        ? getDefaultClientOptions(networkProtocol, profileData?.networkType)
        : profileData?.clientOptions
    const secretManager = getSecretManagerFromProfileType(type, storagePath)

    return {
        storagePath,
        coinType,
        clientOptions,
        secretManager,
    }
}
