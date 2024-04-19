import { formatNumber } from '@core/i18n'
import { TokenStandard } from '../enums'
import { TokenMetadata } from '../types'

export function formatTokenAmountPrecise(amount: number, tokenMetadata: TokenMetadata): string {
    const formattedAmount = formatNumber(amount, 0, 0, 0, true)
    if (tokenMetadata.standard === TokenStandard.BaseToken) {
        if (tokenMetadata?.useMetricPrefix) {
            return formattedAmount + ' ' + tokenMetadata?.unit
        } else {
            return formattedAmount + ' ' + tokenMetadata?.subunit
        }
    } else if (tokenMetadata.standard === TokenStandard.Mana) {
        return formattedAmount
    }
    {
        return formattedAmount + ' ' + tokenMetadata?.symbol
    }
}
