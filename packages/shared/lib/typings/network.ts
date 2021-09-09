import type { Node } from './node'

export enum NetworkType {
    ChrysalisMainnet = 'chrysalis-mainnet',
    ChrysalisDevnet = 'chrysalis-devnet',
    ChrysalisTestnet = 'testnet7',
    PrivateNet = 'private-net',
}

export interface Network {
    id: string
    name: string
    type: NetworkType
    bech32Hrp: string
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
