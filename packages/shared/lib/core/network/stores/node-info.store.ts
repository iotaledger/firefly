import { writable } from 'svelte/store'
import { IStardustNodeInfo } from '../interfaces'

export const nodeInfo = writable<IStardustNodeInfo>({
    name: undefined,
    version: undefined,
    status: {
        isHealthy: undefined,
        latestMilestone: {
            index: undefined,
            timestamp: undefined,
            milestoneId: undefined,
        },
        confirmedMilestone: {
            index: undefined,
            timestamp: undefined,
            milestoneId: undefined,
        },
        pruningIndex: undefined,
    },
    protocol: {
        version: undefined,
        networkName: undefined,
        bech32HRP: undefined,
        minPoWScore: undefined,
        rentStructure: {
            vByteCost: undefined,
            vByteFactorKey: undefined,
            vByteFactorData: undefined,
        },
        tokenSupply: undefined,
    },
    baseToken: {
        name: undefined,
        tickerSymbol: undefined,
        unit: undefined,
        subunit: undefined,
        decimals: undefined,
        useMetricPrefix: undefined,
    },
    metrics: {
        messagesPerSecond: undefined,
        referencedMessagesPerSecond: undefined,
        referencedRate: undefined,
    },
    features: [],
    plugins: [],
})

export function updateNodeInfo(payload: Partial<IStardustNodeInfo>): void {
    return nodeInfo.update((state) => {
        if (nodeInfo) {
            return { ...state, ...payload }
        } else {
            return state
        }
    })
}
