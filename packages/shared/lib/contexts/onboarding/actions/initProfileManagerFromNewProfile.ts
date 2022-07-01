import { COIN_TYPE, INode } from '@core/network'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { setNewProfileClientOptions, newProfile } from '@contexts/onboarding'
import { initialiseProfileManager } from '@core/profile-manager'
import { get } from 'svelte/store'

export async function initProfileManagerFromNewProfile(node?: INode): Promise<void> {
    const profile = get(newProfile)
    await setNewProfileClientOptions(profile.networkProtocol, profile.networkType, node)

    const path = await getStorageDirectoryOfProfile(profile.id)
    const coinType = COIN_TYPE[profile.networkProtocol]
    initialiseProfileManager(path, coinType, profile.clientOptions, {
        Stronghold: { snapshotPath: `${path}/wallet.stronghold` },
    })
}
