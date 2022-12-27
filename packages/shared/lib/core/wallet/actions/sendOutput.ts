import { selectedAccount, updateSelectedAccount } from '@core/account'
import { handleLedgerError } from '@core/ledger'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { addActivitiesToAccountActivitiesInAllAccountActivities, resetNewTokenTransactionDetails } from '../stores'
import { Output } from '../types'
import { generateActivities, preprocessTransaction } from '../utils'

export async function sendOutput(output: Output): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        // Reset transaction details state, since the transaction has been sent
        resetNewTokenTransactionDetails()
        const processedTransaction = await preprocessTransaction(transaction, account)
        const activities = generateActivities(processedTransaction, account)
        addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)
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
