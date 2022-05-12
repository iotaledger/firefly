import { INodeInfoResponse } from '@core/network'
import { get } from 'svelte/store'
import { profileManager } from '../store'

export function getNodeInfo(): Promise<INodeInfoResponse> {
    const manager = get(profileManager)
    return manager.getNodeInfo()
}
