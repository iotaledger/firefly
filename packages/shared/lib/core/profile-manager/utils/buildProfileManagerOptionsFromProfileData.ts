import { getStorageDirectoryOfProfile, IPersistedProfile } from '@core/profile'
import { getSecretManagerFromProfileType, ProfileManagerOptions } from '@core/profile-manager'
import { COIN_TYPE, getDefaultClientOptions, NetworkProtocol } from '@core/network'

export async function buildProfileManagerOptionsFromProfileData(
    profileData: Partial<IPersistedProfile>
): Promise<ProfileManagerOptions> {
    const { id, type, network } = profileData
    const storagePath = await getStorageDirectoryOfProfile(id)
    const coinType = COIN_TYPE[NetworkProtocol.Shimmer]
    const useDefaultClientOptions =
        !profileData?.clientOptions ||
        !profileData?.clientOptions?.nodes ||
        profileData?.clientOptions?.nodes?.length < 1
    const clientOptions = useDefaultClientOptions ? getDefaultClientOptions(network.id) : profileData?.clientOptions
    const secretManager = getSecretManagerFromProfileType(type, storagePath)

    return {
        storagePath,
        coinType,
        clientOptions,
        secretManager,
    }
}
