import { IAccountState } from '@core/account'
import { setOutgoingAsyncActivitiesToClaimed } from '../setOutgoingAsyncActivitiesToClaimed'
import { preprocessTransactionsForAccount } from './preprocessTransactionsForAccount'
import { preprocessOutputsForAccount } from './preprocessOutputsForAccount'
import { linkTransactionsWithClaimingTransactions } from './linkTransactionsWithClaimingTransactions'
import { hideActivitiesForFoundries } from './hideActivitiesForFoundries'
import { generateActivitiesFromProcessedTransactions } from './generateActivitiesFromProcessedTransactions'
import { setAccountActivitiesInAllAccountActivities } from '@core/wallet/stores'

export async function generateAndStoreActivitiesForAccount(account: IAccountState): Promise<void> {
    // Step 1: process account transactions and outputs into processed transactions
    const processedTransactions = [
        ...(await preprocessTransactionsForAccount(account)),
        ...(await preprocessOutputsForAccount(account)),
    ]

    // Step 2: link transactions with corresponding claiming transactions
    const linkedProcessedTransactions = linkTransactionsWithClaimingTransactions(processedTransactions, account)

    // Step 3: generate activities from processed transactions
    const activities = generateActivitiesFromProcessedTransactions(linkedProcessedTransactions, account)

    // Step 4: set account activities with generated activities
    setAccountActivitiesInAllAccountActivities(account.id, activities)

    hideActivitiesForFoundries(account)
    await setOutgoingAsyncActivitiesToClaimed(account)
}
