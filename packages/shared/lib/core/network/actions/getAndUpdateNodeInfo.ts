import { getNodeInfo } from '@core/profile-manager'
import { get } from 'svelte/store'
import { INodeInfoResponse } from '../interfaces'
import { updateNodeInfo } from '../stores/node-info.store'

export async function getAndUpdateNodeInfo(): Promise<void> {
    let nodeInfoResponse: INodeInfoResponse
    try {
        // TODO: adjust type of node info in bindings
        nodeInfoResponse = await getNodeInfo()
    } catch (error) {
        console.error(error)
        nodeInfoResponse = null
    }
    updateNodeInfo(nodeInfoResponse?.nodeinfo)
}
