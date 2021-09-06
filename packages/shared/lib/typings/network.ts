import type { Node } from './node'

export enum NetworkType {
    ChrysalisMainnet = 'chrysalis-mainnet',
    ChrysalisDevnet = 'chrysalis-devnet',
    // TODO: PrivateNet,
}

export interface Network {
    id: string
    name: string
    type: NetworkType
}

export interface NetworkConfig {
    network: Network
    nodes: Node[]
    automaticNodeSelection: boolean
    includeOfficialNodes: boolean
    localPow: boolean
}

export type NetworkStatus = {
    messagesPerSecond?: number
    referencedRate?: number
    health?: number
}
