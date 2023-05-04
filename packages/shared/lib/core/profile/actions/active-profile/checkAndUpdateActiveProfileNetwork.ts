import { NetworkId, buildPersistedNetworkFromNodeInfoResponse, getNetworkIdFromNetworkName } from '@core/network'
import { getAndUpdateNodeInfo } from '@core/network/actions'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'
import { get } from 'svelte/store'

export async function checkAndUpdateActiveProfileNetwork(): Promise<void> {
    const $activeProfile = get(activeProfile)
    const nodeInfoResponse = await getAndUpdateNodeInfo(true)
    const networkId = $activeProfile?.network?.id
    if (
        networkId !== NetworkId.Custom &&
        networkId !== getNetworkIdFromNetworkName(nodeInfoResponse?.nodeInfo?.protocol?.networkName)
    ) {
        throw new Error('error.node.networkIdMismatch')
    } else {
        const network = buildPersistedNetworkFromNodeInfoResponse(nodeInfoResponse)
        network.chainConfigurations = $activeProfile.network?.chainConfigurations || []
        updateActiveProfile({ network })
    }
}
