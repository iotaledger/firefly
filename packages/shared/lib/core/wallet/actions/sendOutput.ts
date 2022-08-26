import { selectedAccount } from '@core/account'
import { OutputTypes } from '@iota/types'
import { isTransferring } from '@lib/wallet'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'

import { Activity } from '../classes'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'
import { handleLedgerErrors } from '@core/ledger'
import { preprocessTransaction } from '../utils'

export async function sendOutput(output: OutputTypes): Promise<void> {
    try {
        isTransferring.set(true)
        const account = get(selectedAccount)
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        const processedTransaction = preprocessTransaction(transaction)
        addActivityToAccountActivitiesInAllAccountActivities(account.id, new Activity(processedTransaction, account))
        isTransferring.set(false)
        return
    } catch (err) {
        const _activeProfile = get(activeProfile)

        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerErrors(err.error)
        }

        isTransferring.set(false)
        throw err
    }
}
