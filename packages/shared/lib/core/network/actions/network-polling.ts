import { NETWORK_STATUS_POLL_INTERVAL } from '../constants'
import { getAndUpdateNodeInfo } from './getAndUpdateNodeInfo'

let pollInterval: number

/**
 * Poll the network status at an interval.
 */
export async function pollNetworkStatus(): Promise<void> {
    await getAndUpdateNodeInfo()
    await getAndUpdateNodeInfo()
    pollInterval = window.setInterval(() => void getAndUpdateNodeInfo(), NETWORK_STATUS_POLL_INTERVAL)
}

export function clearNetworkPoll(): void {
    clearInterval(pollInterval)
}
