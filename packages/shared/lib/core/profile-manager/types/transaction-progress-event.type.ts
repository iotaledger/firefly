import { IPreparedTransaction, IPreparedTransactionEssenceHash } from '@core/profile-manager'

export type TransactionProgressEventPayload =
    | 'SelectingInputs'
    | 'SigningTransaction'
    | IPreparedTransaction
    | IPreparedTransactionEssenceHash
    | 'PerformingPow'
    | 'Broadcasting'
