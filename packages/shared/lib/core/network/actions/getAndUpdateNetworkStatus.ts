import { MILLISECONDS_PER_SECOND } from '@lib/time'
import { profileManager } from '@lib/wallet'
import { get } from 'svelte/store'
import { INodeInfoResponse } from '../interfaces'
import { updateNetworkStatusFromNodeInfo } from './updateNetworkStatusFromNodeInfo'

export async function getAndUpdateNetworkStatus(): Promise<void> {
    let nodeInfoResponse: INodeInfoResponse | null
    try {
        nodeInfoResponse = <INodeInfoResponse>(<unknown>await get(profileManager).getNodeInfo())
    } catch (error) {
        console.error(error)
        nodeInfoResponse = null
    }
    updateNetworkStatusFromNodeInfo(nodeInfoResponse?.payload?.nodeinfo ?? null)
}
