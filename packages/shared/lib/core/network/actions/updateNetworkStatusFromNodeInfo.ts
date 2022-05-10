import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@lib/time'
import { NetworkStatusDescription, NodePlugin } from '../enums'
import { IStardustNodeInfo } from '../interfaces'
import { updateNetworkStatus } from '../stores'
/**
 * Update the network status store from the NodeInfo.
 *
 * @method updateNetworkStatusFromNodeInfo
 * @param {IStardustNodeInfo | null} NodeInfo
 * @returns {void}
 */
export function updateNetworkStatusFromNodeInfo(nodeInfo: IStardustNodeInfo | null): void {
    if (nodeInfo) {
        const timeSinceLastMsInMinutes =
            (Date.now() - nodeInfo.status.latestMilestone.timestamp * MILLISECONDS_PER_SECOND) /
            (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)

        let health = 0 // bad
        if (timeSinceLastMsInMinutes < 2) {
            health = 2 // good
        } else if (timeSinceLastMsInMinutes < 5) {
            health = 1 // degraded
        }

        let description: NetworkStatusDescription
        switch (health) {
            case 2:
                description = NetworkStatusDescription.Operational
                break
            case 1:
                description = NetworkStatusDescription.Degraded
                break
            case 0:
            default:
                description = NetworkStatusDescription.Down
                break
        }
        updateNetworkStatus({
            messagesPerSecond: nodeInfo.metrics.messagesPerSecond,
            referencedRate: nodeInfo.metrics.referencedRate,
            health,
            description,
            currentMilestone: nodeInfo.status.confirmedMilestone.index,
            nodePlugins: nodeInfo.plugins?.map((plugin) => NodePlugin[plugin]) ?? [],
        })
    } else {
        updateNetworkStatus({
            messagesPerSecond: 0,
            referencedRate: 0,
            health: 0,
            description: NetworkStatusDescription.Disconnected,
            currentMilestone: -1,
            nodePlugins: [],
        })
    }

    return updateNetworkStatus({})
}
