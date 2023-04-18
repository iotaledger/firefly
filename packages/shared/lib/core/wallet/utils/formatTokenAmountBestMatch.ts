import { formatNumber } from '@core/i18n'
import { getIotaUnit, IOTA_UNIT_MAP } from '@core/utils'

import { TokenMetadata } from '../types'
import { formatTokenAmountDefault } from './formatTokenAmountDefault'
import { TokenStandard } from '../enums'
import { getUnitFromTokenMetadata } from './getUnitFromTokenMetadata'

export function formatTokenAmountBestMatch(
    amount: number,
    tokenMetadata: TokenMetadata,
    overrideDecimalPlaces?: number,
    withUnit = true
): string {
    const isBaseToken = tokenMetadata?.standard === TokenStandard.BaseToken

    let amountWithoutUnit: string
    let amountWithUnit: string

    if (isBaseToken && tokenMetadata?.useMetricPrefix) {
        const metricUnit = getIotaUnit(amount)
        const maxDecimals = overrideDecimalPlaces ?? IOTA_UNIT_MAP[metricUnit].decimalPlaces
        const convertedAmount = amount / IOTA_UNIT_MAP[metricUnit].value
        amountWithoutUnit = formatNumber(convertedAmount, 0, maxDecimals, undefined, true)
        amountWithUnit = amountWithoutUnit + ' ' + metricUnit + tokenMetadata.unit
    } else {
        const unit = getUnitFromTokenMetadata(tokenMetadata)
        amountWithoutUnit = !isNaN(amount) ? formatTokenAmountDefault(amount, tokenMetadata) : '0'
        amountWithUnit = amountWithoutUnit + (unit ? ' ' + unit : '')
    }

    return withUnit ? amountWithUnit : amountWithoutUnit
}
