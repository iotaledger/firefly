import { INode, updateNewProfileNetwork, validateAndCleanNodeData } from '@core/network'
import { getNodeInfo } from '@core/profile-manager'
import { get } from 'svelte/store'
import { newProfile } from '../stores'

export async function addCustomNodeToNewProfile(node: INode): Promise<void> {
    const profile = get(newProfile)
    const cleanedNode = validateAndCleanNodeData(node)
    // TODO: get base token and network param from the node
    const nodeInfoResponse = await getNodeInfo(cleanedNode.url, cleanedNode.auth)
    updateNewProfileNetwork(profile?.networkProtocol, profile?.networkType, cleanedNode)
}
