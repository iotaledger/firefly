import { TransactionProgressEventPayload } from '../types'
import { TransactionProgressType } from '@iota/wallet'

export function isPreparedTransactionEssenceHash(payload: TransactionProgressEventPayload): boolean {
    const type = payload.getProgressType()
    return type === TransactionProgressType.PreparedTransactionEssenceHash
}
