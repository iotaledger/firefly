import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { ActivityDirection } from '../enums'
import { allAccountActivities, updateActivity } from '../stores'

export function updateActivityAsyncStateFromTransactions(account: IAccountState): void {
    Object.keys(account.meta.transactions).forEach((transactionId) => {
        const transaction = account.meta.transactions?.[transactionId]
        const trasnactionInputs = transaction.payload.essence.inputs
        const accountActivities = get(allAccountActivities).find(
            (accountActivities) => accountActivities?.accountId === account.id
        )
        const linkedActivities = accountActivities.activities.filter((activity) =>
            trasnactionInputs.some((input) => input.transactionId === activity.transactionId && activity.isAsync)
        )
        if (linkedActivities.length > 0) {
            updateActivity({ id: transactionId, isHidden: true })
            linkedActivities.forEach((linkedActivity) => {
                if (linkedActivity.direction === ActivityDirection.Out) {
                    updateActivity({
                        id: linkedActivity.id,
                        isClaimed: true,
                        claimedDate: new Date(Number(transaction.timestamp)),
                        claimingTransactionId: transactionId,
                    })
                }
            })
        }
    })
}
