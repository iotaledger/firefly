import { PreparedTransaction } from './prepared-transaction.type'
import { PreparedTransactionEssenceHashType } from './prepared-transaction-essence-hash.type'

export type TransactionProgressEventPayload =
    | 'PerformingPow'
    | 'SigningTransaction'
    | PreparedTransaction
    | PreparedTransactionEssenceHashType
