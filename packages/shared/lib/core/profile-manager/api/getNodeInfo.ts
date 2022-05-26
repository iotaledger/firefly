import { IAuth } from '@core/network'
import { INodeInfoResponse } from '@core/network/interfaces/node-info-response.interface'
import { get } from 'svelte/store'
import { profileManager } from '../stores'

export function getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse> {
    const manager = get(profileManager)
    return manager.getNodeInfo(url, auth)
}
