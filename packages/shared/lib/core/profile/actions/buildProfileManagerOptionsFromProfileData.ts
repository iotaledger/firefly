import { getSecretManagerFromProfileType, getStorageDirectoryOfProfile, IPersistedProfile } from '@core/profile'
import { COIN_TYPE, getDefaultClientOptions } from '@core/network'
import { WalletOptions } from '@iota/sdk/out/types'

// TODO(2.0) Fix this and all usages
// - Do we even need this function at all?
export async function buildProfileManagerOptionsFromProfileData(
    profileData: Partial<IPersistedProfile>
): Promise<WalletOptions> {
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
        bipPath: {
            coinType,
        },
        clientOptions,
        secretManager,
    }
}
