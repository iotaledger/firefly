import {
    INewOutputEventPayload,
    ISpentOutputEventPayload,
    ITransactionInclusionEventPayload,
} from '@core/profile-manager/interfaces'
import { TransactionProgressEventPayload } from './transaction-progress-event.type'

export type WalletApiEventPayload =
    | INewOutputEventPayload
    | ISpentOutputEventPayload
    | ITransactionInclusionEventPayload
    | TransactionProgressEventPayload
