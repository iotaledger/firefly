import { getActiveNetworkId } from '@core/network/utils/getNetworkId'
import { MarketCurrency } from '../enums'
import { updateMarketCoinPrices } from '../stores'
import { getMarketCoinIdByNetworkId } from '../utils'
import { getMarketCoinPrices } from './getMarketPrices'

export async function getAndUpdateMarketPrices(): Promise<void> {
    try {
        const activeNetworkId = getActiveNetworkId()
        if (!activeNetworkId) {
            return
        }
        const activeMarketCoinId = getMarketCoinIdByNetworkId(activeNetworkId)
        if (!activeMarketCoinId) {
            return
        }
        const marketPricesResponse = await getMarketCoinPrices([activeMarketCoinId], Object.values(MarketCurrency))
        updateMarketCoinPrices(marketPricesResponse)
    } catch (err) {
        console.error(err)
    }
}
