import { NetworkId, buildPersistedNetworkFromNodeInfoResponse, getNetworkIdFromNetworkName } from '@core/network'
import { getAndUpdateNodeInfo } from '@core/network/actions'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function checkAndUpdateActiveProfileNetwork(): Promise<void> {
    const $activeProfile = get(activeProfile)
    const nodeInfoResponse = await getAndUpdateNodeInfo(true)
    const networkId = $activeProfile?.network?.id
    if (!networkId || networkId === NetworkId.Custom) {
        const networkMetadata = buildPersistedNetworkFromNodeInfoResponse(nodeInfoResponse)
        networkMetadata.chains = $activeProfile.network?.chains || []
        updateActiveProfile({ network: networkMetadata })
    } else if (networkId !== getNetworkIdFromNetworkName(nodeInfoResponse?.nodeInfo?.protocol?.networkName)) {
        throw new Error('error.node.networkIdMismatch')
    }
}
