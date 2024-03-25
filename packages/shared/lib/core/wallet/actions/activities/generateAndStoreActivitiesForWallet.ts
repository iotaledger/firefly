import { IWalletState } from '@core/wallet/interfaces'

import { setOutgoingAsyncActivitiesToClaimed } from '../setOutgoingAsyncActivitiesToClaimed'
import { preprocessTransactionsForWallet } from './preprocessTransactionsForWallet'
import { linkTransactionsWithClaimingTransactions } from './linkTransactionsWithClaimingTransactions'
import { hideActivitiesForFoundries } from './hideActivitiesForFoundries'
import { generateActivitiesFromProcessedTransactions } from './generateActivitiesFromProcessedTransactions'
import { loadAssetsForAllWallets } from './loadAssetsForAllWallets'
import { setWalletActivitiesInAllWalletActivities } from '../../stores'

export async function generateAndStoreActivitiesForWallet(wallet: IWalletState): Promise<void> {
    // Step 1: process wallet transactions and outputs into processed transactions
    const processedTransactions = [
        ...(await preprocessTransactionsForWallet(wallet)),
        // ...(await preprocessOutputsForWallet(wallet)),
    ]

    // Step 2: link transactions with corresponding claiming transactions
    const linkedProcessedTransactions = linkTransactionsWithClaimingTransactions(processedTransactions, wallet)

    // Step 3: generate activities from processed transactions
    const activities = await generateActivitiesFromProcessedTransactions(linkedProcessedTransactions, wallet)

    // Step 4: set wallet activities with generated activities
    setWalletActivitiesInAllWalletActivities(wallet.id, activities)

    hideActivitiesForFoundries(wallet)
    await setOutgoingAsyncActivitiesToClaimed(wallet)
    await loadAssetsForAllWallets(wallet)
}
