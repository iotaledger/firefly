import { selectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { isSoftwareProfile } from '@core/profile'
import { AddressWithAmount, TransactionOptions } from '@iota/wallet'
import { showAppNotification } from '@lib/notifications'
import { checkStronghold } from '@lib/stronghold'
import { isTransferring } from '@lib/wallet'
import { get } from 'svelte/store'

export async function trySend(recipientAddress: string, amount: number): Promise<void> {
    const _send = async () => {
        isTransferring.set(true)
        try {
            await sendAmount(recipientAddress, amount)
        } catch (err) {
            console.error(err)
            showAppNotification({
                type: 'error',
                message: localize(err.error),
            })
        }
        isTransferring.set(false)
    }

    if (get(isSoftwareProfile)) {
        await checkStronghold(_send)
    } else {
        await _send()
    }
}

async function sendAmount(recipientAddress: string, amount: number): Promise<string> {
    const account = get(selectedAccount)
    const addressWithAmount: AddressWithAmount = { address: recipientAddress, amount: amount.toString() }
    const transferOptions: TransactionOptions = {
        remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
        skipSync: false,
    }
    const { transactionId } = await account.sendAmount([addressWithAmount], transferOptions)
    // TODO: fetch transaction
    return transactionId
}
