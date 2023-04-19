import Big from 'big.js'

import { parseCurrency } from '@core/i18n'
import { IOTA_UNIT_MAP } from '@core/utils'

import { TokenMetadata } from '../types'
import { MAX_SUPPORTED_DECIMALS } from '../constants/max-supported-decimals.constants'
import { TokenStandard } from '../enums'

export function convertToRawAmount(amount: string, tokenMetadata: TokenMetadata, unit?: string): Big {
    if (amount) {
        const parsedAmount = parseCurrency(amount)
        return convertToRawAmountFromMetadata(parsedAmount, tokenMetadata, unit)
    } else {
        return undefined
    }
}

function convertToRawAmountFromMetadata(amount: number, tokenMetadata: TokenMetadata, selectedUnit: string): Big {
    if (tokenMetadata?.standard === TokenStandard.BaseToken) {
        if (tokenMetadata.useMetricPrefix) {
            return Big(amount).mul(Big(10).pow(IOTA_UNIT_MAP?.[selectedUnit?.substring(0, 1)]?.decimalPlaces ?? 0))
        } else {
            // returns undefined if selectedUnit is not provided or doesn't match unit or subunit
            if (selectedUnit === tokenMetadata.unit) {
                const decimals = Math.min(tokenMetadata.decimals, MAX_SUPPORTED_DECIMALS)
                return Big(amount).mul(Big(10).pow(decimals))
            } else if (selectedUnit === tokenMetadata.subunit) {
                return Big(amount)
            }
        }
    } else if (tokenMetadata?.standard === TokenStandard.Irc30) {
        const decimals = Math.min(tokenMetadata.decimals, MAX_SUPPORTED_DECIMALS)
        return Big(amount).mul(Big(10).pow(decimals))
    } else {
        throw new Error('convertToRawAmountFromMetadata: Invalid token standard')
    }
}
