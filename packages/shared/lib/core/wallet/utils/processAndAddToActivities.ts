import type { Transaction } from '@iota/wallet/out/types'

import type { IAccountState } from '@core/account/interfaces'
import { addActivitiesToAccountActivitiesInAllAccountActivities } from '../stores'

import { generateActivities, preprocessTransaction } from '.'

// We pass the account as a parameter,
// because logging out while transaction is pending,
// clears the the selectedAccount store at this point.
export async function processAndAddToActivities(transaction: Transaction, account: IAccountState): Promise<void> {
    const preprocessedTransaction = await preprocessTransaction(transaction, account)
    const activities = await generateActivities(preprocessedTransaction, account)
    addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)
}
