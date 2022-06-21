import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { ActivityDirection } from '../enums'
import { allAccountActivities, updateActivityByActivityId } from '../stores'
import { addClaimedActivity, claimedActivities } from '../stores/'

export function updateActivityAsyncStateFromTransactions(account: IAccountState): void {
    const accountActivities = get(allAccountActivities)[account.id]
    const activities = accountActivities.filter(
        (activity) => activity.direction === ActivityDirection.In && activity.isAsync
    )

    Object.keys(account.meta.transactions).forEach((transactionId) => {
        const transaction = account.meta.transactions?.[transactionId]
        const transactionInputs = transaction.payload.essence.inputs

        for (const activity of activities) {
            const claimedActivity = get(claimedActivities)?.[account.id]?.[activity.transactionId]
            if (claimedActivity && claimedActivity.claimingTransactionId === transactionId) {
                updateActivityByActivityId(account.id, claimedActivity.id, {
                    ...claimedActivity,
                    claimedDate: new Date(claimedActivity.claimedTimestamp),
                })
                updateActivityByActivityId(account.id, transactionId, { isHidden: true })
                break
            } else if (
                transactionInputs.some((input) => input.transactionId === activity.transactionId && activity.isAsync)
            ) {
                updateActivityByActivityId(account.id, activity.id, {
                    isClaimed: true,
                    claimedDate: new Date(Number(transaction.timestamp)),
                    claimingTransactionId: transactionId,
                })
                addClaimedActivity(account.id, activity.id, {
                    id: activity.id,
                    isClaimed: true,
                    claimedTimestamp: Number(transaction.timestamp),
                    claimingTransactionId: transactionId,
                })
                updateActivityByActivityId(account.id, transactionId, { isHidden: true })
                break
            }
        }
    })
}
