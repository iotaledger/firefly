import { IWalletState } from '@core/wallet/interfaces'
import { setOutgoingAsyncActivitiesToClaimed } from '../setOutgoingAsyncActivitiesToClaimed'
import { preprocessTransactionsForWallet } from './preprocessTransactionsForWallet'
import { preprocessOutputsForWallet } from './preprocessOutputsForWallet'
import { linkTransactionsWithClaimingTransactions } from './linkTransactionsWithClaimingTransactions'
import { hideActivitiesForFoundries } from './hideActivitiesForFoundries'
import { loadAssetsForAllWallets } from './loadAssetsForAllWallets'
import { ActivityBase } from '../../types'
import { selectedWalletActivities } from '../..'

export async function generateAndStoreActivitiesForWallet(wallet: IWalletState): Promise<void> {
    // Step 1: process wallet transactions and outputs into processed transactions
    const processedTransactions = [
        ...(await preprocessTransactionsForWallet(wallet)),
        ...(await preprocessOutputsForWallet(wallet)),
    ]

    // Step 2: link transactions with corresponding claiming transactions
    const linkedProcessedTransactions = linkTransactionsWithClaimingTransactions(processedTransactions, wallet)

    // Step 3: generate activities from processed transactions
    //const activities = await generateActivitiesFromProcessedTransactions(linkedProcessedTransactions, wallet)
    const activities = await Promise.all(linkedProcessedTransactions.flatMap((tx) => ActivityBase.generateActivitiesFromProcessedTransaction(wallet, tx)));
    selectedWalletActivities.set(activities.flat());
    console.log(activities)
    // TODO: Store into the store?

    hideActivitiesForFoundries(wallet)
    //await setOutgoingAsyncActivitiesToClaimed(wallet)
    //await loadAssetsForAllWallets(wallet)
}
