import { INodeInfoResponse } from '@core/network'
import { get } from 'svelte/store'
import { profileManager } from '../store'

export async function getNodeInfo(): Promise<INodeInfoResponse> {
    const manager = get(profileManager)
    const response = <INodeInfoResponse>(<unknown>await manager.getNodeInfo())
    return response
}
