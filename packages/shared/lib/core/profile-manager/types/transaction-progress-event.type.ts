import {
    SelectingInputsProgress,
    GeneratingRemainderDepositAddressProgress,
    PreparedTransactionProgress,
    PreparedTransactionEssenceHashProgress,
    SigningTransactionProgress,
    PerformingPowProgress,
    BroadcastingProgress,
} from '@iota/wallet/out/types'

export type TransactionProgressEventPayload =
    | SelectingInputsProgress
    | GeneratingRemainderDepositAddressProgress
    | PreparedTransactionProgress
    | PreparedTransactionEssenceHashProgress
    | SigningTransactionProgress
    | PerformingPowProgress
    | BroadcastingProgress
