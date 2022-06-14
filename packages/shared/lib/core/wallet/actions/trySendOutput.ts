import { selectedAccount } from '@core/account'
import { localize } from '@core/i18n'
import { isSoftwareProfile } from '@core/profile'
import { OutputTypes } from '@iota/types'
import { AddressWithAmount, OutputOptions, TransactionOptions } from '@iota/wallet'
import { showAppNotification } from '@lib/notifications'
import { checkStronghold } from '@lib/stronghold'
import { isTransferring } from '@lib/wallet'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'

export async function trySendOutput(outputOptions: OutputOptions, output: OutputTypes): Promise<void> {
    const _send = async () => {
        isTransferring.set(true)
        try {
            await sendOutput(outputOptions, output)
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

async function sendOutput(outputOptions: OutputOptions, output: OutputTypes): Promise<string> {
    const account = get(selectedAccount)
    const transferOptions: TransactionOptions = {
        remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
        skipSync: false,
    }
    const { transactionId } = await account.sendOutputs([output], transferOptions)
    addActivityToAccountActivitiesInAllAccountActivities(
        account.id,
        new Activity().setNewTransaction(transactionId, outputOptions, output)
    )
    // TODO: fetch transaction
    return transactionId
}
