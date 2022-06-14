import { IAccountState } from '@core/account'
import { Activity } from '../classes'
import {
    addActivityToAccountActivitiesInAllAccountActivities,
    addEmptyAccountActivitiesToAllAccountActivities,
} from '../stores'
import { isActivityHiddenForAccountId } from '../stores/hidden-activities.store'

export function loadAccountActivities(account: IAccountState): void {
    addEmptyAccountActivitiesToAllAccountActivities(account.id)
    Object.keys(account.meta.transactions).forEach((transactionId) => {
        addActivityToAccountActivitiesInAllAccountActivities(
            account.id,
            new Activity().setFromTransaction(
                transactionId,
                account.meta.transactions?.[transactionId],
                account.depositAddress
            )
        )
    })
    Object.keys(account.meta.outputs).forEach((outputId) => {
        const output = account.meta.outputs?.[outputId]
        const hasTransaction = !!account?.meta?.transactions?.[output?.metadata?.transactionId]
        if (!hasTransaction) {
            if (!output.remainder) {
                const hidden = isActivityHiddenForAccountId(account.id, outputId)
                const activity = {
                    outputData: output,
                    accountAddress: account.depositAddress,
                    hidden: hidden,
                }
                addActivityToAccountActivitiesInAllAccountActivities(
                    account.id,
                    new Activity().setFromOutputData(activity)
                )
            }
        }
    })
}
