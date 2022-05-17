import { formatNumber } from '@lib/currency'
import { ITokenMetadata } from '../interfaces'
import { formatDefaultTokenAmount } from './formatDefaultTokenAmount'

export function formatBestMatchTokenAmount(amount: number, tokenMetadata: ITokenMetadata): string {
    if (tokenMetadata.useMetricPrefix) {
        // TODO: format numbers with the metric prefix
        return formatNumber(amount) + ' ' + tokenMetadata.unit
    } else {
        return formatDefaultTokenAmount(amount, tokenMetadata)
    }
}
