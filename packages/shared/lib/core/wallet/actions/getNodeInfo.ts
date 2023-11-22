import { IAuth } from '@core/network'
import { INodeInfoResponse } from '@core/network/interfaces/node-info-response.interface'
import { get } from 'svelte/store'
import { profileManager } from '../stores'
import { api } from '../../api'
import { selectedAccount } from '@core/account'

export async function getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse> {
    const wallet = get(selectedAccount)
    
    const client = await wallet!.getClient()
    const nodeUrl = url ?? (await client.getNode()).url

    const nodeInfo = await client.getNodeInfo(nodeUrl, auth)

    return {
        url: nodeUrl,
        nodeInfo,
    }
}
