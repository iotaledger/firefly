import { INetwork } from './network.interface'
import { INode } from './node.interface'

/**
 * A subset of the client options offered in the
 * wallet.rs library. Each profile will hold
 * individual instances of these options.
 */
export interface INetworkConfig {
    nodes?: INode[]
    network?: INetwork
    automaticNodeSelection?: boolean
    includeOfficialNodes?: boolean
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}
