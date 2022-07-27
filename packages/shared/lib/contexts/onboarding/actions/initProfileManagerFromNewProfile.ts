import { COIN_TYPE, INode } from '@core/network'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { setNewProfileClientOptions, newProfile } from '@contexts/onboarding'
import { initialiseProfileManager } from '@core/profile-manager'
import { get } from 'svelte/store'

export async function initProfileManagerFromNewProfile(node?: INode): Promise<void> {
    let profile = get(newProfile)
    setNewProfileClientOptions(profile.networkProtocol, profile.networkType, node)
    profile = get(newProfile)

    const path = await getStorageDirectoryOfProfile(profile.id)
    const coinType = COIN_TYPE[profile.networkProtocol]
    await initialiseProfileManager(path, coinType, profile.clientOptions, {
        Stronghold: { snapshotPath: `${path}/wallet.stronghold` },
    })
}
