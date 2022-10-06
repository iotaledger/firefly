import { IProcessedTransaction } from '@core/wallet/interfaces'
import { ActivityDirection } from '@core/wallet/enums/activity-direction.enum'
import { getMainTransactionOutputFromTransaction } from './getMainTransactionOutputFromTransaction'

export function getDirectionFromTransaction(
    transaction: IProcessedTransaction,
    accountAddress: string
): ActivityDirection {
    const { outputs, isIncoming } = transaction

    const { isSelfTransaction } = getMainTransactionOutputFromTransaction(outputs, accountAddress, isIncoming)

    const direction = isIncoming || isSelfTransaction ? ActivityDirection.Incoming : ActivityDirection.Outgoing
    return direction
}
