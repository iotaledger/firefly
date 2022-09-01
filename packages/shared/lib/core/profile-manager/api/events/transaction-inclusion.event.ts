import { updateClaimingTransactionInclusion } from '@core/wallet/actions/activities/updateClaimingTransactionInclusion'
import { updateActivityByTransactionId } from '@core/wallet/stores/all-account-activities.store'
import { TransactionInclusionEvent } from '../types'

export function handleTransactionInclusionEvent(accountId: string, event: TransactionInclusionEvent): void {
    updateActivityByTransactionId(accountId, event.transactionId, { inclusionState: event.inclusionState })
    updateClaimingTransactionInclusion(event.transactionId, event.inclusionState, accountId)
}
