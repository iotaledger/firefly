import { Bip44Address, TransactionOptions } from '@iota/sdk/out/types'
import { getSelectedWallet } from '../stores'

export function getDefaultTransactionOptions(address?: string): TransactionOptions | undefined {
    if (!address) {
        const wallet = getSelectedWallet();
        if (!wallet) return
        address = wallet.depositAddress
    }
    const value: Bip44Address = {
        address: address,
        keyIndex: 0,
        internal: false,
    }
    return {
        remainderValueStrategy: {
            strategy: 'CustomAddress',
            value,
        },
        allowMicroAmount: true,
    }
}
