import { formatNumber } from '@lib/currency'
import { ITokenMetadata } from '../interfaces'

export function formatTokenAmountDefault(amount: number, tokenMetadata: ITokenMetadata): string {
    const value = tokenMetadata?.decimals ? amount / 10 ** tokenMetadata?.decimals : amount
    return (
        formatNumber(value, 0, tokenMetadata?.decimals ?? 0, 0, true) +
        (tokenMetadata?.unit ? ' ' + tokenMetadata.unit : '')
    )
}
