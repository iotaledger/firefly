import { TokenMetadata } from './assets'
import { Node, NodePlugin } from './node'

export enum NetworkType {
    Mainnet = 'mainnet',
    Devnet = 'devnet',
    PrivateNet = 'private-net',
}

export enum NetworkProtocol {
    IOTA = 'iota',
    Shimmer = 'shimmer',
}

/**
 * The specific ID of an IOTA network or Tangle.
 */
export type NetworkId = string

/**
 * Holds relevant data
 * necessary for interacting within the context
 * of a particular network.
 */
export interface Network {
    id: NetworkId
    name: string
    protocol: NetworkProtocol
    type?: NetworkType
    bech32Hrp?: string
    baseToken?: TokenMetadata
}

/**
 * A subset of the client options offered in the
 * wallet.rs library. Each profile will hold
 * individual instances of these options.
 */
export interface NetworkConfig {
    nodes?: Node[]
    network?: Network
    automaticNodeSelection?: boolean
    includeOfficialNodes?: boolean
    localPow?: boolean
    nodeSyncEnabled?: boolean
    nodePoolUrls?: string[]
}

export type NetworkStatus = {
    messagesPerSecond?: number
    referencedRate?: number
    health?: number
    healthText?: NetworkStatusHealthText
    currentMilestone?: number
    nodePlugins?: NodePlugin[]
}

export enum NetworkStatusHealthText {
    Down = 'networkDown',
    Degraded = 'networkDegraded',
    Operational = 'networkOperational',
}
