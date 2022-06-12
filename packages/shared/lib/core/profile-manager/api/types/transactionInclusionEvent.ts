import { InclusionState } from '@core/wallet'

export type TransactionInclusionEvent = {
    transaction_id: string
    inclusion_state: InclusionState
}
