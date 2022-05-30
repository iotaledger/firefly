import { selectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { isSoftwareProfile } from '@core/profile'
import { AddressWithAmount, TransactionResult, TransactionOptions } from '@iota/wallet'
import { showAppNotification } from '@lib/notifications'
import { checkStronghold } from '@lib/stronghold'
import { isTransferring } from '@lib/wallet'
import { get } from 'svelte/store'

export async function trySend(recipientAddress: string, amount: number): Promise<void> {
    const _send = async () => {
        isTransferring.set(true)
        try {
            await sendAmount(recipientAddress, amount)
            isTransferring.set(false)
        } catch (err) {
            console.error(err)
            isTransferring.set(false)
            showAppNotification({
                type: 'error',
                message: localize(err.error),
            })
        }
    }

    if (get(isSoftwareProfile)) {
        await checkStronghold(_send)
    } else {
        await _send()
    }
}

function sendAmount(recipientAddress: string, amount: number): Promise<TransactionResult[]> {
    const account = get(selectedAccount)
    const addressWithAmount: AddressWithAmount = { address: recipientAddress, amount: amount.toString() }
    const transferOptions: TransactionOptions = {
        remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
        skipSync: false,
    }
    return account.sendAmount([addressWithAmount], transferOptions)
}
