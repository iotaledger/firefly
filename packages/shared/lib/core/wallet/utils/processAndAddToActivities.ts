import { get } from 'svelte/store'
import type { Transaction } from '@iota/wallet/out/types'

import { selectedAccount } from '@core/account/stores'
import { addActivitiesToAccountActivitiesInAllAccountActivities } from '../stores'

import { generateActivities, preprocessTransaction } from '.'

export async function processAndAddToActivities(transaction: Transaction): Promise<void> {
    const account = get(selectedAccount)
    const preprocessedTransaction = await preprocessTransaction(transaction, account)
    const activities = generateActivities(preprocessedTransaction, account)
    addActivitiesToAccountActivitiesInAllAccountActivities(account.index, activities)
}
