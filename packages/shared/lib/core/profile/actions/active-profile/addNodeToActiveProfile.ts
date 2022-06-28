import { getNodeInfo, setClientOptions } from '@core/profile-manager'
import { get } from 'svelte/store'
import { buildNode, IClientOptions, INode, updateNodeInfo } from '@core/network'
import { activeProfile, updateActiveProfile } from '@core/profile/stores'

export async function addNodeToActiveProfile(node: INode): Promise<void> {
    const nodeInfoResponse = await getNodeInfo(node.url, node.auth)
    const builtNode = buildNode(nodeInfoResponse, node.auth)

    const nodes = [...get(activeProfile)?.clientOptions?.nodes, builtNode]
    const clientOptions: IClientOptions = { nodes }

    updateNodeInfo(nodeInfoResponse.nodeInfo)
    updateActiveProfile({ clientOptions })
    await setClientOptions(clientOptions)
}
