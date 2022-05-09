import { NodePlugin } from '@core/network'

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
