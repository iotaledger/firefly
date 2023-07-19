import { TransactionProgressEventPayload } from '../types'
import { TransactionProgressType } from '@iota/wallet'

export function isPerformingPow(payload: TransactionProgressEventPayload): boolean {
    const type = payload.getProgressType()
    return type === TransactionProgressType.PerformingPow
}
