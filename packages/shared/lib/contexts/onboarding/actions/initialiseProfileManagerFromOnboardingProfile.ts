import { get } from 'svelte/store'

import { AccountManagerOptions } from '@iota/wallet'

import { COIN_TYPE, getDefaultClientOptions } from '@core/network'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { initialiseProfileManager, profileManager } from '@core/profile-manager'

import { onboardingProfile } from '../stores'

export async function initialiseProfileManagerFromOnboardingProfile(checkForExistingManager?: boolean): Promise<void> {
    if (checkForExistingManager && get(profileManager)) {
        return
    }

    const { storagePath, coinType, clientOptions, secretManager } =
        await createAccountManagerOptionsFromOnboardingProfile()
    initialiseProfileManager(storagePath, coinType, clientOptions, secretManager)
}

async function createAccountManagerOptionsFromOnboardingProfile(): Promise<AccountManagerOptions> {
    const _onboardingProfile = get(onboardingProfile)
    const { id, networkProtocol } = _onboardingProfile
    const storagePath = await getStorageDirectoryOfProfile(id)
    const coinType = COIN_TYPE[networkProtocol]
    const clientOptions =
        _onboardingProfile?.clientOptions ?? getDefaultClientOptions(networkProtocol, _onboardingProfile?.networkType)
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
