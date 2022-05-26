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
    updateNodeInfo(nodeInfoResponse?.nodeinfo)
    const builtNode = buildNode(cleanData, nodeInfoResponse, get(profile))
    if (!get(profile)?.settings?.networkConfig) {
        updateNewProfileNetworkClientOptions(get(profile)?.networkProtocol, get(profile)?.networkType, [builtNode])
    }
    const error = checkNodeUrlValidity(
        get(profile).settings?.networkConfig?.nodes,
        builtNode?.url,
        get(profile)?.isDeveloperProfile
    )
    if (!error) {
        if (!get(profile)?.settings?.networkConfig) {
            updateNewProfileNetworkClientOptions(get(profile)?.networkProtocol, get(profile)?.networkType, [builtNode])
        } else {
            const nodes: INode[] = get(profile)?.settings?.networkConfig?.nodes.reduce(
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
