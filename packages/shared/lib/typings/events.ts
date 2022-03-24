import { Message, UTXOEventData } from './message'

export enum LedgerErrorType {
    LedgerMiscError = 'LedgerMiscError',
    LedgerDongleLocked = 'LedgerDongleLocked',
    LedgerDeniedByUser = 'LedgerDeniedByUser',
    LedgerDeviceNotFound = 'LedgerDeviceNotFound',
    LedgerEssenceTooLarge = 'LedgerEssenceTooLarge',
    WrongLedgerSeedError = 'WrongLedgerSeedError',
}

export interface BalanceChangeEventPayload {
    indexationId: string
    messageId: string
    accountId: string
    address: string
    balanceChange: {
        spent: number
        received: number
    }
}

export interface TransactionEventPayload {
    accountId: string
    message: Message
}

export interface ConfirmationStateChangeEventPayload {
    accountId: string
    message: Message
    confirmed: boolean
}

export interface ReattachmentEventPayload {
    indexationId: string
    accountId: string
    message: Message
    reattachedMessageId: string
}

export enum TransferProgressEventType {
    // / Syncing account.
    SyncingAccount = 'SyncingAccount',
    // / Performing input selection.
    SelectingInputs = 'SelectingInputs',
    // / Generating address for remainder funds.
    GeneratingRemainderDepositAddress = 'GeneratingRemainderDepositAddress',
    // / Preparing the transaction data.
    PreparedTransaction = 'PreparedTransaction',
    // / Signing the transaction.
    SigningTransaction = 'SigningTransaction',
    // / Performing PoW.
    PerformingPoW = 'PerformingPoW',
    // / Broadcasting.
    Broadcasting = 'Broadcasting',
    // / Complete.
    Complete = 'Complete',
}

export interface TransferProgressEvent {
    // / The transfer progress event type.
    type: TransferProgressEventType
}

export interface GeneratingRemainderDepositAddressEvent extends TransferProgressEvent {
    // / Bech32 representation of remainder address.
    address: string
}

export interface PreparedTransactionEvent extends TransferProgressEvent {
    // / Transaction inputs.
    inputs: UTXOEventData[]
    // / Transaction outputs.
    outputs: UTXOEventData[]
    // / Indexation data.
    data?: string
}

export type TransferProgressEventData =
    | TransferProgressEvent
    | GeneratingRemainderDepositAddressEvent
    | PreparedTransactionEvent

export type TransactionEventData =
    | {
          toAddress?: string
          toAmount?: number
          remainderAddress?: string
          remainderAmount?: number
      }
    | PreparedTransactionEvent

export interface TransferState extends TransferProgressEvent {
    // / Relevant data for this type of transfer progress event.
    data?: TransferProgressEventData
}

export interface TransferProgressEventPayload {
    accountId: string
    event: TransferProgressEventData
}

export interface LedgerAddressGenerationEventPayload {
    event: LedgerAddressGenerationEvent
}

export interface LedgerAddressGenerationEvent {
    address: string
}

export enum MigrationProgressEventType {
    // Syncing account.
    SyncingAccount = 'SyncingAccount',
    // / Performing input selection.
    SelectingInputs = 'SelectingInputs',
    // / Generating remainder value deposit address.
    GeneratingRemainderDepositAddress = 'GeneratingRemainderDepositAddress',
    // / Signing the transaction.
    SigningTransaction = 'SigningTransaction',
    // / Performing PoW.
    PerformingPoW = 'PerformingPoW',
    // / Broadcasting.
    Broadcasting = 'Broadcasting',
    // Transaction confirmed (through promotion & reattachment)
    TransactionConfirmed = 'TransactionConfirmed',
}

export interface FetchingMigrationDataEvent {
    type: 'FetchingMigrationData'
    data: {
        initialAddresIndex: number
        finalAddressIndex: number
    }
}

export interface MiningEvent {
    type: 'MiningBundle'
    data: {
        address: string
    }
}

export interface SigningBundleEvent {
    type: 'SigningBundle'
    data: {
        addresses: string[]
    }
}

export interface BroadcastingBundleEvent {
    type: 'BroadcastingBundle'
    data: {
        bundleHash: string
    }
}

export interface LegacyTransactionConfirmedEvent {
    type: 'TransactionConfirmed'
    data: {
        bundleHash: string
    }
}

export interface MigrationProgressEventPayload {
    event:
        | FetchingMigrationDataEvent
        | MiningEvent
        | SigningBundleEvent
        | BroadcastingBundleEvent
        | LegacyTransactionConfirmedEvent
}
