import { INewOutputEventPayload, ISpentOutputEventPayload, ITransactionInclusionEventPayload } from '../interfaces'
import { TransactionProgressEventPayload } from './transaction-progress-event.type'

export type WalletApiEventPayload =
    | INewOutputEventPayload
    | ISpentOutputEventPayload
    | ITransactionInclusionEventPayload
    | TransactionProgressEventPayload
