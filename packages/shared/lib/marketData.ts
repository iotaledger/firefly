import { writable, get } from 'svelte/store'

/**
 * Market data endpoints list
 */
export const MARKETDATA_ENDPOINTS = [
    'https://nodes.iota.works/api/market',
    'https://iota-node-api.now.sh/api/market',
    'https://iota.dance/api/market',
];

/**
 * Default timeout for a request made to an endpoint
 */
const DEFAULT_MARKETDATA_ENDPOINT_TIMEOUT = 5000;

/**
 * Default exchange rates
 */
const DEFAULT_EXCHANGE_RATES = {
    USD: 1,
    GBP: 1,
    EUR: 1,
    AUD: 1,
    BGN: 1,
    BRL: 1,
    CAD: 1,
    CHF: 1,
    CNY: 1,
    CZK: 1,
    DKK: 1,
    HKD: 1,
    HRK: 1,
    HUF: 1,
    IDR: 1,
    ILS: 1,
    INR: 1,
    ISK: 1,
    JPY: 1,
    KRW: 1,
    MXN: 1,
    MYR: 1,
    NOK: 1,
    NZD: 1,
    PHP: 1,
    PLN: 1,
    RON: 1,
    RUB: 1,
    SEK: 1,
    SGD: 1,
    THB: 1,
    TRY: 1,
    ZAR: 1,
};

enum CurrencyTypes {
    BTC = 'btc',
    ETH = 'eth',
    EUR = 'eur',
    GBP = 'gbp',
    USD = 'usd'
};

enum HistoryDataProps {
    ONE_HOUR = '1h',
    ONE_MINUTE = '1m',
    SEVEN_DAYS = '7d',
    TWENTY_FOUR_HOURS = '24h'
}

enum Histories {
    HISTORY_BTC = 'history-btc',
    HISTORY_ETH = 'history-eth',
    HISTORY_EUR = 'history-eur',
    HISTORY_USD = 'history-usd'
}

type Currencies = {
    [CurrencyTypes.BTC]: number;
    [CurrencyTypes.ETH]: number;
    [CurrencyTypes.EUR]: number;
    [CurrencyTypes.GBP]: number;
    [CurrencyTypes.USD]: number;
};

type HistoryData = {
    [HistoryDataProps.ONE_HOUR]: (string | number)[];
    [HistoryDataProps.ONE_MINUTE]: (string | number)[];
    [HistoryDataProps.SEVEN_DAYS]: (string | number)[];
    [HistoryDataProps.TWENTY_FOUR_HOURS]: (string | number)[];
};

type HistoryBTC = {
    currency: CurrencyTypes.BTC,
    data: HistoryData;
};

type HistoryETH = {
    currency: CurrencyTypes.ETH,
    data: HistoryData;
};

type HistoryEUR = {
    currency: CurrencyTypes.EUR,
    data: HistoryData;
};

type HistoryUSD = {
    currency: CurrencyTypes.USD,
    data: HistoryData;
};

type Market = {
    usd: number;
    usd_24h_change: number;
    usd_24h_vol: number;
    usd_market_cap: number;
}

type Rates = {
    AUD: number;
    BGN: number;
    BRL: number;
    CAD: number;
    CHF: number;
    CNY: number;
    CZK: number;
    DKK: number;
    EUR: number;
    GBP: number;
    HKD: number;
    HRK: number;
    HUF: number;
    IDR: number;
    ILS: number;
    INR: number;
    ISK: number;
    JPY: number;
    KRW: number;
    MXN: number;
    MYR: number;
    NOK: number;
    NZD: number;
    PHP: number;
    PLN: number;
    RON: number;
    RUB: number;
    SEK: number;
    SGD: number;
    THB: number;
    TRY: number;
    USD: number;
    ZAR: number;
};

type MarketData = {
    currencies: Currencies;
    market: Market;
    rates: Rates;
    [Histories.HISTORY_BTC]: HistoryBTC;
    [Histories.HISTORY_ETH]: HistoryETH,
    [Histories.HISTORY_EUR]: HistoryEUR,
    [Histories.HISTORY_USD]: HistoryUSD,
};

type PriceData = {
    [CurrencyTypes.BTC]: HistoryData;
    [CurrencyTypes.EUR]: HistoryData;
    [CurrencyTypes.USD]: HistoryData;
    [CurrencyTypes.ETH]: HistoryData;
};

/**
 * Exchange rates
 */
export const rates = writable<Rates>(DEFAULT_EXCHANGE_RATES);

/**
 * Market cap
 */
export const mcap = writable<number>(0);

/**
 * Total amount traded over twenty four hours
 */
export const volume = writable<number>(0);

/**
 * Percentage of change in IOTA price over twenty four hours
 */
export const change24h = writable<number>(0);

/**
 * Price data
 */
export const priceData = writable<PriceData>({
    btc: {
        '1h': [],
        '1m': [],
        '24h': [],
        '7d': []
    },
    eur: {
        '1h': [],
        '1m': [],
        '24h': [],
        '7d': []
    },
    usd: {
        '1h': [],
        '1m': [],
        '24h': [],
        '7d': []
    },
    eth: {
        '1h': [],
        '1m': [],
        '24h': [],
        '7d': []
    }
})

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
    };

    for (let index = 0; index < MARKETDATA_ENDPOINTS.length; index++) {
        try {
            const endpoint = MARKETDATA_ENDPOINTS[index];

            const response: any = await Promise.race([
                fetch(endpoint, requestOptions),
                new Promise((_, reject) => {
                    setTimeout(() => reject(new Error(`Could not fetch from ${endpoint}.`)), DEFAULT_MARKETDATA_ENDPOINT_TIMEOUT);
                }),
            ]);

            const marketData: MarketData = await response.json();

            const _priceData = {} as PriceData;

            Object.keys(get(priceData)).forEach((currency: CurrencyTypes) => {
                if (marketData[`history-${currency}`]) {
                    _priceData[currency] = marketData[`history-${currency}`].data;
                }
            });
            
            // Store price data
            priceData.set(_priceData);

            // Store exchange rates in store
            rates.set(marketData.rates);

            // Store market statistics
            mcap.set(marketData.market.usd_market_cap);
            volume.set(marketData.market.usd_24h_vol);
            change24h.set(marketData.market.usd_24h_change);


            break;
        } catch (err) {
            console.error(err);
        }
    }
};
