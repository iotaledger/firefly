import { NetworkId, buildPersistedNetworkFromNodeInfoResponse } from '@core/network'
import { getAndUpdateNodeInfo } from '@core/network/actions'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function checkAndUpdateActiveProfileNetwork(): Promise<void> {
    const $activeProfile = get(activeProfile)
    const existingNetworkId = $activeProfile?.network?.id
    const nodeInfoResponse = await getAndUpdateNodeInfo(true)
    const network = buildPersistedNetworkFromNodeInfoResponse(nodeInfoResponse)
    if (existingNetworkId === NetworkId.Custom || existingNetworkId === network.id) {
        network.chainConfigurations = $activeProfile.network?.chainConfigurations || []
        updateActiveProfile({ network })
    } else {
        throw new Error('error.node.networkIdMismatch')
    }
}
