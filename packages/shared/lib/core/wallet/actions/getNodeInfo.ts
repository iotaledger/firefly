import { IAuth } from '@iota/sdk/out/types';
import { INodeInfoResponse } from '@core/network';
import { getClient } from './getClient'

export async function getNodeInfo(url?: string, auth?: IAuth): Promise<INodeInfoResponse> {
    const client = await getClient();
    console.log("client --------------", client);
    
    const nodeUrl = url ?? (await client.getNode()).url
    console.log("nodeUrl --------------", nodeUrl);
    
    const nodeInfo = await client.getNodeInfo(nodeUrl, auth)
    console.log("nodeInfo --------------", nodeInfo);

    return {
        url: nodeUrl,
        nodeInfo,
    }
}
