import { IClientOptions } from '@iota/wallet'

import { INode } from './node.interface'

export interface ClientOptions extends Omit<IClientOptions, 'nodes' | 'primaryNode'> {
    primaryNode?: INode
    nodes?: INode[]
    localPow?: boolean
}
