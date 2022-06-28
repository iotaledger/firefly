import { InclusionState } from '@core/wallet'

export type TransactionInclusionEvent = {
    transactionId: string
    inclusionState: InclusionState
}
