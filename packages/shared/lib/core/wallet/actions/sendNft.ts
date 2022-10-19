import { selectedAccount, updateSelectedAccount } from '@core/account'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'

import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { addActivityToAccountActivitiesInAllAccountActivities, resetNewNftTransactionDetails } from '../stores'
import { handleLedgerError } from '@core/ledger'
import { generateActivity, preprocessTransaction } from '../utils'
import { INftOutput } from '@iota/types'

export async function sendNft(output: INftOutput): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        // Reset transaction details state, since the transaction has been sent
        resetNewNftTransactionDetails()
        const processedTransaction = preprocessTransaction(transaction)
        addActivityToAccountActivitiesInAllAccountActivities(
            account.index,
            generateActivity(processedTransaction, account)
        )
    } catch (err) {
        const _activeProfile = get(activeProfile)

        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err.error)
        }

        throw err
    } finally {
        updateSelectedAccount({ isTransferring: false })
    }
}
