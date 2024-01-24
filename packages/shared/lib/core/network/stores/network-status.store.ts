import { derived } from 'svelte/store'
import { SLOT_NOT_FOUND } from '../constants'
import { NetworkHealth } from '../enums/network-health.enum'
import { getNetworkStatusFromNodeInfo } from '../helpers'
import { nodeInfo } from './node-info.store'

export const networkStatus = derived([nodeInfo], ([$nodeInfo]) => {
    if ($nodeInfo) {
        return getNetworkStatusFromNodeInfo($nodeInfo)
    } else {
        return {
            messagesPerSecond: 0,
            confirmationRate: '0',
            health: NetworkHealth.Disconnected,
            currentSlot: SLOT_NOT_FOUND,
        }
    }
})
