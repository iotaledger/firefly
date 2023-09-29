import { TokenMetadata } from '../types'
import { formatTokenAmountDefault } from './formatTokenAmountDefault'
import { getUnitFromTokenMetadata } from './getUnitFromTokenMetadata'

export function formatTokenAmountBestMatch(amount: number, tokenMetadata: TokenMetadata, withUnit = true): string {
    const unit = getUnitFromTokenMetadata(tokenMetadata)
    const amountWithoutUnit = !isNaN(amount) ? formatTokenAmountDefault(amount, tokenMetadata) : '0'
    const amountWithUnit = amountWithoutUnit + (unit ? ' ' + unit : '')

    return withUnit ? amountWithUnit : amountWithoutUnit
}
