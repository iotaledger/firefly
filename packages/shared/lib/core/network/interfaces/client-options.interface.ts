import { ClientOptions as SdkClientOptions } from '@iota/sdk/out/types'

import { INode } from './node.interface'

export interface ClientOptions extends Omit<SdkClientOptions, 'nodes' | 'primaryNode'> {
    primaryNode?: INode
    nodes?: INode[]
}
