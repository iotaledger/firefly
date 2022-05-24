import { formatNumber } from '@lib/currency'
import { ITokenMetadata } from '../interfaces'
import { formatTokenAmountDefault } from './formatTokenAmountDefault'
import { getUnit, UNIT_MAP } from '@lib/units'

export function formatTokenAmountBestMatch(
    amount: number,
    tokenMetadata: ITokenMetadata,
    overrideDecimalPlaces?: number
): string {
    if (tokenMetadata?.useMetricPrefix) {
        const metricUnit = getUnit(amount)
        const maxDecimals = overrideDecimalPlaces ?? UNIT_MAP[metricUnit].dp
        const convertedAmount = amount / UNIT_MAP[metricUnit].val
        return formatNumber(convertedAmount, 0, maxDecimals, undefined, true) + ' ' + metricUnit + tokenMetadata.unit
    } else {
        return formatTokenAmountDefault(amount, tokenMetadata)
    }
}
