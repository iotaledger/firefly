import { FoundryActivity, TransactionActivity } from '@core/wallet/types'
import { convertToFiat, formatCurrency } from '@lib/currency'

export function getFiatAmount(
    activity: TransactionActivity | FoundryActivity,
    fiatPrice?: number,
    exchangeRate?: number
): string {
    if (fiatPrice && exchangeRate) {
        const fiatValue = formatCurrency(convertToFiat(activity.rawAmount, fiatPrice, exchangeRate))
        return fiatValue ? fiatValue : ''
    } else {
        return ''
    }
}
