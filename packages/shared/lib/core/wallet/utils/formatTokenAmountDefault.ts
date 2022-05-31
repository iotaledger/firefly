import { formatNumber } from '@lib/currency'
import { ITokenMetadata } from '../interfaces'

export function formatTokenAmountDefault(amount: number, tokenMetadata: ITokenMetadata): string {
    return (
        formatNumber(amount / 10 ** tokenMetadata?.decimals, 0, tokenMetadata?.decimals, 0, true) +
        ' ' +
        tokenMetadata.unit
    )
}
