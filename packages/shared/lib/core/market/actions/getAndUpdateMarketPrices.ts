import { MarketCoinId, MarketCurrency } from '../enums'
import { updateMarketPrices } from '../stores'
import { getMarketPrices } from './getMarketPrices'

export async function getAndUpdateMarketPrices(): Promise<void> {
    try {
        const marketPricesResponse = await getMarketPrices([MarketCoinId.Shimmer], Object.values(MarketCurrency))
        updateMarketPrices(marketPricesResponse)
    } catch (error) {
        console.error(error)
    }
}
