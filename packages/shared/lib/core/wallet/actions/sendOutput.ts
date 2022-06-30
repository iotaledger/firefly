import { selectedAccount } from '@core/account'
import { OutputTypes } from '@iota/types'
import { OutputOptions, TransactionOptions } from '@iota/wallet'
import { isTransferring } from '@lib/wallet'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'

export async function sendOutput(outputOptions: OutputOptions, output: OutputTypes): Promise<void> {
    try {
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
        return
    } catch (err) {
        isTransferring.set(false)
        throw err
    }
}
