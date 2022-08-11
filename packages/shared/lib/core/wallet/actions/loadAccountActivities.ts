import { IAccountState } from '@core/account'
import { addEmptyAccountActivitiesToAllAccountActivities } from '../stores'
import { loadAccountActivitiesFromOutputs } from './loadAccountActivitiesFromOutputs'
import { setAsyncActivitiesToClaimed } from './setAsyncActivitiesToClaimed'
import { loadAccountActivitiesFromTransactions } from './loadAccountActivitiesFromTransactions'
import { linkActivityAndClaimingTransaction } from './linkActivityAndClaimingTransaction'
import { hideActivitiesForFoundries } from './hideActivitiesForFoundries'

export async function loadAccountActivities(account: IAccountState): Promise<void> {
    addEmptyAccountActivitiesToAllAccountActivities(account.id)
    await loadAccountActivitiesFromTransactions(account)
    await loadAccountActivitiesFromOutputs(account)
    hideActivitiesForFoundries(account)
    await setAsyncActivitiesToClaimed(account)
    linkActivityAndClaimingTransaction(account)
}
