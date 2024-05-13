import { TransactionOptions } from '@iota/sdk/out/types'
import { getSelectedWallet } from '../stores'

export function getDefaultTransactionOptions(
    accountId: string | undefined = getSelectedWallet()?.mainAccountId
): TransactionOptions | undefined {
    if (!accountId) return
    return {
        remainderValueStrategy: {
            /** The name of the strategy. */
            strategy: 'ReuseAddress',
            /** Only required for `CustomAddress`. */
            value: null,
        },
        allowMicroAmount: true,
        issuerId: accountId,
    }
}
