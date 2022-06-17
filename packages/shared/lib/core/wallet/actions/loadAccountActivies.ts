import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { ActivityDirection } from '../enums'
import {
    addActivityToAccountActivitiesInAllAccountActivities,
    addEmptyAccountActivitiesToAllAccountActivities,
    allAccountActivities,
} from '../stores'

export function loadAccountActivities(account: IAccountState): void {
    addEmptyAccountActivitiesToAllAccountActivities(account.id)
    Object.keys(account.meta.transactions).forEach((transactionId) => {
        addActivityToAccountActivitiesInAllAccountActivities(
            account.id,
            new Activity().setFromTransaction(transactionId, account.meta.transactions?.[transactionId], account)
        )
    })
    Object.keys(account.meta.outputs).forEach((outputId) => {
        const output = account.meta.outputs?.[outputId]
        if (!output.remainder) {
            const hasTransaction = !!account?.meta?.transactions?.[output?.metadata?.transactionId]
            if (!hasTransaction) {
                addActivityToAccountActivitiesInAllAccountActivities(
                    account.id,
                    new Activity().setFromOutputData(output, account)
                )
            }
        }
    })

    Object.keys(account.meta.transactions).forEach((transactionId) => {
        if (account.id === '1') {
            const transaction = account.meta.transactions?.[transactionId]
            const inputs = transaction.payload.essence.inputs
            const accountActivities = get(allAccountActivities).find(
                (accountActivities) => accountActivities?.accountId === account.id
            )
            const ac = accountActivities.activities.find((act) => act.transactionId === inputs[0].transactionId)

            if (inputs.length === 1 && ac && ac.isAsync && ac.direction === ActivityDirection.In) {
                ac.claimedTransactionId = transactionId
                ac.isClaimed = true
                ac.claimedDate = new Date(Number(transaction.timestamp))
            }
        }
    })
}
