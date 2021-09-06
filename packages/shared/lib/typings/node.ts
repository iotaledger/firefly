import type { Network } from './network'

export interface NodeAuth {
    username?: string
    password?: string
    jwt?: string
}

export interface Node {
    url: string
    auth?: NodeAuth
    network?: Network
    isPrimary?: boolean
    isDisabled?: boolean
}

export interface NodeInfo {
    nodeinfo: {
        name: string
        version: string
        isHealthy: boolean
        networkId: string
        minPoWScore: number
        bech32HRP: string
        latestMilestoneIndex: number
        latestMilestoneTimestamp: number
        confirmedMilestoneIndex: number
        pruningIndex: number
        features: string[]
        messagesPerSecond: number
        referencedMessagesPerSecond: number
        referencedRate: number
    }
    url: string
}
