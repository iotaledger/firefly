import { TransactionProgressEventPayload } from '../api/types'

export function isPreparedTransactionEssenceHash(payload: TransactionProgressEventPayload): boolean {
    return typeof payload !== 'string' && 'PreparedTransactionEssenceHash' in payload
}
