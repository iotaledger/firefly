import { updateActivityInclusionStateByTransactionId } from '@core/wallet/stores/all-account-activities.store'
import { TransactionInclusionEvent } from '../types/transactionInclusionEvent'

export function handleTransactionInclusionEvent(accountId: string, event: TransactionInclusionEvent): void {
    const transactionId = event.transaction_id
    const inclusionState = event.inclusion_state

    updateActivityInclusionStateByTransactionId(transactionId, inclusionState)
}
