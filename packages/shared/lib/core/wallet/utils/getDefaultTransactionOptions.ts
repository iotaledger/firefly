import { selectedAccount } from '@core/account'
import { TransactionOptions } from '@iota/sdk/out/types'
import { get } from 'svelte/store'

interface AccountAddress {
    address: string
    keyIndex: number
    internal: boolean
    used: boolean
}

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
            // TODO: Remove ts-ignore when the sdk has updated the type of string to AccountAddress
            // and remove the above interface AccountAddress and use the sdk one instead
            // @ts-ignore
            value,
        },
        allowMicroAmount: true,
    }
}
