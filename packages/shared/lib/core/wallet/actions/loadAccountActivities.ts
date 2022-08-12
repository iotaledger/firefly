import { IAccountState } from '@core/account'
import {
    addEmptyAccountActivitiesToAllAccountActivities,
    replaceAccountActivitiesInAllAccountActivities,
} from '../stores'
import { setAsyncActivitiesToClaimed } from './setAsyncActivitiesToClaimed'
import { linkActivityAndClaimingTransaction } from './linkActivityAndClaimingTransaction'
import { preprocessOutput, preprocessTransaction } from '../utils'
import { hideActivitiesForFoundries } from './hideActivitiesForFoundries'
import { Activity } from '../classes'
import { tryGetAndStoreAssetFromPersistedAssets } from './tryGetAndStoreAssetFromPersistedAssets'

export async function loadAccountActivities(account: IAccountState): Promise<void> {
    addEmptyAccountActivitiesToAllAccountActivities(account.id)
    const preparedActivities = []
    for (const transactionId of Object.keys(account.meta.transactions)) {
        const transaction = account.meta.transactions?.[transactionId]
        preparedActivities.push(preprocessTransaction(transaction, account))
    }
    for (const outputId of Object.keys(account.meta.outputs)) {
        const output = account.meta.outputs?.[outputId]
        if (!output.remainder) {
            const transactionId = output?.metadata?.transactionId
            const incomingTransaction = account.meta.incomingTransactions[transactionId]
            const hasTransaction = !!account?.meta?.transactions?.[transactionId]
            if (!hasTransaction) {
                preparedActivities.push(preprocessOutput(output, incomingTransaction?.[1]))
            }
        }
    }
    const activities = preparedActivities.map((_preparedActivity) => new Activity(_preparedActivity, account))
    replaceAccountActivitiesInAllAccountActivities(account.id, activities)

    const allAssetIds = [...new Set(activities.map((activity) => activity.assetId))]
    for (const assetId of allAssetIds) {
        await tryGetAndStoreAssetFromPersistedAssets(assetId)
    }

    hideActivitiesForFoundries(account)
    await setAsyncActivitiesToClaimed(account)
    linkActivityAndClaimingTransaction(account)
}
