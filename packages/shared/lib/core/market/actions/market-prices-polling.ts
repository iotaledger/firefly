import { MARKET_POLL_INTERVAL } from '../constants'
import { getAndUpdateMarketPrices } from './getAndUpdateMarketPrices'

let pollInterval: number

/**
 * Poll the network status at an interval.
 */
export async function pollMarketPrices(): Promise<void> {
    await getAndUpdateMarketPrices()
    pollInterval = window.setInterval(() => void getAndUpdateMarketPrices(), MARKET_POLL_INTERVAL)
}

export function clearMarketPricesPoll(): void {
    clearInterval(pollInterval)
}
