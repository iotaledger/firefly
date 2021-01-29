import { writable, get, derived } from 'svelte/store'
import { currencies, Currencies, exchangeRates, ExchangeRates, CurrencyTypes } from 'shared/lib/currency'

/**
 * Market data endpoints list
 */
export const MARKETDATA_ENDPOINTS = [
    'https://nodes.iota.works/api/market',
    'https://iota-node-api.now.sh/api/market',
    'https://iota.dance/api/market',
]

/**
 * Default timeout for a request made to an endpoint
 */
const DEFAULT_MARKETDATA_ENDPOINT_TIMEOUT = 5000

enum HistoryDataProps {
    ONE_HOUR = '1h',
    ONE_MINUTE = '1m',
    SEVEN_DAYS = '7d',
    TWENTY_FOUR_HOURS = '24h',
}

enum Timeframes {
    ONE_HOUR = '1 hour',
    SEVEN_DAYS = '1 week',
    TWENTY_FOUR_HOURS = '1 day',
}

export enum AvailableCharts {
    PORTFOLIO = 'Portfolio',
    TOKEN = 'Token',
}

enum Histories {
    HISTORY_BTC = 'history-btc',
    HISTORY_ETH = 'history-eth',
    HISTORY_EUR = 'history-eur',
    HISTORY_USD = 'history-usd',
}

type HistoryData = {
    [HistoryDataProps.ONE_HOUR]: (string | number)[]
    [HistoryDataProps.ONE_MINUTE]: (string | number)[]
    [HistoryDataProps.SEVEN_DAYS]: (string | number)[]
    [HistoryDataProps.TWENTY_FOUR_HOURS]: (string | number)[]
}

type HistoryBTC = {
    currency: CurrencyTypes.BTC
    data: HistoryData
}

type HistoryETH = {
    currency: CurrencyTypes.ETH
    data: HistoryData
}

type HistoryEUR = {
    currency: CurrencyTypes.EUR
    data: HistoryData
}

type HistoryUSD = {
    currency: CurrencyTypes.USD
    data: HistoryData
}

type Market = {
    usd: number
    usd_24h_change: number
    usd_24h_vol: number
    usd_market_cap: number
}

type MarketData = {
    currencies: Currencies
    market: Market
    rates: ExchangeRates
    [Histories.HISTORY_BTC]: HistoryBTC
    [Histories.HISTORY_ETH]: HistoryETH
    [Histories.HISTORY_EUR]: HistoryEUR
    [Histories.HISTORY_USD]: HistoryUSD
}

type PriceData = {
    [CurrencyTypes.BTC]: HistoryData
    [CurrencyTypes.EUR]: HistoryData
    [CurrencyTypes.USD]: HistoryData
    [CurrencyTypes.ETH]: HistoryData
}

type ChartData = {
    labels: string[]
    data: number[]
}

/**
 * Market cap
 */
export const mcap = writable<number>(0)

/**
 * Total amount traded over twenty four hours
 */
export const volume = writable<number>(0)

/**
 * Percentage of change in IOTA price over twenty four hours
 */
export const change24h = writable<number>(0)

/**
 * Price data
 */
export const priceData = writable<PriceData>({
    btc: {
        '1h': [],
        '1m': [],
        '24h': [],
        '7d': [],
    },
    eur: {
        '1h': [],
        '1m': [],
        '24h': [],
        '7d': [],
    },
    usd: {
        '1h': [],
        '1m': [],
        '24h': [],
        '7d': [],
    },
    eth: {
        '1h': [],
        '1m': [],
        '24h': [],
        '7d': [],
    },
})

/** Selected currency on chart */
export const chartCurrency = writable<CurrencyTypes>(CurrencyTypes.USD)

/** Selected time frame on chart */
export const chartTimeframe = writable<HistoryDataProps>(HistoryDataProps.SEVEN_DAYS)

/** Selected chart */
export const selectedChart = writable<AvailableCharts>(AvailableCharts.PORTFOLIO)

/** Chart data */
export const chartData = derived([priceData, chartCurrency, chartTimeframe], ([$priceData, $chartCurrency, $chartTimeframe]) => {
    return $priceData[$chartCurrency][$chartTimeframe]
        .sort((a, b) => a[0] - b[0])
        .reduce(
            (acc, values) => {
                acc.labels.push(new Date(values[0] * 1000).toLocaleString('default', { month: 'short', day: 'numeric' }))
                acc.data.push(parseFloat(values[1]))

                return acc
            },
            { labels: [], data: [] }
        )
})

export const TIMEFRAME_MAP = {
    [HistoryDataProps.ONE_HOUR]: Timeframes.ONE_HOUR,
    [HistoryDataProps.SEVEN_DAYS]: Timeframes.SEVEN_DAYS,
    [HistoryDataProps.TWENTY_FOUR_HOURS]: Timeframes.TWENTY_FOUR_HOURS,
}

/**
 * Fetches market data
 *
 * @method fetchMarketData
 *
 * @returns {Promise<void>}
 */
export async function fetchMarketData(): Promise<void> {
    const requestOptions: RequestInit = {
        headers: {
            Accept: 'application/json',
        },
    }

    for (let index = 0; index < MARKETDATA_ENDPOINTS.length; index++) {
        try {
            const endpoint = MARKETDATA_ENDPOINTS[index]

            const response: any = await Promise.race([
                fetch(endpoint, requestOptions),
                new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`Could not fetch from ${endpoint}.`)), DEFAULT_MARKETDATA_ENDPOINT_TIMEOUT)
                }),
            ])

            const marketData: MarketData = await response.json()
            
            const _priceData = {} as PriceData

            Object.keys(get(priceData)).forEach((currency: CurrencyTypes) => {
                if (marketData[`history-${currency}`]) {
                    _priceData[currency] = marketData[`history-${currency}`].data
                }
            })

            // Store currencies
            currencies.set(marketData.currencies)

            // Store price data
            priceData.set(_priceData)

            // Store exchange rates in store
            exchangeRates.set(marketData.rates)

            // Store market statistics
            mcap.set(marketData.market.usd_market_cap)
            volume.set(marketData.market.usd_24h_vol)
            change24h.set(marketData.market.usd_24h_change)

            break
        } catch (err) {
            console.error(err)
        }
    }
}

