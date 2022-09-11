import { INewOutputEvent, ISpentOutputEvent, ITransactionInclusionEvent } from '@core/profile-manager/interfaces'
import { TransactionProgressEvent } from './transaction-progress-event.type'

export type WalletApiEventPayload =
    | INewOutputEvent
    | ISpentOutputEvent
    | ITransactionInclusionEvent
    | TransactionProgressEvent
