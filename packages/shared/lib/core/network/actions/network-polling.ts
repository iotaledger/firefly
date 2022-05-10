import { DEFAULT_NETWORK_STATUS_POLL_INTERVAL } from '../constants'
import { getAndUpdateNodeInfo } from './getAndUpdateNodeInfo'

let pollInterval

/**
 * Poll the network status at an interval.
 */
export async function pollNetworkStatus(): Promise<void> {
    await getAndUpdateNodeInfo()
    /* eslint-disable @typescript-eslint/no-misused-promises */
    pollInterval = setInterval(async () => getAndUpdateNodeInfo(), DEFAULT_NETWORK_STATUS_POLL_INTERVAL)
}

export function clearPollNetworkInterval(): void {
    clearInterval(pollInterval)
}
