import { selectedAccount } from '@core/account'
import { AccountAddress, TransactionOptions } from '@iota/sdk/out/types'
import { get } from 'svelte/store'

export function getDefaultTransactionOptions(address?: string): TransactionOptions | undefined {
    if (!address) {
        const account = get(selectedAccount)
        if (!account) return
        address = account.depositAddress
    }
    const value: AccountAddress = {
        address: address,
        keyIndex: 0,
        internal: false,
        used: false,
    }
    return {
        remainderValueStrategy: {
            strategy: 'CustomAddress',
            value,
        },
        allowMicroAmount: true,
    }
}
