import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { ActivityDirection } from '../enums'
import { allAccountActivities, updateActivity } from '../stores'
import { claimedActivities } from '../stores/claimed-activities.store'

export function updateActivityAsyncStateFromTransactions(account: IAccountState): void {
    Object.keys(account.meta.transactions).forEach((transactionId) => {
        const transaction = account.meta.transactions?.[transactionId]
        const transactionInputs = transaction.payload.essence.inputs
        const accountActivities = get(allAccountActivities).find(
            (accountActivities) => accountActivities?.accountId === account.id
        )

        for (const activity of accountActivities.activities) {
            if (activity.direction === ActivityDirection.In) {
                const claimedActivity = get(claimedActivities)?.[account.id]?.[activity.transactionId]
                if (claimedActivity && claimedActivity.claimingTransactionId === transactionId) {
                    updateActivity(account.id, {
                        ...claimedActivity,
                        claimedDate: new Date(claimedActivity.claimedTimestamp),
                    })
                    updateActivity(account.id, { id: transactionId, isHidden: true })
                } else if (
                    transactionInputs.some(
                        (input) => input.transactionId === activity.transactionId && activity.isAsync
                    )
                ) {
                    updateActivity(account.id, {
                        id: activity.id,
                        isClaimed: true,
                        claimedDate: new Date(Number(transaction.timestamp)),
                        claimingTransactionId: transactionId,
                    })
                    updateActivity(account.id, { id: transactionId, isHidden: true })
                }
            }
        }
    })
}
