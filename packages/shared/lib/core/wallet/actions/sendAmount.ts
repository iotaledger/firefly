import { selectedAccount } from '@core/account'
import { AddressWithAmount, TransactionReceipt, TransferOptions } from '@iota/wallet'
import { get } from 'svelte/store'

export function sendAmount(receipientAddress: string, amount: number): Promise<TransactionReceipt[]> {
    const account = get(selectedAccount)
    const addressWithAmount: AddressWithAmount = { address: receipientAddress, amount: amount.toString() }
    const transferOptions: TransferOptions = {
        remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
        skipSync: false,
    }
    return account.sendAmount([addressWithAmount], transferOptions)
}
