import { selectedAccount, updateSelectedAccount } from '@core/account'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { addActivityToAccountActivitiesInAllAccountActivities, resetNewTokenTransactionDetails } from '../stores'
import { handleLedgerError } from '@core/ledger'
import { generateActivity, preprocessTransaction } from '../utils'
import { Output } from '../types'

export async function sendOutput(output: Output): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        // Reset transaction details state, since the transaction has been sent
        resetNewTokenTransactionDetails()
        const processedTransaction = await preprocessTransaction(transaction, account)
        const activity = generateActivity(processedTransaction, account)
        addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)
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
