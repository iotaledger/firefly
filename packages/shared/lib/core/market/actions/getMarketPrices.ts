import { DEFAULT_APPLICATION_JSON_REQUEST_OPTIONS } from '@core/utils'
import { MARKET_API_BASE_URL } from '../constants'
import { MARKET_SIMPLE_PRICE_ENDPOINT } from '../constants/market-simple-price-endpoint.constant'
import { MarketCoinId, MarketCurrency } from '../enums'
import { MarketCoinPrices } from '../types'

export async function getMarketCoinPrices(
    ids: MarketCoinId[],
    vsCurrencies: MarketCurrency[]
): Promise<MarketCoinPrices> {
    try {
        const simplePricesQueryParams = {
            ids: ids.join(','),
            vs_currencies: vsCurrencies.join(','),
        }
        const queryParams = Object.keys(simplePricesQueryParams)
            .map((key) => key + '=' + simplePricesQueryParams[key])
            .join('&')
        const requestUrl = MARKET_API_BASE_URL + MARKET_SIMPLE_PRICE_ENDPOINT + '?' + queryParams
        const response = await fetch(requestUrl, DEFAULT_APPLICATION_JSON_REQUEST_OPTIONS)
        const data = await response.json()
        return <MarketCoinPrices>data
    } catch (err) {
        console.error(err)
    }
}
