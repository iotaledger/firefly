import { selectedAccount, updateSelectedAccount } from '@core/account'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'

import { Activity } from '../classes'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { addActivityToAccountActivitiesInAllAccountActivities, resetNewNftTransactionDetails } from '../stores'
import { handleLedgerError } from '@core/ledger'
import { preprocessTransaction } from '../utils'

export async function sendNft(nftId: string, address: string): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        const transaction = await account.sendNft([{ nftId, address }], DEFAULT_TRANSACTION_OPTIONS)
        // Reset transaction details state, since the transaction has been sent
        resetNewNftTransactionDetails()
        const processedTransaction = preprocessTransaction(transaction)
        addActivityToAccountActivitiesInAllAccountActivities(account.index, new Activity(processedTransaction, account))
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
