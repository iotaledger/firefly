import { get, writable } from 'svelte/store'
import { asyncGetNodeInfo, wallet } from './wallet'
import { cleanNodeAuth, getOfficialNodes, updateClientOptions } from './network'
import type { NetworkStatus } from './typings/network'
import { activeProfile } from './profile'
import { NetworkStatusHealthText } from './typings/network'
import type { Node } from './typings/node'

export const NETWORK_HEALTH_COLORS = {
    0: 'red',
    1: 'yellow',
    2: 'green',
}

/**
 * Default interval for polling the network status
 */
const DEFAULT_NETWORK_STATUS_POLL_INTERVAL = 10000

export const networkStatus = writable<NetworkStatus>({})

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
    let updated = false

    const accs = get(get(wallet).accounts)

    if (accs.length > 0) {
        const { networkConfig } = get(activeProfile)?.settings
        const account0 = accs[0]
        const { clientOptions } = account0

        let node = clientOptions?.nodes.find((n) => n.isPrimary)
        if (node?.url !== networkConfig?.nodes.find((n) => n.isPrimary)?.url) {
            /**
             * NOTE: If the network configuration and client options do NOT
             * agree on which node is the primary one, it is best to go with
             * what is stored app-side in the profile's setting's NetworkConfig.
             */
            node = networkConfig.nodes.find((n) => n.isPrimary) || getOfficialNodes(networkConfig.network.type)[0]

            updateClientOptions(networkConfig)
        }

        try {
            await updateNetworkStatus(account0.id, node)

            updated = true
        } catch (err) {
            console.error(err.name === 'AbortError' ? new Error(`Could not fetch from ${node.url}.`) : err)
        }
    }

    if (!updated) {
        networkStatus.set({
            messagesPerSecond: 0,
            referencedRate: 0,
            health: 0,
        })
    }
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
export const updateNetworkStatus = async (accountId: string, node: Node): Promise<void> => {
    const response = await asyncGetNodeInfo(accountId, node?.url, cleanNodeAuth(node?.auth))
    const timeSinceLastMsInMinutes = (Date.now() - response.nodeinfo.latestMilestoneTimestamp * 1000) / 60000

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
        messagesPerSecond: response.nodeinfo.messagesPerSecond,
        referencedRate: response.nodeinfo.referencedRate,
        health,
        healthText,
    })
}
