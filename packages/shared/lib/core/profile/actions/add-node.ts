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
} from '@core/network'

export async function addNode(node: INode, profile: Writable<IPersistedProfile>): Promise<void> {
    const cleanData = validateAndCleanNodeData(node)
    const nodeInfoResponse = await getNodeInfo(cleanData.url, cleanData.auth)
    updateNodeInfo(nodeInfoResponse?.nodeInfo)
    const builtNode = buildNode(nodeInfoResponse, cleanData.auth)
    if (!get(profile)?.settings?.clientOptions) {
        updateNewProfileNetworkClientOptions(get(profile)?.networkProtocol, get(profile)?.networkType, [builtNode])
    }
    const error = checkNodeUrlValidity(
        get(profile).settings?.clientOptions?.nodes,
        builtNode?.url,
        get(profile)?.isDeveloperProfile
    )
    if (!error) {
        if (!get(profile)?.settings?.clientOptions) {
            updateNewProfileNetworkClientOptions(get(profile)?.networkProtocol, get(profile)?.networkType, [builtNode])
        } else {
            const nodes: INode[] = get(profile)?.settings?.clientOptions?.nodes.reduce(
                (acc, node) => (node.url !== builtNode?.url ? [...acc, node] : acc),
                []
            )
            profile?.update((state) => ({
                ...state,
                settings: { ...state?.settings, nodes: [...nodes, node] },
            }))
        }
    }
}
