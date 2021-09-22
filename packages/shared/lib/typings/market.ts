import { Currencies, CurrencyTypes, ExchangeRates } from './currency'

export enum HistoryDataProps {
    ONE_HOUR = '1h',
    TWENTY_FOUR_HOURS = '24h',
    SEVEN_DAYS = '7d',
    ONE_MONTH = '1m',
}

export enum Timeframes {
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

export type MarketData = {
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
