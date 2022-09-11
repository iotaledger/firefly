import { InclusionState } from '@core/wallet'

export interface ITransactionInclusionEventPayload {
    transactionId: string
    inclusionState: InclusionState
}
