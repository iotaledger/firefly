import { IClientOptions } from '@iota/sdk/out/types'

import { INode } from './node.interface'

export interface ClientOptions extends Omit<IClientOptions, 'nodes' | 'primaryNode'> {
    primaryNode?: INode
    nodes?: INode[]
}
