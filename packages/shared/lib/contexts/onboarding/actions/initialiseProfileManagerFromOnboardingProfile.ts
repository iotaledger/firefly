import { get } from 'svelte/store'

import { COIN_TYPE, INode } from '@core/network'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { initialiseProfileManager, profileManager } from '@core/profile-manager'

import { onboardingProfile } from '../stores'
import { setOnboardingProfileClientOptions } from './setOnboardingProfileClientOptions'

export async function initialiseProfileManagerFromOnboardingProfile(
    node?: INode,
    checkForExistingManager?: boolean
): Promise<void> {
    let profile = get(onboardingProfile)
    setOnboardingProfileClientOptions(profile.networkProtocol, profile.networkType, node)
    profile = get(onboardingProfile)

    if (checkForExistingManager && get(profileManager)) {
        return
    }

    const path = await getStorageDirectoryOfProfile(profile.id)
    const coinType = COIN_TYPE[profile.networkProtocol]
    initialiseProfileManager(path, coinType, profile.clientOptions, {
        Stronghold: { snapshotPath: `${path}/wallet.stronghold` },
    })
}
