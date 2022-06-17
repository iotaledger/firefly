import { get } from 'svelte/store'
import { allAccountActivities, claimedActivities, updateActivity } from '../stores'

export function updateActivitiesWithClaimedTransactionInfo(accountId: string): void {
    const accountActivities = get(allAccountActivities).find(
        (accountActivities) => accountActivities?.accountId === accountId
    )

    for (const activity of accountActivities.activities) {
        const claimedActivity = get(claimedActivities)[accountId]?.[activity.transactionId]
        if (claimedActivity) {
            updateActivity({
                ...claimedActivity,
                id: activity.id,
                claimedDate: new Date(claimedActivity.claimedTimestamp),
            })
        }
    }
}
