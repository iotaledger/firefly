import { IProcessedTransaction } from '@core/wallet/interfaces'
import { ActivityDirection } from '@core/wallet/enums/activity-direction.enum'
import { getMainOutputFromTransaction } from './getMainOutputFromTransaction'

export function getDirectionFromTransaction(
    transaction: IProcessedTransaction,
    accountAddress: string
): ActivityDirection {
    const { outputs, isIncoming } = transaction

    const { isOnlyOutput } = getMainOutputFromTransaction(outputs, accountAddress, isIncoming)

    if (isOnlyOutput) {
        return ActivityDirection.SelfTransaction
    } else if (isIncoming) {
        return ActivityDirection.Incoming
    } else {
        return ActivityDirection.Outgoing
    }
}
