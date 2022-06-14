import { ClientOptions } from '@iota/wallet'

import { INode } from './node.interface'

export interface IClientOptions extends ClientOptions {
    node?: INode
    nodes?: INode[]
    network?: string
    automaticNodeSelection?: boolean
    includeOfficialNodes?: boolean
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}
