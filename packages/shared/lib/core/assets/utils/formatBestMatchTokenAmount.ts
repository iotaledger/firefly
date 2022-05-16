import { ITokenMetadata } from '../interfaces'
import { formatDefaultTokenAmount } from './formatDefaultTokenAmount'

export function formatBestMatchTokenAmount(amount: number, tokenMetadata: ITokenMetadata): string {
    if (tokenMetadata.useMetricPrefix) {
        return amount + ' ' + tokenMetadata.unit
    } else {
        return formatDefaultTokenAmount(amount, tokenMetadata)
    }
}
