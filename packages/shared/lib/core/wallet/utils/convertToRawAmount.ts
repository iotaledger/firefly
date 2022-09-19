import Big from 'big.js'
import { parseCurrency } from '@lib/currency'
import { UNIT_MAP } from '@lib/units'
import { ITokenMetadata } from '../interfaces'

export function convertToRawAmount(amount: string, unit: string, tokenMetadata?: ITokenMetadata): Big {
    if (amount) {
        const parsedAmount = parseCurrency(amount)
        return convertToRawAmountFromMetadata(parsedAmount, unit, tokenMetadata)
    } else {
        return undefined
    }
}

function convertToRawAmountFromMetadata(amount: number, unit: string, tokenMetadata: ITokenMetadata): Big {
    if (tokenMetadata.useMetricPrefix) {
        return Big(amount * UNIT_MAP?.[unit?.substring(0, 1)] ?? 0)
    } else {
        if (unit && unit === tokenMetadata.unit) {
            const decimals = Math.min(tokenMetadata.decimals, 20)
            return Big(amount).mul(Big(10).pow(decimals))
        } else if (unit === tokenMetadata.subunit) {
            return Big(amount)
        }
    }
}
