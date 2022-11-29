import Big from 'big.js'

import { parseCurrency } from '@core/i18n'
import { IOTA_UNIT_MAP } from '@core/utils'

import { ITokenMetadata } from '../interfaces'
import { MAX_SUPPORTED_DECIMALS } from '../constants/max-supported-decimals.constants'

export function convertToRawAmount(amount: string, unit: string, tokenMetadata: ITokenMetadata): Big {
    if (amount) {
        const parsedAmount = parseCurrency(amount)
        return convertToRawAmountFromMetadata(parsedAmount, unit, tokenMetadata)
    } else {
        return undefined
    }
}

function convertToRawAmountFromMetadata(amount: number, unit: string, tokenMetadata: ITokenMetadata): Big {
    if (tokenMetadata.useMetricPrefix) {
        return Big(amount * IOTA_UNIT_MAP?.[unit?.substring(0, 1)] ?? 0)
    } else {
        if (unit && unit === tokenMetadata.unit) {
            const decimals = Math.min(tokenMetadata.decimals, MAX_SUPPORTED_DECIMALS)
            return Big(amount).mul(Big(10).pow(decimals))
        } else if (unit === tokenMetadata.subunit) {
            return Big(amount)
        }
    }
}
