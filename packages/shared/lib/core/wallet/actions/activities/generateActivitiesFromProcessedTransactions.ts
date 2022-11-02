import { IAccountState } from '@core/account'
import { IProcessedTransaction } from '@core/wallet/interfaces/processed-transaction.interface'
import { Activity } from '@core/wallet/types'
import { generateActivity } from '@core/wallet/utils'

export function generateActivitiesFromProcessedTransactions(
    processedTransactions: IProcessedTransaction[],
    account: IAccountState
): Activity[] {
    const activities: Activity[] = []
    for (const _preparedActivity of processedTransactions) {
        try {
            const activity = generateActivity(_preparedActivity, account)
            activities.push(activity)
        } catch (error) {
            console.error(error)
        }
    }
    return activities
}
