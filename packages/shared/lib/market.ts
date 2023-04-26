import { activeProfile } from 'shared/lib/profile'
import Validator from 'shared/lib/validator'
import { get, writable } from 'svelte/store'
import { HistoryDataProps, MarketData, PriceData, Timeframes } from './typings/market'
import { CurrencyTypes } from './typings/currency'
import { currencies, exchangeRates } from './currency'

/**
 * Market data endpoints list
 */
export const MARKETDATA_ENDPOINTS = ['https://nodes.iota.works/api/market']

/**
 * Default timeout for a request made to an endpoint
 */
const DEFAULT_MARKETDATA_ENDPOINT_TIMEOUT = 5000

/**
 * Default interval for polling the market data
 */
const DEFAULT_MARKETDATA_POLL_INTERVAL = 300000 // 5 minutes

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
        '24h': [],
        '7d': [],
        '1m': [],
    },
    eur: {
        '1h': [],
        '24h': [],
        '7d': [],
        '1m': [],
    },
    usd: {
        '1h': [],
        '24h': [],
        '7d': [],
        '1m': [],
    },
    eth: {
        '1h': [],
        '24h': [],
        '7d': [],
        '1m': [],
    },
})

export const TIMEFRAME_MAP = {
    [HistoryDataProps.ONE_HOUR]: Timeframes.ONE_HOUR,
    [HistoryDataProps.TWENTY_FOUR_HOURS]: Timeframes.TWENTY_FOUR_HOURS,
    [HistoryDataProps.SEVEN_DAYS]: Timeframes.SEVEN_DAYS,
    [HistoryDataProps.ONE_MONTH]: Timeframes.ONE_MONTH,
}

/**
 * Poll the market data at an interval.
 */
export async function pollMarketData(): Promise<void> {
    // Load any previously stored data in case the endpoints are not working
    // these might be a bit out of date but they are better than no values at all
    try {
        const marketData = localStorage.getItem('marketData')
        if (marketData) {
            processMarketData(JSON.parse(marketData))
        }
    } catch {
        // We don't want any errors from reading or parsing to disrupt
        // the next process, just ignore any problems here
    }

    await fetchMarketData()
    /* eslint-disable @typescript-eslint/no-misused-promises */
    setInterval(async () => fetchMarketData(), DEFAULT_MARKETDATA_POLL_INTERVAL)
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
        const endpoint = MARKETDATA_ENDPOINTS[index]
        try {
            const abortController = new AbortController()
            const timerId = setTimeout(() => {
                if (abortController) {
                    abortController.abort()
                }
            }, DEFAULT_MARKETDATA_ENDPOINT_TIMEOUT)

            requestOptions.signal = abortController.signal

            const response = await fetch(endpoint, requestOptions)

            clearTimeout(timerId)

            const marketData: MarketData = await response.json()

            processMarketData(marketData)

            // Successfully retrieved and processed the market data
            // so store it in case the endpoint is down in the future
            localStorage.setItem('marketData', JSON.stringify(marketData))
            break
        } catch (err) {
            console.error(err.name === 'AbortError' ? new Error(`Could not fetch from ${endpoint}.`) : err)
        }
    }
}

function processMarketData(marketData) {
    const { isValid, payload } = new Validator().performValidation({
        type: 'MarketData',
        payload: marketData,
    })

    if (isValid) {
        const _priceData = {} as PriceData

        Object.keys(get(priceData)).forEach((currency: CurrencyTypes) => {
            if (marketData[`history-${currency}`]) {
                _priceData[currency] = marketData[`history-${currency}`].data
            }
        })

        if (marketData && marketData.currencies && marketData.rates) {
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

            void addProfileCurrencyPriceData()
        } else {
            throw new Error('Unable to retrieve the market data.')
        }
    } else {
        throw new Error(payload.error)
    }
}

export function addProfileCurrencyPriceData(): void {
    const profile = get(activeProfile)
    if (profile) {
        // get selected profile currency and add its estimated history
        const profileCurrency: string = profile.settings.currency.toLowerCase()
        if (!Object.values(CurrencyTypes.USD).includes(profileCurrency)) {
            const profileCurrencyRate: number = get(exchangeRates)[profileCurrency.toUpperCase()]
            const usdHistory = get(priceData)[CurrencyTypes.USD]
            const profileCurrencyHistory = {}
            Object.keys(usdHistory).forEach((key) => {
                const convertedProfileCurrencyHistory = usdHistory[key].map(([timestamp, value]) => [
                    timestamp,
                    (value * profileCurrencyRate).toString(),
                ])
                profileCurrencyHistory[key] = convertedProfileCurrencyHistory
            })
            priceData.update((_priceData) => ({ ..._priceData, [profileCurrency]: profileCurrencyHistory }))
        }
    }
}
