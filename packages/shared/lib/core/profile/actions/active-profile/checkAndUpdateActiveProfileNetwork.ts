import { NetworkId, buildPersistedNetworkFromNodeInfoResponse, getNetworkIdFromNetworkName } from '@core/network'
import { getAndUpdateNodeInfo } from '@core/network/actions'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function checkAndUpdateActiveProfileNetwork(): Promise<void> {
    const $activeProfile = get(activeProfile)
    const nodeInfoResponse = await getAndUpdateNodeInfo(true)
    console.log(nodeInfoResponse)
    const networkId = $activeProfile?.network?.id
    const networkName = nodeInfoResponse?.nodeInfo?.protocolParameters[0]?.parameters?.networkName
    if (!networkId || networkId === NetworkId.Custom) {
        const network = buildPersistedNetworkFromNodeInfoResponse(nodeInfoResponse)
        network.chains = $activeProfile.network?.chains || []
        updateActiveProfile({ network })
    } else if (networkId !== getNetworkIdFromNetworkName(networkName)) {
        throw new Error('error.node.networkIdMismatch')
    }
}
