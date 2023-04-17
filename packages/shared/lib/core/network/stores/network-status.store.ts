import { derived } from 'svelte/store'
import { MILESTONE_NOT_FOUND } from '../constants'
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
            currentMilestone: MILESTONE_NOT_FOUND,
        }
    }
})
