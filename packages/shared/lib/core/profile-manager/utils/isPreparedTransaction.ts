import { TransactionProgressEventPayload } from '../api/types'

export function isPreparedTransaction(payload: TransactionProgressEventPayload): boolean {
    return typeof payload !== 'string' && 'PreparedTransaction' in payload
}
