import { IAccountState } from '@core/account'
import { get } from 'svelte/store'
import { Activity } from '../classes'
import { ActivityDirection } from '../enums'
import {
    addActivityToAccountActivitiesInAllAccountActivities,
    addEmptyAccountActivitiesToAllAccountActivities,
    allAccountActivities,
} from '../stores'
import { loadAccountActivitiesFromOutputs } from './loadAccountActivitiesFromOutputs'
import { loadAccountActivitiesFromTransactions } from './loadAccountActivitiesFromTransactions'

export function loadAccountActivities(account: IAccountState): void {
    addEmptyAccountActivitiesToAllAccountActivities(account.id)
    loadAccountActivitiesFromTransactions(account)
    loadAccountActivitiesFromOutputs(account)

    Object.keys(account.meta.transactions).forEach((transactionId) => {
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
    })
}
