import { get, writable } from 'svelte/store'
import { activeProfile } from 'shared/lib/profile'

export enum CurrencyTypes {
    BTC = 'btc',
    ETH = 'eth',
    EUR = 'eur',
    USD = 'usd',
}

export type Currencies = {
    [CurrencyTypes.BTC]: number
    [CurrencyTypes.ETH]: number
    [CurrencyTypes.EUR]: number
    [CurrencyTypes.USD]: number
}

export enum AvailableExchangeRates {
    AUD = 'AUD',
    BGN = 'BGN',
    BRL = 'BRL',
    CAD = 'CAD',
    CHF = 'CHF',
    CNY = 'CNY',
    CZK = 'CZK',
    DKK = 'DKK',
    EUR = 'EUR',
    GBP = 'GBP',
    HKD = 'HKD',
    HRK = 'HRK',
    HUF = 'HUF',
    IDR = 'IDR',
    ILS = 'ILS',
    INR = 'INR',
    ISK = 'ISK',
    JPY = 'JPY',
    KRW = 'KRW',
    MXN = 'MXN',
    MYR = 'MYR',
    NOK = 'NOK',
    NZD = 'NZD',
    PHP = 'PHP',
    PLN = 'PLN',
    RON = 'RON',
    RUB = 'RUB',
    SEK = 'SEK',
    SGD = 'SGD',
    THB = 'THB',
    TRY = 'TRY',
    USD = 'USD',
    ZAR = 'ZAR',
}

export type ExchangeRates = {
    [AvailableExchangeRates.AUD]: number
    [AvailableExchangeRates.BGN]: number
    [AvailableExchangeRates.BRL]: number
    [AvailableExchangeRates.CAD]: number
    [AvailableExchangeRates.CHF]: number
    [AvailableExchangeRates.CNY]: number
    [AvailableExchangeRates.CZK]: number
    [AvailableExchangeRates.DKK]: number
    [AvailableExchangeRates.EUR]: number
    [AvailableExchangeRates.GBP]: number
    [AvailableExchangeRates.HKD]: number
    [AvailableExchangeRates.HRK]: number
    [AvailableExchangeRates.HUF]: number
    [AvailableExchangeRates.IDR]: number
    [AvailableExchangeRates.ILS]: number
    [AvailableExchangeRates.INR]: number
    [AvailableExchangeRates.ISK]: number
    [AvailableExchangeRates.JPY]: number
    [AvailableExchangeRates.KRW]: number
    [AvailableExchangeRates.MXN]: number
    [AvailableExchangeRates.MYR]: number
    [AvailableExchangeRates.NOK]: number
    [AvailableExchangeRates.NZD]: number
    [AvailableExchangeRates.PHP]: number
    [AvailableExchangeRates.PLN]: number
    [AvailableExchangeRates.RON]: number
    [AvailableExchangeRates.RUB]: number
    [AvailableExchangeRates.SEK]: number
    [AvailableExchangeRates.SGD]: number
    [AvailableExchangeRates.THB]: number
    [AvailableExchangeRates.TRY]: number
    [AvailableExchangeRates.USD]: number
    [AvailableExchangeRates.ZAR]: number
}

/**
 * Default exchange rates
 */
const DEFAULT_EXCHANGE_RATES: { [key in AvailableExchangeRates ]: number} = {
    [AvailableExchangeRates.AUD]: 1,
    [AvailableExchangeRates.BGN]: 1,
    [AvailableExchangeRates.BRL]: 1,
    [AvailableExchangeRates.CAD]: 1,
    [AvailableExchangeRates.CHF]: 1,
    [AvailableExchangeRates.CNY]: 1,
    [AvailableExchangeRates.CZK]: 1,
    [AvailableExchangeRates.DKK]: 1,
    [AvailableExchangeRates.EUR]: 1,
    [AvailableExchangeRates.GBP]: 1,
    [AvailableExchangeRates.HKD]: 1,
    [AvailableExchangeRates.HRK]: 1,
    [AvailableExchangeRates.HUF]: 1,
    [AvailableExchangeRates.IDR]: 1,
    [AvailableExchangeRates.ILS]: 1,
    [AvailableExchangeRates.INR]: 1,
    [AvailableExchangeRates.ISK]: 1,
    [AvailableExchangeRates.JPY]: 1,
    [AvailableExchangeRates.KRW]: 1,
    [AvailableExchangeRates.MXN]: 1,
    [AvailableExchangeRates.MYR]: 1,
    [AvailableExchangeRates.NOK]: 1,
    [AvailableExchangeRates.NZD]: 1,
    [AvailableExchangeRates.PHP]: 1,
    [AvailableExchangeRates.PLN]: 1,
    [AvailableExchangeRates.RON]: 1,
    [AvailableExchangeRates.RUB]: 1,
    [AvailableExchangeRates.SEK]: 1,
    [AvailableExchangeRates.SGD]: 1,
    [AvailableExchangeRates.THB]: 1,
    [AvailableExchangeRates.TRY]: 1,
    [AvailableExchangeRates.USD]: 1,
    [AvailableExchangeRates.ZAR]: 1,
}

/**
 * Currency formats
 */
 const CURRENCY_FORMATS: { [key in AvailableExchangeRates ]: { decimalSeparator: string }} = {
    [AvailableExchangeRates.AUD]: { decimalSeparator: '.' },
    [AvailableExchangeRates.BGN]: { decimalSeparator: ',' },
    [AvailableExchangeRates.BRL]: { decimalSeparator: ',' },
    [AvailableExchangeRates.CAD]: { decimalSeparator: '.' },
    [AvailableExchangeRates.CHF]: { decimalSeparator: '.' },
    [AvailableExchangeRates.CNY]: { decimalSeparator: '.' },
    [AvailableExchangeRates.CZK]: { decimalSeparator: ',' },
    [AvailableExchangeRates.DKK]: { decimalSeparator: ',' },
    [AvailableExchangeRates.EUR]: { decimalSeparator: ',' },
    [AvailableExchangeRates.GBP]: { decimalSeparator: '.' },
    [AvailableExchangeRates.HKD]: { decimalSeparator: '.' },
    [AvailableExchangeRates.HRK]: { decimalSeparator: ',' },
    [AvailableExchangeRates.HUF]: { decimalSeparator: ',' },
    [AvailableExchangeRates.IDR]: { decimalSeparator: ',' },
    [AvailableExchangeRates.ILS]: { decimalSeparator: '.' },
    [AvailableExchangeRates.INR]: { decimalSeparator: '.' },
    [AvailableExchangeRates.ISK]: { decimalSeparator: ',' },
    [AvailableExchangeRates.JPY]: { decimalSeparator: '.' },
    [AvailableExchangeRates.KRW]: { decimalSeparator: '.' },
    [AvailableExchangeRates.MXN]: { decimalSeparator: '.' },
    [AvailableExchangeRates.MYR]: { decimalSeparator: '.' },
    [AvailableExchangeRates.NOK]: { decimalSeparator: ',' },
    [AvailableExchangeRates.NZD]: { decimalSeparator: '.' },
    [AvailableExchangeRates.PHP]: { decimalSeparator: '.' },
    [AvailableExchangeRates.PLN]: { decimalSeparator: ',' },
    [AvailableExchangeRates.RON]: { decimalSeparator: ',' },
    [AvailableExchangeRates.RUB]: { decimalSeparator: ',' },
    [AvailableExchangeRates.SEK]: { decimalSeparator: ',' },
    [AvailableExchangeRates.SGD]: { decimalSeparator: '.' },
    [AvailableExchangeRates.THB]: { decimalSeparator: '.' },
    [AvailableExchangeRates.TRY]: { decimalSeparator: ',' },
    [AvailableExchangeRates.USD]: { decimalSeparator: '.' },
    [AvailableExchangeRates.ZAR]: { decimalSeparator: ',' },
}

/**
 * Exchange rates
 */
export const exchangeRates = writable<ExchangeRates>(DEFAULT_EXCHANGE_RATES)

/** Currencies with price */
export const currencies = writable<Currencies>({} as Currencies)

/**
 * Converts iotas to fiat equivalent
 *
 * @method convertToFiat
 *
 * @param {number} amount
 * @param {number} usdPrice
 * @param {number} conversionRate
 *
 * @returns {number}
 */
export const convertToFiat = (amount: number, usdPrice: number, conversionRate: number): number => {
    return +(((amount * usdPrice) / 1000000) * conversionRate).toFixed(2)
}

/**
 * Converts to appropriate decimal places for a given currency
 *
 * @method formatCurrencyValue
 *
 * @param {number | string} data
 * @param {string} currency
 *
 * @returns {string}
 */
export const formatCurrencyValue = (data: (number | string), currency: string, fiatFixed: number = 2, btcFixed: number = 7, ethFixed: number = 6, ): string => {
    const parsedData: number = parseFloat(data.toString())
    switch(currency.toLowerCase()) {
        case CurrencyTypes.BTC:
            return replaceCurrencyDecimal(parsedData.toFixed(btcFixed))
        case CurrencyTypes.ETH:
            return replaceCurrencyDecimal(parsedData.toFixed(ethFixed))
        default:
            return replaceCurrencyDecimal(parsedData.toFixed(fiatFixed))
    }
}

export const getDecimalSeparator = () => {
    const profileCurrency = get(activeProfile)?.settings.currency
    return CURRENCY_FORMATS[profileCurrency ?? AvailableExchangeRates.USD].decimalSeparator
}

export const getAllDecimalSeparators = () => {
    return ['.', ',']
}

export const parseCurrency = (valueString: string): number => {
    return Number.parseFloat(valueString.replace(getDecimalSeparator(), '.'))
}

export const formatCurrency = (value: number, maxDecimals: number = 2): string => {
    return Number(value.toFixed(maxDecimals)).toString().replace('.', getDecimalSeparator())
}

export const replaceCurrencyDecimal = (value: string): string => {
    return value.replace('.', getDecimalSeparator())
}

