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
