import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@core/utils'
import { NetworkHealth } from '../enums'
import { INetworkStatus } from '../interfaces'
import { INodeInfo } from '@iota/types'

/**
 * Update the network status store from the NodeInfo.
 *
 * @method updateNetworkStatusFromNodeInfo
 * @param {IStardustNodeInfo} NodeInfo
 * @returns {INetworkStatus}
 */
export function getNetworkStatusFromNodeInfo(nodeInfo: INodeInfo): INetworkStatus {
    const timeSinceLastMsInMinutes =
        (Date.now() - nodeInfo.status.latestMilestone.timestamp * MILLISECONDS_PER_SECOND) /
        (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)

    let health = NetworkHealth.Down
    if (timeSinceLastMsInMinutes < 2) {
        health = NetworkHealth.Operational
    } else if (timeSinceLastMsInMinutes < 5) {
        health = NetworkHealth.Degraded
    }

    return {
        messagesPerSecond: nodeInfo.metrics.blocksPerSecond,
        referencedRate: nodeInfo.metrics.referencedRate,
        health,
        currentMilestone: nodeInfo.status.confirmedMilestone.index,
    }
}
