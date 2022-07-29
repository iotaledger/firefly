import { formatNumber } from '@lib/currency'
import { getUnit, UNIT_MAP } from '@lib/units'
import { ITokenMetadata } from '../interfaces'
import { formatTokenAmountDefault } from './formatTokenAmountDefault'

export function formatTokenAmountBestMatch(
    amount: number,
    tokenMetadata: ITokenMetadata,
    overrideDecimalPlaces?: number,
    withUnit = true
): string {
    let amountWithoutUnit: string
    let amountWithUnit: string

    if (tokenMetadata?.useMetricPrefix) {
        const metricUnit = getUnit(amount)
        const maxDecimals = overrideDecimalPlaces ?? UNIT_MAP[metricUnit].dp
        const convertedAmount = amount / UNIT_MAP[metricUnit].val
        amountWithoutUnit = formatNumber(convertedAmount, 0, maxDecimals, undefined, true)
        amountWithUnit = amountWithoutUnit + ' ' + metricUnit + tokenMetadata.unit
    } else {
        amountWithoutUnit = formatTokenAmountDefault(amount, tokenMetadata)
        amountWithUnit = amountWithoutUnit + (tokenMetadata?.unit ? ' ' + tokenMetadata.unit : '')
    }

    if (withUnit) {
        return amountWithUnit
    }
    return amountWithoutUnit
}
