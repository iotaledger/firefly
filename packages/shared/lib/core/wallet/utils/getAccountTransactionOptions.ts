import { AccountAddress, TransactionOptions } from '@iota/sdk/out/types'
import { getSelectedWallet } from '../stores'

export function getAccountTransactionOptions(
    accountId: string | undefined = getSelectedWallet()?.mainAccountId
): TransactionOptions | undefined {
    if (!accountId) return
    return {
        remainderValueStrategy: {
            /** The name of the strategy. */
            strategy: 'CustomAddress',
            /** Only required for `CustomAddress`. */
            value: new AccountAddress(accountId),
        },
        allowMicroAmount: true,
    }
}
