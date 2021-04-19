import { currencies, Currencies, CurrencyTypes, exchangeRates, ExchangeRates } from 'shared/lib/currency'
import { activeProfile } from 'shared/lib/profile'
import Validator from 'shared/lib/validator'
import { get, writable } from 'svelte/store'

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

export enum HistoryDataProps {
    ONE_HOUR = '1h',
    TWENTY_FOUR_HOURS = '24h',
    SEVEN_DAYS = '7d',
    ONE_MONTH = '1m',
}

enum Timeframes {
    ONE_HOUR = '1Hour',
    TWENTY_FOUR_HOURS = '1Day',
    SEVEN_DAYS = '1Week',
    ONE_MONTH = '1Month',
}

enum Histories {
    HISTORY_BTC = 'history-btc',
    HISTORY_ETH = 'history-eth',
    HISTORY_EUR = 'history-eur',
    HISTORY_USD = 'history-usd',
}

export type HistoryData = {
    [HistoryDataProps.ONE_HOUR]: (string | number)[]
    [HistoryDataProps.SEVEN_DAYS]: (string | number)[]
    [HistoryDataProps.TWENTY_FOUR_HOURS]: (string | number)[]
    [HistoryDataProps.ONE_MONTH]: (string | number)[]
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

export type MarketDataValidationResponse = {
    type: 'MarketData'
    payload: MarketData
}

export type PriceData = {
    [CurrencyTypes.BTC]: HistoryData
    [CurrencyTypes.EUR]: HistoryData
    [CurrencyTypes.USD]: HistoryData
    [CurrencyTypes.ETH]: HistoryData
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
        const marketData = localStorage.getItem("marketData")
        if (marketData) {
            processMarketData(JSON.parse(marketData))
        }
    } catch {
        // We don't want any errors from reading or parsing to disrupt
        // the next process, just ignore any problems here
    }

    await fetchMarketData()
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
            const timerId = setTimeout(
                () => {
                    if (abortController) {
                        abortController.abort();
                    }
                },
                DEFAULT_MARKETDATA_ENDPOINT_TIMEOUT);

            requestOptions.signal = abortController.signal;

            const response = await fetch(endpoint, requestOptions);

            clearTimeout(timerId)

            const marketData: MarketData = await response.json()

            processMarketData(marketData)

            // Successfully retrieved and processed the market data
            // so store it in case the endpoint is down in the future
            localStorage.setItem("marketData", JSON.stringify(marketData))
            break
        } catch (err) {
            console.error(err.name === "AbortError" ? new Error(`Could not fetch from ${endpoint}.`) : err)
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

        addProfileCurrencyPriceData()
    } else {
        throw new Error(payload.error)
    }
}

export async function addProfileCurrencyPriceData(): Promise<void> {
    const profile = get(activeProfile)
    if (profile) {
        // get selected profile currency and add its estimated history
        const profileCurrency: string = profile.settings.currency.toLowerCase()
        if (!Object.values(CurrencyTypes.USD).includes(profileCurrency)) {
            const profileCurrencyRate: number = get(exchangeRates)[profileCurrency.toUpperCase()]
            const usdHistory = get(priceData)[CurrencyTypes.USD]
            let profileCurrencyHistory = {};
            Object.keys(usdHistory).forEach((key) => {
                let convertedProfileCurrencyHistory = usdHistory[key].map(([timestamp, value]) => [timestamp, (value * profileCurrencyRate).toString()])
                profileCurrencyHistory[key] = convertedProfileCurrencyHistory
            })
            priceData.update((_priceData) => ({ ..._priceData, [profileCurrency]: profileCurrencyHistory }))
        }
    }
}
