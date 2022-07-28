import type { INodeInfo } from '@iota/types'
import { writable } from 'svelte/store'

export const nodeInfo = writable<INodeInfo>({
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
    supportedProtocolVersions: undefined,
    protocol: {
        protocolVersion: undefined,
        networkName: undefined,
        bech32Hrp: undefined,
        minPowScore: undefined,
        rentStructure: {
            vByteCost: undefined,
            vByteFactorKey: undefined,
            vByteFactorData: undefined,
        },
        tokenSupply: undefined,
    },
    pendingProtocolParameters: undefined,
    baseToken: {
        name: undefined,
        tickerSymbol: undefined,
        unit: undefined,
        subunit: undefined,
        decimals: undefined,
        useMetricPrefix: undefined,
    },
    metrics: {
        blocksPerSecond: undefined,
        referencedBlocksPerSecond: undefined,
        referencedRate: undefined,
    },
    features: [],
})

export function updateNodeInfo(payload: Partial<INodeInfo>): void {
    return nodeInfo.update((state) => {
        if (nodeInfo) {
            return { ...state, ...payload }
        } else {
            return state
        }
    })
}
