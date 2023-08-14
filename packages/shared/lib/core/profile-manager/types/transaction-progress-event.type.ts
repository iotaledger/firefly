import {
    SelectingInputsProgress,
    GeneratingRemainderDepositAddressProgress,
    PreparedTransactionProgress,
    PreparedTransactionEssenceHashProgress,
    SigningTransactionProgress,
    PerformingPowProgress,
    BroadcastingProgress,
} from '@iota/wallet'

export type TransactionProgressEventPayload =
    | SelectingInputsProgress
    | GeneratingRemainderDepositAddressProgress
    | PreparedTransactionProgress
    | PreparedTransactionEssenceHashProgress
    | SigningTransactionProgress
    | PerformingPowProgress
    | BroadcastingProgress
