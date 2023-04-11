import { getStorageDirectoryOfProfile, IPersistedProfile } from '@core/profile'
import { getSecretManagerFromProfileType, ProfileManagerOptions } from '@core/profile-manager'
import { COIN_TYPE, getDefaultClientOptions, NetworkId } from '@core/network'

export async function buildProfileManagerOptionsFromProfileData(
    profileData: Partial<IPersistedProfile>,
    networkId?: NetworkId,
    chainId?: number
): Promise<ProfileManagerOptions> {
    const { id, type } = profileData
    const storagePath = await getStorageDirectoryOfProfile(id)
    const coinType = COIN_TYPE[networkId] ?? chainId
    const useDefaultClientOptions =
        !profileData?.clientOptions ||
        !profileData?.clientOptions?.nodes ||
        profileData?.clientOptions?.nodes?.length < 1
    const clientOptions = useDefaultClientOptions ? getDefaultClientOptions(networkId) : profileData?.clientOptions
    const secretManager = getSecretManagerFromProfileType(type, storagePath)

    return {
        storagePath,
        coinType,
        clientOptions,
        secretManager,
    }
}
