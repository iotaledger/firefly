import { get, writable } from 'svelte/store'
import { asyncGetNodeInfo, profileManager, wallet } from './wallet'
import { cleanNodeAuth, getOfficialNodes, isOfficialNetwork, updateClientOptions } from './network'
import { NetworkStatus, NodeInfo } from './typings/network'
import { NetworkStatusHealthText } from './typings/network'
import { activeProfile } from './profile'
import { Node, NodePlugin } from './typings/node'
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from './time'

export const NETWORK_HEALTH_COLORS = {
    0: 'red',
    1: 'yellow',
    2: 'green',
}

/**
 * Default interval for polling the network status
 */
const DEFAULT_NETWORK_STATUS_POLL_INTERVAL = 10 * MILLISECONDS_PER_SECOND

export const networkStatus = writable<NetworkStatus>({
    messagesPerSecond: 0,
    referencedRate: 0,
    health: 2,
    healthText: NetworkStatusHealthText.Operational,
    currentMilestone: -1,
    nodePlugins: [],
})

let pollInterval

/**
 * Poll the network status at an interval.
 */
export async function pollNetworkStatus(): Promise<void> {
    await pollNetworkStatusInternal()
    /* eslint-disable @typescript-eslint/no-misused-promises */
    pollInterval = setInterval(async () => pollNetworkStatusInternal(), DEFAULT_NETWORK_STATUS_POLL_INTERVAL)
}

export function clearPollNetworkInterval(): void {
    clearInterval(pollInterval)
}

async function pollNetworkStatusInternal(): Promise<void> {
    let nodeInfo: NodeInfo | null
    try {
        nodeInfo = <NodeInfo>(<unknown>await get(profileManager).getNodeInfo())
    } catch (error) {
        console.error(error)
        nodeInfo = null
    }
    updateNetworkStatus(nodeInfo)
}

/**
 * Query the network and update the store for its status.
 *
 * @method updateNetworkStatus
 *
 * @param {string} accountId
 * @param {Node} node
 *
 * @returns {Promise<void>}
 */
export const updateNetworkStatus = (nodeInfo: NodeInfo | null): void => {
    if (nodeInfo) {
        const timeSinceLastMsInMinutes =
            (Date.now() - nodeInfo.payload.nodeinfo.status.latestMilestone.timestamp * MILLISECONDS_PER_SECOND) /
            (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)

        let health = 0 // bad
        if (timeSinceLastMsInMinutes < 2) {
            health = 2 // good
        } else if (timeSinceLastMsInMinutes < 5) {
            health = 1 // degraded
        }

        let healthText: NetworkStatusHealthText
        switch (health) {
            case 2:
                healthText = NetworkStatusHealthText.Operational
                break
            case 1:
                healthText = NetworkStatusHealthText.Degraded
                break
            case 0:
            default:
                healthText = NetworkStatusHealthText.Down
                break
        }

        networkStatus.set({
            messagesPerSecond: nodeInfo.payload.nodeinfo.metrics.messagesPerSecond,
            referencedRate: nodeInfo.payload.nodeinfo.metrics.referencedRate,
            health,
            healthText,
            currentMilestone: nodeInfo.payload.nodeinfo.status.confirmedMilestone.index,
            nodePlugins: nodeInfo.payload.nodeinfo.plugins?.map((plugin) => NodePlugin[plugin]) ?? [],
        })
    } else {
        networkStatus.set({
            messagesPerSecond: 0,
            referencedRate: 0,
            health: 0,
            healthText: NetworkStatusHealthText.Down,
            currentMilestone: -1,
            nodePlugins: [],
        })
    }
}

export const hasNodePlugin = (plugin: NodePlugin): boolean => get(networkStatus).nodePlugins.includes(plugin)
