import type { Node } from './node';

export interface ClientOptions {
    nodes?: Node[]
    node?: Node
    network?: string
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}
