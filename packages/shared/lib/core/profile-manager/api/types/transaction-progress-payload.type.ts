import { PreparedTransaction } from './prepared-transaction.type'
import { PreparedTransactionEssenceHash } from './prepared-transaction-essence-hash.type'

export type TransactionProgressEventPayload =
    | 'SelectingInputs'
    | 'SigningTransaction'
    | PreparedTransaction
    | PreparedTransactionEssenceHash
    | 'PerformingPow'
    | 'Broadcasting'
