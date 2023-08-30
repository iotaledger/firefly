import { IAuth } from '@core/network'
import { INodeInfoResponse } from '@core/network/interfaces/node-info-response.interface'
import { get } from 'svelte/store'
import { profileManager } from '../stores'
import { api } from '../api'

export function getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse> {
    const manager = get(profileManager)
    return api.getNodeInfo(manager.id, url, auth)
}
