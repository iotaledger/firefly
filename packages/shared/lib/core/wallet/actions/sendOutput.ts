import { selectedAccount } from '@core/account'
import { OutputTypes } from '@iota/types'
import { isTransferring } from '@lib/wallet'
import { get } from 'svelte/store'

import { Activity } from '../classes'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'

export async function sendOutput(output: OutputTypes): Promise<void> {
    try {
        isTransferring.set(true)
        const account = get(selectedAccount)
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        addActivityToAccountActivitiesInAllAccountActivities(
            account.id,
            await new Activity().setFromTransaction(transaction, account)
        )
        isTransferring.set(false)
        return
    } catch (err) {
        isTransferring.set(false)
        throw err
    }
}
