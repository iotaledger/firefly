import { IPersistedProfile } from '@core/profile'
import { getNodeInfo } from '@core/profile-manager'
import { get, Writable } from 'svelte/store'
import {
    checkNodeUrlValidity,
    INode,
    updateNodeInfo,
    validateAndCleanNodeData,
    buildNode,
    updateNewProfileNetworkClientOptions,
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
        if (!get(profile)?.settings?.clientOptions) {
            updateNewProfileNetworkClientOptions(get(profile)?.networkProtocol, get(profile)?.networkType, [builtNode])
        } else {
            const nodes: INode[] = get(profile)?.settings?.clientOptions?.nodes.reduce(
                (acc, node) => (node.url !== builtNode?.url ? [...acc, node] : acc),
                []
            )
            profile?.update((state) => ({
                ...state,
                settings: {
                    ...state?.settings,
                    clientOptions: {
                        nodes: [...nodes, node],
                        network: nodeInfoResponse.nodeInfo.name,
                    },
                },
            }))
        }
    }
}
