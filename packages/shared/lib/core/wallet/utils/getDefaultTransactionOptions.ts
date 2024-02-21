import { AccountAddress, TransactionOptions } from '@iota/sdk/out/types'
import { getSelectedWallet } from '../stores'

export function getDefaultTransactionOptions(accountId?: string): TransactionOptions | undefined {
    if (!accountId) {
        const wallet = getSelectedWallet()
        if (!wallet || !wallet.mainAccountId) return
        accountId = wallet.mainAccountId
    }

    return {
        remainderValueStrategy: {
            strategy: 'CustomAddress',
            value: new AccountAddress(accountId),
        },
        allowMicroAmount: true,
    }
}
