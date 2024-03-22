import { derived } from 'svelte/store'
import { SLOT_NOT_FOUND } from '../constants'
import { NetworkHealth } from '../enums/network-health.enum'
import { getNetworkStatusFromNodeInfo } from '../helpers'
import { nodeInfo } from './node-info.store'
import { networkMetrics } from './network-metrics.store'

export const networkStatus = derived([nodeInfo, networkMetrics], ([$nodeInfo, $networkMetrics]) => {
    if ($nodeInfo && $networkMetrics) {
        return getNetworkStatusFromNodeInfo($nodeInfo, $networkMetrics)
    } else {
        return {
            messagesPerSecond: 0,
            confirmationRate: '0',
            health: NetworkHealth.Disconnected,
            currentSlot: SLOT_NOT_FOUND,
        }
    }
})
