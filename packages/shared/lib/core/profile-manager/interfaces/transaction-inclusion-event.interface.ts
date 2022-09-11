import { InclusionState } from '@core/wallet'

export interface ITransactionInclusionEvent {
    transactionId: string
    inclusionState: InclusionState
}
