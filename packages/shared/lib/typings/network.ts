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

export type NodeInfo = {
    type: string
    payload: {
        nodeinfo: {
            name: string
            version: string
            status: {
                isHealthy: true
                latestMilestone: {
                    index: number
                    timestamp: number
                    milestoneId: string
                }
                confirmedMilestone: {
                    index: number
                    timestamp: number
                    milestoneId: string
                }
                pruningIndex: number
            }
            protocol: {
                version: number
                networkName: string
                bech32HRP: string
                minPoWScore: number
                rentStructure: {
                    vByteCost: number
                    vByteFactorKey: number
                    vByteFactorData: number
                }
                tokenSupply: number
            }
            baseToken: {
                name: string
                tickerSymbol: string
                unit: string
                subunit: string
                decimals: number
                useMetricPrefix: boolean
            }
            metrics: {
                messagesPerSecond: 0.7
                referencedMessagesPerSecond: 0.7
                referencedRate: 100
            }
            features: []
            plugins: string[]
        }
        url: string
    }
}
