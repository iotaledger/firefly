import { IAuth, INode, INodeInfoResponse } from '../interfaces'

export function buildNode(nodeInfo: INodeInfoResponse, auth?: IAuth): INode {
    return {
        url: nodeInfo?.url,
        auth,
    }
}
