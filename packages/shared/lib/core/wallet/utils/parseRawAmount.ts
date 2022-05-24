import { getUnit, UNIT_MAP } from '@lib/units'
import { ITokenMetadata } from '../interfaces'

export function parseRawAmount(rawAmount: number, tokenMetadata: ITokenMetadata): { amount: string; unit: string } {
    let amount, unit: string
    if (tokenMetadata?.useMetricPrefix) {
        const metricUnit = getUnit(rawAmount)
        const balance = rawAmount / UNIT_MAP[metricUnit].val
        amount = balance.toString()
        unit = metricUnit + tokenMetadata.unit
    } else {
        const balance = (rawAmount ?? 0) / 10 ** tokenMetadata.decimals
        amount = balance.toString()
        unit = tokenMetadata.unit
    }
    return { amount, unit }
}
