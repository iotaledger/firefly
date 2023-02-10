import { selectedAccount, updateSelectedAccount } from '@core/account'
import { get } from 'svelte/store'
import { DEFAULT_TRANSACTION_OPTIONS } from '../constants'
import { resetNewTokenTransactionDetails } from '../stores'
import { Output } from '../types'
import { processAndAddToActivities } from '../utils'

export async function sendOutput(output: Output): Promise<void> {
    try {
        updateSelectedAccount({ isTransferring: true })
        const account = get(selectedAccount)
        const transaction = await account.sendOutputs([output], DEFAULT_TRANSACTION_OPTIONS)
        // Reset transaction details state, since the transaction has been sent
        resetNewTokenTransactionDetails()

        await processAndAddToActivities(transaction)
        updateSelectedAccount({ isTransferring: false })
        return
    } catch (err) {
        updateSelectedAccount({ isTransferring: false })
        throw err
    }
}
