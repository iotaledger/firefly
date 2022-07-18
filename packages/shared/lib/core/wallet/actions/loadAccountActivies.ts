import { IAccountState } from '@core/account'
import { addEmptyAccountActivitiesToAllAccountActivities } from '../stores'
import { loadAccountActivitiesFromOutputs } from './loadAccountActivitiesFromOutputs'
import { setAsyncActivitiesToClaimed } from './setAsyncActivitiesToClaimed'
import { loadAccountActivitiesFromTransactions } from './loadAccountActivitiesFromTransactions'
import { linkActivityAndClaimingTransaction } from './linkActivityAndClaimingTransaction'

export async function loadAccountActivities(account: IAccountState): Promise<void> {
    addEmptyAccountActivitiesToAllAccountActivities(account.id)
    loadAccountActivitiesFromTransactions(account)
    loadAccountActivitiesFromOutputs(account)
    await setAsyncActivitiesToClaimed(account)
    linkActivityAndClaimingTransaction(account)
}
