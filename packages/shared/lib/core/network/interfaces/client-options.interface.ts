import { ClientOptions } from '@iota/wallet'

import { INode } from './node.interface'

export interface IClientOptions extends Omit<ClientOptions, 'nodes' | 'primaryNode'> {
    primaryNode?: INode
    nodes?: INode[]
    automaticNodeSelection?: boolean
    includeOfficialNodes?: boolean
    localPow?: boolean
}
