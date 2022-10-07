import { IAccountState } from '@core/account'
import { IProcessedTransaction } from '@core/wallet/interfaces/processed-transaction.interface'
import { Activity } from '../../classes'

export function generateActivitiesFromProcessedTransactions(
    processedTransactions: IProcessedTransaction[],
    account: IAccountState
): Activity[] {
    return processedTransactions.map((_preparedActivity) => new Activity(_preparedActivity, account))
}
