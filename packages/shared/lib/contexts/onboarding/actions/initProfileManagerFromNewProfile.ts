import { get } from 'svelte/store'

import { COIN_TYPE, INode } from '@core/network'
import { getStorageDirectoryOfProfile, ProfileType } from '@core/profile'
import { initialiseProfileManager, profileManager } from '@core/profile-manager'

import { newProfile } from '../stores'
import { setNewProfileClientOptions } from './setNewProfileClientOptions'

export async function initProfileManagerFromNewProfile(node?: INode, checkForExistingManager?: boolean): Promise<void> {
    let profile = get(newProfile)
    setNewProfileClientOptions(node)
    profile = get(newProfile)

    if (checkForExistingManager && get(profileManager)) {
        return
    }

    const path = await getStorageDirectoryOfProfile(profile.id)
    const coinType = COIN_TYPE[profile.networkProtocol]

    const secretManager =
        profile.type === ProfileType.Ledger
            ? {
                  // TODO: Use a global constant for this. This boolean determines if wallet-rs should look for simulator or device
                  LedgerNano: true,
              }
            : {
                  Stronghold: { snapshotPath: `${path}/wallet.stronghold` },
              }

    initialiseProfileManager(path, coinType, profile.clientOptions, secretManager)
}
