import { getUnit, UNIT_MAP } from '@lib/units'
import { ITokenMetadata } from '../interfaces'

export function parseRawAmount(rawAmount: number, tokenMetadata: ITokenMetadata): number {
    let amount: number
    if (tokenMetadata) {
        if (tokenMetadata?.useMetricPrefix) {
            const metricUnit = getUnit(rawAmount)
            amount = rawAmount / UNIT_MAP[metricUnit].val
        } else {
            amount = (rawAmount ?? 0) / 10 ** tokenMetadata.decimals
        }
    } else {
        amount = rawAmount
    }
    return amount
}
