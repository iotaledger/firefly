import { IAccountState } from '@core/account'
import { addEmptyAccountActivitiesToAllAccountActivities } from '../stores'
import { loadAccountActivitiesFromOutputs } from './loadAccountActivitiesFromOutputs'
import { loadAccountActivitiesFromTransactions } from './loadAccountActivitiesFromTransactions'
import { updateActivityAsyncStateFromTransactions } from './'

export function loadAccountActivities(account: IAccountState): void {
    addEmptyAccountActivitiesToAllAccountActivities(account.id)
    loadAccountActivitiesFromTransactions(account)
    loadAccountActivitiesFromOutputs(account)
    updateActivityAsyncStateFromTransactions(account)
}
