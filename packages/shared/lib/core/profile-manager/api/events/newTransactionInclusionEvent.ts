import { updateActivityByTransactionId } from '@core/wallet/stores/all-account-activities.store'
import { TransactionInclusionEvent } from '../types/transactionInclusionEvent'

export function handleTransactionInclusionEvent(accountId: string, event: TransactionInclusionEvent): void {
    updateActivityByTransactionId(accountId, event.transaction_id, { inclusionState: event.inclusion_state })
}
