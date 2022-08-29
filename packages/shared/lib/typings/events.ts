import { IAppUpdateDownloadProgress, IAppVersionDetails } from '@core/app/interfaces'
import { DashboardRoute } from '@core/router/enums'

import { Message, UTXOEventData } from './message'

export interface EventMap {
    'menu-logout': void
    'menu-navigate-wallet': DashboardRoute
    'menu-navigate-settings': void
    'menu-check-for-update': void
    'menu-error-log': void
    'menu-diagnostics': void
    'menu-create-developer-profile': void
    'menu-create-normal-profile': void
    'log-error': void
    'deep-link-request': void
    'deep-link-params': string
    'version-details': IAppVersionDetails
    'version-progress': IAppUpdateDownloadProgress
    'version-complete': void
    'version-error': Error
    'notification-activated': unknown
}

// Reference: https://github.com/iotaledger/wallet.rs/blob/develop/src/error.rs
export enum ErrorType {
    // Generic
    IoError = 'IoError',
    JsonError = 'JsonError',
    ClientError = 'ClientError',
    Panic = 'Panic',

    // Account
    LatestAccountIsEmpty = 'LatestAccountIsEmpty',
    AccountNotEmpty = 'AccountNotEmpty',
    AccountInitialiseRequiredField = 'AccountInitialiseRequiredField',
    CannotUseIndexIdentifier = 'CannotUseIndexIdentifier',
    AccountAliasAlreadyExists = 'AccountAliasAlreadyExists',
    InvalidBackupFile = 'InvalidBackupFile',
    InvalidBackupDestination = 'InvalidBackupDestination',
    InsufficientFunds = 'InsufficientFunds',
    MnemonicEncode = 'MnemonicEncode',
    InvalidMnemonic = 'InvalidMnemonic',
    AccountNotFound = 'AccountNotFound',

    // Address
    InvalidAddress = 'InvalidAddress',
    InvalidAddressLength = 'InvalidAddressLength',
    InvalidRemainderValueAddress = 'InvalidRemainderValueAddress',
    AddressBuildRequiredField = 'AddressBuildRequiredField',

    // Message
    MessageNotFound = 'MessageNotFound',
    InvalidMessageIdLength = 'InvalidMessageIdLength',
    InvalidMessageId = 'InvalidMessageId',
    InvalidOutputKind = 'InvalidOutputKind',
    InvalidTransactionId = 'InvalidTransactionId',

    // Stronghold
    StrongholdError = 'StrongholdError',

    // Database
    StorageDoesntExist = 'StorageDoesntExist',
    Storage = 'Storage',
    StorageAdapterNotDefined = 'StorageAdapterNotDefined',
    StorageExists = 'StorageExists',
    StorageAdapterNotSet = 'StorageAdapterNotSet',
    StorageIsEncrypted = 'StorageIsEncrypted',
    RecordDecrypt = 'RecordDecrypt',
    RecordEncrypt = 'RecordEncrypt',
    RecordNotFound = 'RecordNotFound',

    // Bee (https://github.com/iotaledger/bee)
    BeeMessage = 'BeeMessage',

    // Nodes
    UrlError = 'UrlError',
    NodesNotSynced = 'NodesNotSynced',

    // Ledger
    LedgerMiscError = 'LedgerMiscError',
    LedgerDongleLocked = 'LedgerDongleLocked',
    LedgerDeniedByUser = 'LedgerDeniedByUser',
    LedgerDeviceNotFound = 'LedgerDeviceNotFound',
    LedgerEssenceTooLarge = 'LedgerEssenceTooLarge',
    WrongLedgerSeedError = 'WrongLedgerSeedError',

    // Dust output
    LeavingDustError = 'LeavingDustError',
}

export enum LedgerErrorType {
    LedgerMiscError = 'LedgerMiscError',
    LedgerDongleLocked = 'LedgerDongleLocked',
    LedgerDeniedByUser = 'LedgerDeniedByUser',
    LedgerDeviceNotFound = 'LedgerDeviceNotFound',
    LedgerEssenceTooLarge = 'LedgerEssenceTooLarge',
    WrongLedgerSeedError = 'WrongLedgerSeedError',
}

export type Callback<T> = (error: string, data: T) => void

export interface Event<T> {
    action: string
    id: string
    type: unknown
    payload: T
}

export interface ErrorEventPayload {
    type: ErrorType
    error: string
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
