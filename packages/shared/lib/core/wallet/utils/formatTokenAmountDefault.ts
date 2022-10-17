import { formatNumber } from '@lib/currency'
import { ITokenMetadata } from '../interfaces'

export function formatTokenAmountDefault(amount: number, tokenMetadata: ITokenMetadata, unit?: string): string {
    if (amount < 0) {
        throw new Error('Amount is negative')
    } else if (isDecimal(amount)) {
        throw new Error('Amount is a decimal number')
    } else if (unit === tokenMetadata?.subunit) {
        return formatNumber(amount, 0, 0, 0, true)
    } else {
        const value = tokenMetadata?.decimals ? amount / 10 ** tokenMetadata?.decimals : amount
        return formatNumber(value, 0, tokenMetadata?.decimals ?? 0, 0, true)
    }
}

function isDecimal(amount: number): boolean {
    if (amount % 1 === 0) {
        return false
    } else {
        return true
    }
}
