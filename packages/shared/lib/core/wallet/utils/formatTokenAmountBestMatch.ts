import { formatNumber } from '@lib/currency'
import { getUnit, UNIT_MAP } from '@lib/units'
import { ITokenMetadata } from '../interfaces'
import { formatTokenAmountDefault } from './formatTokenAmountDefault'

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
