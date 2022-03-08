import { Node } from './node'
import { NetworkId } from './network'

/**
 * A subset of the client options offered in the
 * wallet.rs library.
 */
export interface ClientOptions {
    node?: Node
    nodes?: Node[]
    network?: NetworkId
    automaticNodeSelection?: boolean
    includeOfficialNodes?: boolean
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}
