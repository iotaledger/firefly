import { derived } from 'svelte/store'
import { NetworkStatusDescription } from '../constants'
import { NetworkHealth } from '../enums/network-health.enum'
import { getNetworkStatusFromNodeInfo } from '../helpers'
import { nodeInfo } from './node-info.store'

export const networkStatus = derived([nodeInfo], ([$nodeInfo]) => {
    if ($nodeInfo) {
        return getNetworkStatusFromNodeInfo($nodeInfo)
    } else {
        return {
            messagesPerSecond: 0,
            referencedRate: 0,
            health: NetworkHealth.Disconnected,
            description: NetworkStatusDescription[NetworkHealth.Disconnected],
            currentMilestone: -1,
        }
    }
})
