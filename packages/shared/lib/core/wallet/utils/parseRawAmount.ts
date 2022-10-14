import { getUnit, UNIT_MAP } from '@lib/units'
import { ITokenMetadata } from '../interfaces'

export function parseRawAmount(rawAmount: number, unit: string, tokenMetadata: ITokenMetadata): number {
    let amount: number
    if (tokenMetadata) {
        if (tokenMetadata?.useMetricPrefix) {
            const metricUnit = getUnit(rawAmount)
            amount = rawAmount / UNIT_MAP[metricUnit].val
        } else {
            if (unit && unit === tokenMetadata.unit) {
                amount = (rawAmount ?? 0) / 10 ** tokenMetadata.decimals
            } else if (unit === tokenMetadata.subunit) {
                amount = rawAmount
            }
        }
    } else {
        amount = rawAmount
    }
    return amount
}
