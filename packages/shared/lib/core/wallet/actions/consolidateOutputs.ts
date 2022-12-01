import { selectedAccount } from '@core/account'
import { handleError } from '@core/error/handlers/handleError'
import { handleLedgerError } from '@core/ledger'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { addActivityToAccountActivitiesInAllAccountActivities } from '../stores'
import { generateActivity, preprocessTransaction } from '../utils'

export async function consolidateOutputs(): Promise<void> {
    const account = get(selectedAccount)
    const _activeProfile = get(activeProfile)
    try {
        const transaction = await account.consolidateOutputs(false, 2)
        const processedTransaction = preprocessTransaction(transaction, account.depositAddress)
        const activity = generateActivity(processedTransaction, account)
        addActivityToAccountActivitiesInAllAccountActivities(account.index, activity)
    } catch (err) {
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err)
        } else {
            handleError(err)
        }
    }
}
