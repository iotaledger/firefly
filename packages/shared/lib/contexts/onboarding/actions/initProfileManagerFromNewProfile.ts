import { INode, NetworkType } from '@core/network'
import { getStorageDirectoryOfProfile } from '@core/profile'
import { setNewProfileClientOptions, newProfile } from '@contexts/onboarding'
import { initialiseProfileManager, getNodeInfo } from '@core/profile-manager'
import { get } from 'svelte/store'

export async function initProfileManagerFromNewProfile(node: INode): Promise<void> {
    await setNewProfileClientOptions(get(newProfile).networkProtocol, NetworkType.PrivateNet, node)

    const path = await getStorageDirectoryOfProfile(get(newProfile).id)
    initialiseProfileManager(path, get(newProfile).clientOptions, {
        Stronghold: { snapshotPath: `${path}/wallet.stronghold` },
    })

    await getNodeInfo(node.url)
}
