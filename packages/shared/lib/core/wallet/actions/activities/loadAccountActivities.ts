import { IAccountState } from '@core/account'
import { addEmptyAccountActivitiesToAllAccountActivities } from '../../stores'
import { setAsyncActivitiesToClaimed } from '../setAsyncActivitiesToClaimed'
import { preprocessTransactions } from './preprocessTransactions'
import { preprocessOutputs } from './preprocessOutputs'
import { linkActivityAndClaimingTransaction } from './linkActivityAndClaimingTransaction'
import { hideActivitiesForFoundries } from './hideActivitiesForFoundries'
import { initializeActivities } from './initializeActivities'

export async function loadAccountActivities(account: IAccountState): Promise<void> {
    addEmptyAccountActivitiesToAllAccountActivities(account.id)

    const processedTransactions = preprocessTransactions(account)
    const processedOutputs = preprocessOutputs(account)

    initializeActivities([...processedTransactions, ...processedOutputs], account)

    hideActivitiesForFoundries(account)
    await setAsyncActivitiesToClaimed(account)
    linkActivityAndClaimingTransaction(account)
}
