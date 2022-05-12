import { INode } from './node.interface'

export interface IClientOptions {
    node?: INode
    nodes?: INode[]
    network?: string
    automaticNodeSelection?: boolean
    includeOfficialNodes?: boolean
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}
