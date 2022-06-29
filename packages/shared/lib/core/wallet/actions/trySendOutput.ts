import { selectedAccount } from '@core/account'
import { isSoftwareProfile } from '@core/profile'
import { OutputTypes } from '@iota/types'
import { OutputOptions, TransactionOptions } from '@iota/wallet'
import { checkStronghold } from '@lib/stronghold'
import { isTransferring } from '@lib/wallet'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'

export async function trySendOutput(outputOptions: OutputOptions, outputTypes: OutputTypes): Promise<string> {
    async function _send(): Promise<string> {
        try {
            return sendOutput(outputOptions, outputTypes)
        } catch (err) {
            return
        }
    }

    if (get(isSoftwareProfile)) {
        return checkStronghold(_send, true) as Promise<string>
    } else {
        return _send()
    }
}

async function sendOutput(outputOptions: OutputOptions, output: OutputTypes): Promise<string> {
    isTransferring.set(true)
    const account = get(selectedAccount)
    const transferOptions: TransactionOptions = {
        remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
        skipSync: false,
    }
    const { transactionId } = await account.sendOutputs([output], transferOptions)
    addActivityToAccountActivitiesInAllAccountActivities(
        account.id,
        new Activity().setNewTransaction(account, transactionId, outputOptions, output)
    )
    // TODO: fetch transaction
    isTransferring.set(false)
    return transactionId
}
