import { IAccountState } from '@core/account'
import { setAsyncActivitiesToClaimed } from '../setAsyncActivitiesToClaimed'
import { preprocessAccountTransactions } from './preprocessAccountTransactions'
import { preprocessAccountOutputs } from './preprocessAccountOutputs'
import { linkActivityAndClaimingTransaction } from './linkActivityAndClaimingTransaction'
import { hideActivitiesForFoundries } from './hideActivitiesForFoundries'
import { generateActivitiesFromProcessedTransactions } from './generateActivitiesFromProcessedTransactions'
import { setAccountActivitiesInAllAccountActivities } from '@core/wallet/stores'

export async function generateAndStoreActivitiesForAccount(account: IAccountState): Promise<void> {
    // Step 1: process account transactions and outputs into processed transactions
    const processedTransactions = [...preprocessAccountTransactions(account), ...preprocessAccountOutputs(account)]

    // Step 2: generate activities from processed transactions
    const activities = generateActivitiesFromProcessedTransactions(processedTransactions, account)

    // Step 3: set account activities with generated activities
    setAccountActivitiesInAllAccountActivities(account.id, activities)

    hideActivitiesForFoundries(account)
    await setAsyncActivitiesToClaimed(account)
    linkActivityAndClaimingTransaction(account)
}
