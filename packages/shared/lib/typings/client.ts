import type { Node } from './node'
import type { NetworkId } from './network'

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
    mqttEnabled?: boolean
}
