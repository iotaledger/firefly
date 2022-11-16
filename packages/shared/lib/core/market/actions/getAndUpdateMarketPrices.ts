import { MarketCoinId, MarketCurrency } from '../enums'
import { updateMarketCoinPrices } from '../stores'
import { getMarketCoinPrices } from './getMarketPrices'

export async function getAndUpdateMarketPrices(): Promise<void> {
    try {
        const marketPricesResponse = await getMarketCoinPrices([MarketCoinId.Shimmer], Object.values(MarketCurrency))
        updateMarketCoinPrices(marketPricesResponse)
    } catch (error) {
        console.error(error)
    }
}
