import { getDefaultClientOptions, TESTNET_COIN_TYPE } from '@core/network'
import { getStorageDirectoryOfProfile, IPersistedProfile } from '@core/profile'
import { getSecretManagerFromProfileType, ProfileManagerOptions } from '@core/profile-manager'

export async function buildProfileManagerOptionsFromPartialPersistedProfile(
    partialPersistedProfile: Partial<IPersistedProfile>
): Promise<ProfileManagerOptions> {
    const { id, type, network } = partialPersistedProfile
    const storagePath = await getStorageDirectoryOfProfile(id)
    const coinType = network?.coinType ?? TESTNET_COIN_TYPE
    const useDefaultClientOptions =
        !partialPersistedProfile?.clientOptions ||
        !partialPersistedProfile?.clientOptions?.nodes ||
        partialPersistedProfile?.clientOptions?.nodes?.length < 1
    const clientOptions = useDefaultClientOptions
        ? getDefaultClientOptions(network?.id)
        : partialPersistedProfile?.clientOptions
    const secretManager = getSecretManagerFromProfileType(type, storagePath)

    return {
        storagePath,
        coinType,
        clientOptions,
        secretManager,
    }
}
