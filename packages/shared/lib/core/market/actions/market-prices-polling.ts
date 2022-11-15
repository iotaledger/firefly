import { MARKET_POLL_INTERVAL } from '../constants'
import { getAndUpdateMarketPrices } from './getAndUpdateMarketPrices'

let pollInterval

/**
 * Poll the network status at an interval.
 */
export async function pollMarketPrices(): Promise<void> {
    await getAndUpdateMarketPrices()
    pollInterval = setInterval(() => void getAndUpdateMarketPrices(), MARKET_POLL_INTERVAL)
}

export function clearPollMarketPrices(): void {
    clearInterval(pollInterval)
}
