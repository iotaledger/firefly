import { get } from 'svelte/store'

import { INode } from '@core/network'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { initialiseProfileManager, profileManager } from '@core/profile-manager'

import { newProfile } from '../stores'

import { setNewProfileClientOptions } from './setNewProfileClientOptions'

export async function initProfileManagerFromNewProfile(node?: INode, checkForExistingManager = false): Promise<void> {
    if (checkForExistingManager && get(profileManager)) {
        return
    }

    const profile = get(newProfile)
    await setNewProfileClientOptions(profile.networkProtocol, profile.networkType, node)

    const path = await getStorageDirectoryOfProfile(profile.id)
    initialiseProfileManager(path, get(newProfile).clientOptions, {
        Stronghold: { snapshotPath: `${path}/wallet.stronghold` },
    })
}
