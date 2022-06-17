import { selectedAccount } from '@core/account/stores/selected-account.store'
import { get } from 'svelte/store'
import { IActivity } from '../interfaces'
import { updateActivity } from '../stores'
import { queriedActivities } from '../stores/selected-account-activities.store'

export async function claimActivity(activity: IActivity): Promise<void> {
    try {
        const results = await get(selectedAccount).collectOutputs([activity.outputId])
        if (results.length > 0) {
            updateActivity({
                id: activity.id,
                isClaimed: true,
                claimingTransactionId: results[0].transactionId,
                claimedDate: new Date(),
            })
        }
    } catch (err) {
        console.error(err)
    }
}
