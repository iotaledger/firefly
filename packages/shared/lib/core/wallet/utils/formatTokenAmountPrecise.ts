import { formatNumber } from '@core/i18n'

import { ITokenMetadata } from '../interfaces'

export function formatTokenAmountPrecise(amount: number, tokenMetadata: ITokenMetadata): string {
    const formattedAmount = formatNumber(amount, 0, 0, 0, true)
    if (tokenMetadata?.useMetricPrefix) {
        return formattedAmount + ' ' + tokenMetadata?.unit
    } else {
        return formattedAmount + ' ' + tokenMetadata?.subunit
    }
}
