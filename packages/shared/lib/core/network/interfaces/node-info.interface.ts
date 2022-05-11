import { NodePlugin } from '../enums'

export interface INodeInfo {
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
        features: NodePlugin[]
        messagesPerSecond: number
        referencedMessagesPerSecond: number
        referencedRate: number
    }
    url: string
}

export interface IStardustNodeInfo {
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
        messagesPerSecond: number
        referencedMessagesPerSecond: number
        referencedRate: number
    }
    features: []
    plugins: string[]
}
