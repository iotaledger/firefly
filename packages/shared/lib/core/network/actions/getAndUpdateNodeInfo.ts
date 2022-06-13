import { getNodeInfo } from '@core/profile-manager'
import { INodeInfoResponse } from '../interfaces/node-info-response.interface'
import { updateNodeInfo } from '../stores/node-info.store'

export async function getAndUpdateNodeInfo(): Promise<void> {
    let nodeInfoResponse: INodeInfoResponse
    try {
        nodeInfoResponse = await getNodeInfo()
    } catch (error) {
        console.error(error)
        nodeInfoResponse = null
    }
    updateNodeInfo(nodeInfoResponse?.nodeInfo)
}
