import { IAccountState } from '@core/account'
import { IProcessedTransaction } from '@core/wallet/interfaces/processed-transaction.interface'
import { Activity } from '@core/wallet/types'
import { generateActivities } from '@core/wallet/utils'

export function generateActivitiesFromProcessedTransactions(
    processedTransactions: IProcessedTransaction[],
    account: IAccountState
): Activity[] {
    const activities: Activity[] = []
    for (const _preparedActivity of processedTransactions) {
        try {
            const activitiesToAdd = generateActivities(_preparedActivity, account)
            activities.push(...activitiesToAdd)
        } catch (err) {
            console.error(err)
        }
    }
    return activities
}
