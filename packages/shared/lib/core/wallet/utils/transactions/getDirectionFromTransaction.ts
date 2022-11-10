import { IProcessedTransaction } from '@core/wallet/interfaces'
import { ActivityDirection } from '@core/wallet/enums/activity-direction.enum'
import { getMainOutputFromTransaction } from './getMainOutputFromTransaction'

export function getDirectionFromTransaction(
    transaction: IProcessedTransaction,
    accountAddress: string
): ActivityDirection {
    const { outputs, isIncoming } = transaction

    const { isSelfTransaction } = getMainOutputFromTransaction(outputs, accountAddress, isIncoming)

    const direction = isIncoming || isSelfTransaction ? ActivityDirection.Incoming : ActivityDirection.Outgoing
    return direction
}
