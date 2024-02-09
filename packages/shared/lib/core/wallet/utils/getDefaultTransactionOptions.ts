import { AddressType, TransactionOptions } from '@iota/sdk/out/types'
import { getSelectedWallet } from '../stores'

export function getDefaultTransactionOptions(accountId?: string): TransactionOptions | undefined {
    if (!accountId) {
        const wallet = getSelectedWallet()
        if (!wallet) return
        accountId = wallet.mainAccountId
    }

    // TODO: update interface when https://github.com/iotaledger/iota-sdk/issues/1975 is merged
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any = {
        type: AddressType.Account,
        accountId,
    }
    return {
        remainderValueStrategy: {
            strategy: 'CustomAddress',
            value,
        },
        allowMicroAmount: true,
    }
}
