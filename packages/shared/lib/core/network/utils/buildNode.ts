import { IPersistedProfile } from '@core/profile'
import { getNetwork } from '.'
import { BASE_TOKEN } from '../constants'
import { NetworkProtocol } from '../enums'
import { IAuth, INode, INodeInfoResponse } from '../interfaces'

export function buildNode(node: INode, nodeInfo: INodeInfoResponse, profile: IPersistedProfile, auth?: IAuth): INode {
    const nodes: INode[] = profile?.settings?.networkConfig?.nodes
    const baseToken = nodeInfo?.nodeinfo?.baseToken
    const protocol = Object.keys(BASE_TOKEN).find((key) => BASE_TOKEN[key]?.name === baseToken?.name) as NetworkProtocol

    return {
        url: nodeInfo?.url,
        auth,
    }
}
