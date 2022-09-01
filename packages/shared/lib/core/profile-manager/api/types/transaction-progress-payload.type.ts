import { PreparedTransaction } from './prepared-transaction.type'
import { PreparedTransactionEssenceHash } from './prepared-transaction-essence-hash.type'

export type TransactionProgressEventPayload =
    | 'PerformingPow'
    | 'SigningTransaction'
    | PreparedTransaction
    | PreparedTransactionEssenceHash
