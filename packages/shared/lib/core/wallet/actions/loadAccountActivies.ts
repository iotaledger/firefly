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
            new Activity().setFromTransaction(transactionId, account.meta.transactions?.[transactionId])
        )
    })
    Object.keys(account.meta.outputs).forEach((outputId) => {
        const output = account.meta.outputs?.[outputId]
        const claimed = !!account.meta.lockedOutputs[outputId]
        if (!output.remainder) {
            const hidden = isActivityHiddenForAccountId(account.id, outputId)
            addActivityToAccountActivitiesInAllAccountActivities(
                account.id,
                new Activity().setFromOutput(outputId, output, account.depositAddress, hidden, claimed)
            )
        }
    })
}
