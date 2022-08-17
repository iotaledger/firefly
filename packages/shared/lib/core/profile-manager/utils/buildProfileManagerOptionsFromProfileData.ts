import { getStorageDirectoryOfProfile, IPersistedProfile, ProfileType } from '@core/profile'
import { ProfileManagerOptions } from '@core/profile-manager'
import { COIN_TYPE, getDefaultClientOptions } from '@core/network'
import { USE_LEDGER_SIMULATOR } from '@lib/core/ledger'

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

    const secretManager =
        type === ProfileType.Ledger
            ? {
                  LedgerNano: USE_LEDGER_SIMULATOR,
              }
            : {
                  Stronghold: { snapshotPath: `${storagePath}/wallet.stronghold` },
              }

    return {
        storagePath,
        coinType,
        clientOptions,
        secretManager,
    }
}
