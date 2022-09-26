import { TransactionProgressEventPayload } from '../types'

export function isPreparedTransaction(payload: TransactionProgressEventPayload): boolean {
    return typeof payload !== 'string' && 'PreparedTransaction' in payload
}
