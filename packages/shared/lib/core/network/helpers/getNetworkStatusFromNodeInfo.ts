import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@core/utils'
import { NetworkHealth } from '../enums'
import { INetworkStatus } from '../interfaces'
import { INodeInfo, NetworkMetricsResponse } from '@iota/sdk/out/types'
import { getUnixTimestampFromNodeInfoAndSlotIndex } from './getSlotInfoFromNodeProtocolParameters'

/**
 * Update the network status store from the NodeInfo.
 *
 * @method updateNetworkStatusFromNodeInfo
 * @param {IStardustNodeInfo} nodeInfo
 * @returns {INetworkStatus}
 */
export function getNetworkStatusFromNodeInfo(
    nodeInfo: INodeInfo,
    networkMetrics: NetworkMetricsResponse
): INetworkStatus {
    let health = NetworkHealth.Down
    const unixTimestamp = getUnixTimestampFromNodeInfoAndSlotIndex(
        nodeInfo.protocolParameters[0].parameters,
        nodeInfo.status.latestFinalizedSlot
    )

    if (unixTimestamp) {
        const timeSinceLastMsInMinutes =
            (Date.now() - unixTimestamp * MILLISECONDS_PER_SECOND) / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)
        if (timeSinceLastMsInMinutes < 2) {
            health = NetworkHealth.Operational
        } else if (timeSinceLastMsInMinutes < 5) {
            health = NetworkHealth.Degraded
        }
    } else {
        health = NetworkHealth.Operational
    }

    return {
        messagesPerSecond: networkMetrics.blocksPerSecond,
        confirmationRate: networkMetrics.confirmationRate,
        health,
        currentSlot: nodeInfo.status.latestConfirmedBlockSlot,
    }
}
