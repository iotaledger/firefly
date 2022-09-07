import { parseCurrency } from '@lib/currency'
import { UNIT_MAP } from '@lib/units'
import { ITokenMetadata } from '../interfaces'

export function generateRawAmount(amount: string, unit: string, tokenMetadata?: ITokenMetadata): number {
    const parsedAmount = parseCurrency(amount)
    if (tokenMetadata) {
        return generateRawAmountFromMetadata(parsedAmount, unit, tokenMetadata)
    } else {
        return parsedAmount
    }
}

function generateRawAmountFromMetadata(amount: number, unit: string, tokenMetadata: ITokenMetadata): number {
    if (!tokenMetadata?.useMetricPrefix) {
        if (unit && unit === tokenMetadata?.unit) {
            return amount * 10 ** tokenMetadata?.decimals
        } else if (unit === tokenMetadata?.subunit) {
            return amount
        }
    } else if (tokenMetadata?.useMetricPrefix) {
        return amount * UNIT_MAP?.[unit?.substring(0, 1)] ?? 0
    } else {
        return amount
    }
}
