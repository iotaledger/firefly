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
