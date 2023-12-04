import { IWalletState } from '@core/wallet/interfaces'
import { IProcessedTransaction } from '@core/wallet/interfaces/processed-transaction.interface'
import { Activity } from '@core/wallet/types'
import { generateActivities } from '@core/wallet/utils'

export async function generateActivitiesFromProcessedTransactions(
    processedTransactions: IProcessedTransaction[],
    account: IWalletState
): Promise<Activity[]> {
    const activities: Activity[] = []
    for (const _preparedActivity of processedTransactions) {
        try {
            const activitiesToAdd = await generateActivities(_preparedActivity, account)
            activities.push(...activitiesToAdd)
        } catch (err) {
            console.error(err)
        }
    }
    return activities
}
