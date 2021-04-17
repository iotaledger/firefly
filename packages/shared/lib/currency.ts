import { get, writable } from 'svelte/store'
import { appSettings } from './appSettings'
import { activeProfile } from './profile'

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
const DEFAULT_EXCHANGE_RATES: { [key in AvailableExchangeRates]: number } = {
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
export const formatCurrencyValue = (data: (number | string), currency: string, fiatFixed: number = 2, btcFixed: number = 7, ethFixed: number = 6,): string => {
    const parsedData: number = parseFloat(data.toString())
    switch (currency.toLowerCase()) {
        case CurrencyTypes.BTC:
            return replaceCurrencyDecimal(parsedData.toFixed(btcFixed), 'USD')
        case CurrencyTypes.ETH:
            return replaceCurrencyDecimal(parsedData.toFixed(ethFixed), 'USD')
        default:
            return replaceCurrencyDecimal(parsedData.toFixed(fiatFixed), currency)
    }
}

export const getDecimalSeparator = (currency: string | undefined = undefined) => {
    const appLanguage = get(appSettings).language

    if (!currency) {
        currency = get(activeProfile)?.settings?.currency
    }

    return Intl.NumberFormat(appLanguage, {
        style: 'currency',
        currency: currency ?? 'USD',
    })
        .formatToParts(1.1)
        .find(part => part.type === 'decimal')
        .value;
}

export const getCurrencyPosition = (): "left" | "right" => {
    const appLanguage = get(appSettings).language

    const format = Intl.NumberFormat(appLanguage, {
        style: 'currency',
        currency: 'USD'
    }).formatToParts(1.1)

    return format.findIndex(p => p.type === "currency") === 0 ? 'left' : 'right'
}

export const getGroupSeparator = (currency: string | undefined = undefined) => {
    const appLanguage = get(appSettings).language

    if (!currency) {
        currency = get(activeProfile)?.settings?.currency
    }

    return Intl.NumberFormat(appLanguage, {
        style: 'currency',
        currency: currency ?? 'USD',
    })
        .formatToParts(1111)
        .find(part => part.type === 'group')
        .value;
}


export const getAllDecimalSeparators = () => {
    return ['.', ',']
}

export const parseCurrency = (valueString: string, currency: string | undefined = undefined): number => {
    // Need to escape the character in the regex in case it is . otherwise it will replace all characters
    const v = valueString.replace(new RegExp(`\\${getGroupSeparator()}`, 'g'), '')
    return Number.parseFloat(v.replace(getDecimalSeparator(currency), '.'))
}

export const formatCurrency = (value: number, currency: string | undefined = undefined, minDecimals: number | undefined = undefined, maxDecimals: number | undefined = undefined, grouped: boolean = false): string => {
    if (Number.isNaN(value)) {
        return ''
    }

    const appLanguage = get(appSettings).language

    if (!currency) {
        currency = get(activeProfile)?.settings?.currency
    }

    const parts = Intl.NumberFormat(appLanguage, {
        style: 'currency',
        currency: currency ?? 'USD',
        currencyDisplay: 'symbol',
        minimumFractionDigits: minDecimals ?? 2,
        maximumFractionDigits: maxDecimals,
        useGrouping: grouped
    }).formatToParts(value)

    // Default symbol usage does not always include a literal beside 
    // the
    const curIndex = parts.findIndex(p => p.type === "currency")
    if (curIndex >= 0) {
        if (curIndex === 0 && parts[curIndex + 1].type !== "literal") {
            parts.splice(curIndex + 1, 0, { type: "literal", value: " " })
        } else if (parts[curIndex - 1].type !== "literal") {
            parts.splice(curIndex, 0, { type: "literal", value: " " })
        }
    }

    return parts.map(p => p.value).join('')
}

export const formatNumber = (value: number, minDecimals: number | undefined = undefined, maxDecimals: number | undefined = undefined, maxZeros: number = 2, grouped: boolean = false): string => {
    const appLanguage = get(appSettings).language

    const formatted = Intl.NumberFormat(appLanguage, {
        minimumFractionDigits: minDecimals ?? 2,
        maximumFractionDigits: maxDecimals,
        useGrouping: grouped
    }).format(value)

    return ensureZeros(formatted, maxZeros)
}

export const ensureZeros = (val: string, maxZeros: number): string => {
    const decimalSeparator = getDecimalSeparator()

    const parts = val.split(decimalSeparator)

    // If there are more then decimal places and it is just 0s remove them
    if (parts[1].length > maxZeros) {
        parts[1] = `${parts[1].slice(0, maxZeros)}${parts[1].slice(maxZeros).replace(/0+$/, '')}`
    }

    if (parts[1].length > 0) {
        return `${parts[0]}${decimalSeparator}${parts[1]}`
    } else {
        return parts[0]
    }
}

export const replaceCurrencyDecimal = (value: string, currency: string | undefined = undefined): string => {
    return value.replace('.', getDecimalSeparator(currency))
}

