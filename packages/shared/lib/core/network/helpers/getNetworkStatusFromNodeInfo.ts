import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@core/utils'
import { NetworkHealth } from '../enums'
import { INetworkStatus } from '../interfaces'
import { INodeInfo } from '@iota/wallet/out/types'

/**
 * Update the network status store from the NodeInfo.
 *
 * @method updateNetworkStatusFromNodeInfo
 * @param {IStardustNodeInfo} nodeInfo
 * @returns {INetworkStatus}
 */
export function getNetworkStatusFromNodeInfo(nodeInfo: INodeInfo): INetworkStatus {
    let health = NetworkHealth.Down
    const timestamp = nodeInfo.status.latestMilestone.timestamp
    if (timestamp) {
        const timeSinceLastMsInMinutes =
            (Date.now() - timestamp * MILLISECONDS_PER_SECOND) / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)

        if (timeSinceLastMsInMinutes < 2) {
            health = NetworkHealth.Operational
        } else if (timeSinceLastMsInMinutes < 5) {
            health = NetworkHealth.Degraded
        }
    } else {
        health = NetworkHealth.Operational
    }

    return {
        messagesPerSecond: nodeInfo.metrics.blocksPerSecond,
        referencedRate: nodeInfo.metrics.referencedRate,
        health,
        currentMilestone: nodeInfo.status.confirmedMilestone.index,
    }
}
