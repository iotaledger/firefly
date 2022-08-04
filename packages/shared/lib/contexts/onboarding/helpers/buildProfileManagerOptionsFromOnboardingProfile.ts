import { IOnboardingProfile, ProfileManagerOptions } from '@contexts/onboarding'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { COIN_TYPE, getDefaultClientOptions } from '@core/network'

export async function buildProfileManagerOptionsFromOnboardingProfile(
    onboardingProfile: Partial<IOnboardingProfile>
): Promise<ProfileManagerOptions> {
    const { id, networkProtocol } = onboardingProfile
    const storagePath = await getStorageDirectoryOfProfile(id)
    const coinType = COIN_TYPE[networkProtocol]
    const clientOptions =
        onboardingProfile?.clientOptions ?? getDefaultClientOptions(networkProtocol, onboardingProfile?.networkType)
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
