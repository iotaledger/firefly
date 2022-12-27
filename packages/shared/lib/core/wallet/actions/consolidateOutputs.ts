import { selectedAccount } from '@core/account'
import { handleError } from '@core/error/handlers/handleError'
import { handleLedgerError } from '@core/ledger'
import { activeProfile, ProfileType } from '@core/profile'
import { get } from 'svelte/store'
import { addActivitiesToAccountActivitiesInAllAccountActivities } from '../stores'
import { generateActivities, preprocessTransaction } from '../utils'

export async function consolidateOutputs(): Promise<void> {
    const account = get(selectedAccount)
    const _activeProfile = get(activeProfile)
    try {
        const transaction = await account.consolidateOutputs(false, 2)
        const processedTransaction = await preprocessTransaction(transaction, account)
        const activities = generateActivities(processedTransaction, account)
        addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)
    } catch (err) {
        if (_activeProfile.type === ProfileType.Ledger) {
            handleLedgerError(err)
        } else {
            handleError(err)
        }
    }
}
