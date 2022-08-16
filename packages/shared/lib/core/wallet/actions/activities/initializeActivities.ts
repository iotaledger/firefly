import { IAccountState } from '@core/account'
import { replaceAccountActivitiesInAllAccountActivities } from '../../stores'
import { Activity } from '../../classes'
import { IProcessedTransaction } from '@core/wallet/interfaces/processed-transaction.interface'

export function initializeActivities(processedTransactions: IProcessedTransaction[], account: IAccountState): void {
    const activities = processedTransactions.map((_preparedActivity) => new Activity(_preparedActivity, account))
    replaceAccountActivitiesInAllAccountActivities(account.id, activities)
}
