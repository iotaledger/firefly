import { Currency, formatIotaUnitBestMatch } from '@core/utils'

import { replaceCurrencyDecimal } from './replaceCurrencyDecimal'

export function formatCurrencyValue(
    data: number | string,
    currency: string,
    fiatFixed: number = 2,
    btcFixed: number = 7,
    ethFixed: number = 6
): string {
    const parsedData: number = parseFloat(data.toString())
    switch (currency.toLowerCase()) {
        case Currency.IOTA:
            return formatIotaUnitBestMatch(parsedData)
        case Currency.BTC:
            return replaceCurrencyDecimal(parsedData.toFixed(btcFixed), 'USD')
        case Currency.ETH:
            return replaceCurrencyDecimal(parsedData.toFixed(ethFixed), 'USD')
        default:
            return replaceCurrencyDecimal(parsedData.toFixed(fiatFixed), currency)
    }
}
