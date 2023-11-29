import { getNodeInfo } from '@core/wallet/actions'
import { INodeInfoResponse } from '../interfaces/node-info-response.interface'
import { setNodeInfo } from '../stores/node-info.store'

export async function getAndUpdateNodeInfo(forwardErrors = false): Promise<INodeInfoResponse> {
    let nodeInfoResponse: INodeInfoResponse
    try {
        nodeInfoResponse = await getNodeInfo()
        setNodeInfo(nodeInfoResponse?.nodeInfo)
        return nodeInfoResponse
    } catch (err) {
        setNodeInfo(undefined)
        if (forwardErrors) {
            return Promise.reject(err)
        } else {
            console.error(err)
        }
    }
}
