import { getStorageDirectoryOfProfile, IPersistedProfile } from '@core/profile'
import { getSecretManagerFromProfileType, ProfileManagerOptions } from '@core/profile-manager'
import { COIN_TYPE, getDefaultClientOptions } from '@core/network'

export async function buildProfileManagerOptionsFromProfileData(
    profileData: Partial<IPersistedProfile>
): Promise<ProfileManagerOptions> {
    const { id, type, network } = profileData
    const storagePath = await getStorageDirectoryOfProfile(id)
    const coinType = network?.coinType ? network?.coinType : network ? COIN_TYPE[network?.id] ?? 1 : 1
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
