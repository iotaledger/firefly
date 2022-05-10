import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@lib/time'
import { NetworkStatusDescription } from '../constants'
import { NetworkHealth, NodePlugin } from '../enums'
import { IStardustNodeInfo, INetworkStatus } from '../interfaces'

/**
 * Update the network status store from the NodeInfo.
 *
 * @method updateNetworkStatusFromNodeInfo
 * @param {IStardustNodeInfo} NodeInfo
 * @returns {INetworkStatus}
 */
export function getNetworkStatusFromNodeInfo(nodeInfo: IStardustNodeInfo | null): INetworkStatus {
    const timeSinceLastMsInMinutes =
        (Date.now() - nodeInfo.status.latestMilestone.timestamp * MILLISECONDS_PER_SECOND) /
        (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)

    let health = NetworkHealth.Down // bad
    if (timeSinceLastMsInMinutes < 2) {
        health = NetworkHealth.Operational // good
    } else if (timeSinceLastMsInMinutes < 5) {
        health = NetworkHealth.Operational // degraded
    }

    const description = NetworkStatusDescription?.[health]

    return {
        messagesPerSecond: nodeInfo.metrics.messagesPerSecond,
        referencedRate: nodeInfo.metrics.referencedRate,
        health,
        description,
        currentMilestone: nodeInfo.status.confirmedMilestone.index,
        nodePlugins: nodeInfo.plugins?.map((plugin) => NodePlugin[plugin]) ?? [],
    }
}
