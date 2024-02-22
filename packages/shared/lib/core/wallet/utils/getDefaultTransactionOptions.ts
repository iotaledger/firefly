import { AccountAddress, TransactionOptions } from '@iota/sdk/out/types'
import { getSelectedWallet } from '../stores'

export function getDefaultTransactionOptions(
    accountId: string | undefined = getSelectedWallet()?.mainAccountId
): TransactionOptions | undefined {
    if (!accountId) return
    return {
        remainderValueStrategy: {
            strategy: 'CustomAddress',
            value: new AccountAddress(accountId),
        },
        allowMicroAmount: true,
    }
}
