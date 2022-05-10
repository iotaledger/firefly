import { DEFAULT_NETWORK_STATUS_POLL_INTERVAL } from '../constants'
import { getAndUpdateNetworkStatus } from './getAndUpdateNetworkStatus'

let pollInterval

/**
 * Poll the network status at an interval.
 */
export async function pollNetworkStatus(): Promise<void> {
    await getAndUpdateNetworkStatus()
    /* eslint-disable @typescript-eslint/no-misused-promises */
    pollInterval = setInterval(async () => getAndUpdateNetworkStatus(), DEFAULT_NETWORK_STATUS_POLL_INTERVAL)
}

export function clearPollNetworkInterval(): void {
    clearInterval(pollInterval)
}
