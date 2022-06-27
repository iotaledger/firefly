import { INode, NetworkProtocol, NetworkType } from '@core/network'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { setNewProfileClientOptions, newProfile } from '@contexts/onboarding'
import { initialiseProfileManager } from '@core/profile-manager'
import { get } from 'svelte/store'

export async function initProfileManagerFromNewProfile(
    protocol: NetworkProtocol,
    networkType: NetworkType,
    node?: INode
): Promise<void> {
    await setNewProfileClientOptions(protocol, networkType, node)

    const path = await getStorageDirectoryOfProfile(get(newProfile).id)
    initialiseProfileManager(path, get(newProfile).clientOptions, {
        Stronghold: { snapshotPath: `${path}/wallet.stronghold` },
    })
}
