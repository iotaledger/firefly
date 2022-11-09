import { FoundryActivity, TransactionActivity } from '@core/wallet/types'
import { formatCurrency } from '@core/i18n'
import { miotaToFiat } from '@core/utils'

export function getFiatAmount(
    activity: TransactionActivity | FoundryActivity,
    fiatPrice?: number,
    exchangeRate?: number
): string {
    if (fiatPrice && exchangeRate) {
        const fiatValue = formatCurrency(miotaToFiat(activity.rawAmount, fiatPrice, exchangeRate))
        return fiatValue ? fiatValue : ''
    } else {
        return ''
    }
}
