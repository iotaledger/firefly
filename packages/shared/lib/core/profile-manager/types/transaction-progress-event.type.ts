import { IPreparedTransaction, IPreparedTransactionEssenceHash } from '@core/profile-manager'

export type TransactionProgressEvent =
    | 'SelectingInputs'
    | 'SigningTransaction'
    | IPreparedTransaction
    | IPreparedTransactionEssenceHash
    | 'PerformingPow'
    | 'Broadcasting'
