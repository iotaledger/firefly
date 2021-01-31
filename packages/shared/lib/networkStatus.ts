import { writable } from 'svelte/store'

/**
 * Network status endpoints list
 */
export const NETWORK_STATUS_ENDPOINTS = [
    'https://explorer-api.iota.org/stats/chrysalis',
    'https://explorer-api.iota.works/stats/chrysalis'
]

/**
 * Default timeout for a request made to an endpoint
 */
const DEFAULT_NETWORK_STATUS_ENDPOINT_TIMEOUT = 5000

/**
 * Default interval for polling the network status
 */
const DEFAULT_NETWORK_STATUS_POLL_INTERVAL = 10000

type StatusData = {
    itemsPerSecond?: number;
    confirmedItemsPerSecond?: number;
    confirmationRate?: number;
    latestMilestoneIndex?: number;
    latestMilestoneIndexTime?: number;
    health?: number;
    healthReason?: string;
}

export const networkStatus = writable<StatusData>({});

/**
 * Poll the network status at an interval.
 */
export async function pollNetworkStatus(): Promise<void> {
    await fetchNetworkStatus();
    setInterval(async () => fetchNetworkStatus(), DEFAULT_NETWORK_STATUS_POLL_INTERVAL);
}

/**
 * Fetches network status data
 *
 * @method fetchNetworkStatus
 *
 * @returns {Promise<void>}
 */
export async function fetchNetworkStatus(): Promise<void> {
    const requestOptions: RequestInit = {
        headers: {
            Accept: 'application/json',
        },
    }

    for (let index = 0; index < NETWORK_STATUS_ENDPOINTS.length; index++) {
        try {
            const endpoint = NETWORK_STATUS_ENDPOINTS[index]

            const response: any = await Promise.race([
                fetch(endpoint, requestOptions),
                new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`Could not fetch from ${endpoint}.`)), DEFAULT_NETWORK_STATUS_ENDPOINT_TIMEOUT)
                }),
            ])

            const statusData: StatusData = await response.json()

            networkStatus.set(statusData)

            break
        } catch (err) {
            console.error(err)
        }
    }
}
