import { getNodeInfo, setClientOptions } from '@core/profile-manager'
import { get } from 'svelte/store'
import { checkNodeUrlValidity, INode, updateNodeInfo, buildNode, nodeInfo } from '@core/network'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'

export async function addNodeToActiveProfile(node: INode): Promise<void> {
    const _activeProfile = get(activeProfile)

    const nodeInfoResponse = await getNodeInfo(node.url, node.auth)
    const oldNodeInfo = get(nodeInfo)
    updateNodeInfo(nodeInfoResponse?.nodeInfo)
    const builtNode = buildNode(nodeInfoResponse, node.auth)

    const hasValidUrl =
        checkNodeUrlValidity(
            _activeProfile.clientOptions?.nodes,
            builtNode?.url,
            _activeProfile?.isDeveloperProfile
        ) === undefined
    const isInSameNetwork = oldNodeInfo.protocol.networkName === nodeInfoResponse.nodeInfo.protocol.networkName

    if (hasValidUrl && isInSameNetwork) {
        const nodes = [..._activeProfile?.clientOptions?.nodes, builtNode]
        const clientOptions = {
            nodes,
            network: nodeInfoResponse.nodeInfo.name,
        }

        updateActiveProfile({ clientOptions })
        await setClientOptions(clientOptions)
    }
}
