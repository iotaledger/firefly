import { selectedAccount, updateSelectedAccount } from '@core/account'
import { OutputTypes } from '@iota/types'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'

import { Activity } from '../classes'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { addActivityToAccountActivitiesInAllAccountActivities, resetNewTokenTransactionDetails } from '../stores'
import { handleLedgerError } from '@core/ledger'
import { preprocessTransaction } from '../utils'

export async function sendOutput(output: OutputTypes): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        // Reset transaction details state, since the transaction has been sent
        resetNewTokenTransactionDetails()
        const processedTransaction = preprocessTransaction(transaction)
        addActivityToAccountActivitiesInAllAccountActivities(account.index, new Activity(processedTransaction, account))
        updateSelectedAccount({ isTransferring: false })
        return
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })
        const _activeProfile = get(activeProfile)

        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err.error)
        }

        throw err
    }
}
