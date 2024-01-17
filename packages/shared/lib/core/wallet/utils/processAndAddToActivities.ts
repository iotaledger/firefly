import type { Transaction } from '@iota/sdk/out/types'

import { addActivitiesToWalletActivitiesInAllWalletActivities } from '../stores'

import { generateActivities, preprocessOutgoingTransaction } from '.'
import { IWalletState } from '../interfaces'

// We pass the wallet as a parameter,
// because logging out while transaction is pending,
// clears the the selectedWallet store at this point.
export async function processAndAddToActivities(transaction: Transaction, wallet: IWalletState): Promise<void> {
    const preprocessedTransaction = await preprocessOutgoingTransaction(transaction, wallet)
    const activities = await generateActivities(preprocessedTransaction, wallet)
    addActivitiesToWalletActivitiesInAllWalletActivities(wallet.id, activities)
}
