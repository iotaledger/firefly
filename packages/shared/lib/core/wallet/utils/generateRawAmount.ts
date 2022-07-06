import { UNIT_MAP } from '@lib/units'
import { ITokenMetadata } from '../interfaces'

export function generateRawAmount(amount: string, unit: string, tokenMetadata: ITokenMetadata): number {
    if (!tokenMetadata?.useMetricPrefix) {
        if (unit && unit === tokenMetadata?.unit) {
            return Number(amount) * 10 ** tokenMetadata?.decimals
        } else if (unit === tokenMetadata?.subunit) {
            return Number(amount)
        }
    } else if (tokenMetadata?.useMetricPrefix) {
        return Number(amount) * UNIT_MAP?.[unit?.substring(0, 1)] ?? 0
    } else {
        return Number(amount)
    }
}
