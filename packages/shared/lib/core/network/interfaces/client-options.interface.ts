import { IClientOptions } from '@iota/wallet/out/types'

import { INode } from './node.interface'

export interface ClientOptions extends Omit<IClientOptions, 'nodes' | 'primaryNode'> {
    primaryNode?: INode
    nodes?: INode[]
    localPow?: boolean
}
