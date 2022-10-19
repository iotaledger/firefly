import { IAccountState } from '@core/account'
import { IProcessedTransaction } from '@core/wallet/interfaces/processed-transaction.interface'
import { Activity } from '@core/wallet/types'
import { generateActivity } from '@core/wallet/utils'

export function generateActivitiesFromProcessedTransactions(
    processedTransactions: IProcessedTransaction[],
    account: IAccountState
): Activity[] {
    return processedTransactions.map((_preparedActivity) => generateActivity(_preparedActivity, account))
}
