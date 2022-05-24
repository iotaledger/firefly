import { localize } from '@core/i18n'
import { isSoftwareProfile } from '@core/profile'
import { showAppNotification } from '@lib/notifications'
import { checkStronghold } from '@lib/stronghold'
import { isTransferring } from '@lib/wallet'
import { get } from 'svelte/store'
import { sendAmount } from './sendAmount'

export async function trySendAmount(receipientAddress: string, amount: number): Promise<void> {
    const _send = async () => {
        isTransferring.set(true)
        try {
            const transactionReceipts = await sendAmount(receipientAddress, amount)
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
        checkStronghold(_send)
    } else {
        await _send()
    }
}
