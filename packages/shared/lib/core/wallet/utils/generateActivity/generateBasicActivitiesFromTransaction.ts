import { IAccountState } from '@core/account'
import { ActivityAction, getNonRemainderBasicOutputsFromTransaction, IProcessedTransaction } from '@core/wallet'
import { Activity } from '@core/wallet/types'
import { generateSingleBasicActivity } from './generateSingleBasicActivity'

export function generateBasicActivitiesFromTransaction(
    processedTransaction: IProcessedTransaction,
    account: IAccountState
): Activity[] {
    const activities = []

    const basicOutputs = getNonRemainderBasicOutputsFromTransaction(
        processedTransaction.outputs,
        account.depositAddress,
        processedTransaction.direction
    )
    for (const basicOutput of basicOutputs) {
        activities.push(
            generateSingleBasicActivity(account, {
                action: ActivityAction.Send,
                processedTransaction,
                wrappedOutput: basicOutput,
            })
        )
    }
    return activities
}
