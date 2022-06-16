import { IPersistedProfile } from '@core/profile'
import { getNodeInfo } from '@core/profile-manager'
import { get, Writable } from 'svelte/store'
import {
    checkNodeUrlValidity,
    INode,
    updateNodeInfo,
    validateAndCleanNodeData,
    buildNode,
    nodeInfo,
} from '@core/network'

export async function addNode(node: INode, profile: Writable<IPersistedProfile>): Promise<void> {
    const cleanedNodeData = validateAndCleanNodeData(node)
    const nodeInfoResponse = await getNodeInfo(cleanedNodeData.url, cleanedNodeData.auth)
    const oldNodeInfo = get(nodeInfo)
    updateNodeInfo(nodeInfoResponse?.nodeInfo)
    const builtNode = buildNode(nodeInfoResponse, cleanedNodeData.auth)

    const hasValidUrl =
        checkNodeUrlValidity(
            get(profile).settings?.clientOptions?.nodes,
            builtNode?.url,
            get(profile)?.isDeveloperProfile
        ) === undefined
    const isInSameNetwork = oldNodeInfo.protocol.networkName === nodeInfoResponse.nodeInfo.protocol.networkName

    if (hasValidUrl && isInSameNetwork) {
        const nodes = [...get(profile)?.settings?.clientOptions?.nodes, builtNode]

        profile?.update((state) => ({
            ...state,
            settings: {
                ...state?.settings,
                clientOptions: {
                    nodes,
                    network: nodeInfoResponse.nodeInfo.name,
                },
            },
        }))
    }
}
