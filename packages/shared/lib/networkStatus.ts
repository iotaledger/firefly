import { get, writable } from 'svelte/store'
import { asyncGetNodeInfo, wallet } from "shared/lib/wallet"
import { getOfficialNodes } from 'shared/lib/network'

/**
 * Default interval for polling the network status
 */
const DEFAULT_NETWORK_STATUS_POLL_INTERVAL = 10000

type StatusData = {
    messagesPerSecond?: number
    referencedRate?: number
    health?: number
}

export const networkStatus = writable<StatusData>({})

let pollInterval

/**
 * Poll the network status at an interval.
 */
export async function pollNetworkStatus(): Promise<void> {
    await fetchNetworkStatus()
    pollInterval = setInterval(async () => fetchNetworkStatus(), DEFAULT_NETWORK_STATUS_POLL_INTERVAL)
}

const { accounts, accountsLoaded } = get(wallet)

accountsLoaded.subscribe((val) => {
    if (val) {
        pollNetworkStatus()
    } else {
        clearInterval(pollInterval)
    }
})

/**
 * Fetches network status data
 *
 * @method fetchNetworkStatus
 *
 * @returns {Promise<void>}
 */
export async function fetchNetworkStatus(): Promise<void> {
    let updated = false

    const accs = get(accounts)

    if (accs.length > 0) {
        const account0 = accs[0]
        const clientOptions = account0.clientOptions
        const node = {
            ...(clientOptions.node ?? getOfficialNodes()[0]),
            auth: null
        }

        try {
            const response = await asyncGetNodeInfo(account0.id, node.url, node.auth)

            const timeSinceLastMsInMinutes = (Date.now() - (response.nodeinfo.latestMilestoneTimestamp * 1000)) / 60000;
            let health = 0; //bad
            if (timeSinceLastMsInMinutes < 2) {
                health = 2; // good
            } else if (timeSinceLastMsInMinutes < 5) {
                health = 1; // degraded
            }

            networkStatus.set({
                messagesPerSecond: response.nodeinfo.messagesPerSecond,
                referencedRate: response.nodeinfo.referencedRate,
                health
            })

            updated = true
        } catch (err) {
            console.error(err.name === "AbortError" ? new Error(`Could not fetch from ${node.url}.`) : err)
        }
    }

    if (!updated) {
        networkStatus.set({
            messagesPerSecond: 0,
            referencedRate: 0,
            health: 0
        })
    }
}
