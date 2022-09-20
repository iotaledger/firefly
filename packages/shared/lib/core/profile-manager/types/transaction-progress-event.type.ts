import { IPreparedTransaction, IPreparedTransactionEssenceHash } from '../interfaces'

export type TransactionProgressEventPayload =
    | 'SelectingInputs'
    | 'SigningTransaction'
    | IPreparedTransaction
    | IPreparedTransactionEssenceHash
    | 'PerformingPow'
    | 'Broadcasting'
