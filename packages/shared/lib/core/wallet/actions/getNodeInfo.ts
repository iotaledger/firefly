import { IAuth } from '@iota/sdk/out/types'
import { INodeInfoResponse } from '@core/network'
import { getClient } from './getClient'

export async function getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse> {
    const client = await getClient()

    const nodeUrl = url ?? (await client.getNode()).url

    const nodeInfo = await client.getNodeInfo(nodeUrl, auth)

    return {
        url: nodeUrl,
        nodeInfo,
    }
}
