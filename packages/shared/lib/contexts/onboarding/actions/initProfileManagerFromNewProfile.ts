import { get } from 'svelte/store'

import { COIN_TYPE, INode } from '@core/network'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { initialiseProfileManager, profileManager } from '@core/profile-manager'

import { newProfile } from '../stores'
import { setNewProfileClientOptions } from './setNewProfileClientOptions'

export async function initProfileManagerFromNewProfile(node?: INode, checkForExistingManager?: boolean): Promise<void> {
    let profile = get(newProfile)
    setNewProfileClientOptions(profile.networkProtocol, profile.networkType, node)
    profile = get(newProfile)

    if (checkForExistingManager && get(profileManager)) {
        return
    }

    const path = await getStorageDirectoryOfProfile(profile.id)
    const coinType = COIN_TYPE[profile.networkProtocol]
    initialiseProfileManager(path, coinType, profile.clientOptions, {
        Stronghold: { snapshotPath: `${path}/wallet.stronghold` },
    })
}
