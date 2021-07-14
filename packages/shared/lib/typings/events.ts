import type { ResponseTypes } from './bridge'
import type { Message } from './message'

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
    DustError = 'DustError',
}

export type Callback<T> = (error: string, data: T) => void

export interface Event<T> {
    action: string
    id: string
    type: ResponseTypes
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
        spent: number;
        received: number;
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
    indexationId: string;
    accountId: string;
    message: Message;
    reattachedMessageId: string;
}

export enum TransferProgressEventType {
    // Syncing account.
    SyncingAccount = 'SyncingAccount',
    /// Performing input selection.
    SelectingInputs = 'SelectingInputs',
    /// Generating remainder value deposit address.
    GeneratingRemainderDepositAddress = 'GeneratingRemainderDepositAddress',
    /// Signing the transaction.
    SigningTransaction = 'SigningTransaction',
    /// Performing PoW.
    PerformingPoW = 'PerformingPoW',
    /// Broadcasting.
    Broadcasting = 'Broadcasting',
}

/// Prepared the transaction.
export interface PreparedTransactionEvent {
    /// The type of the transfer progress event.
    type: TransferProgressEventType

    /// Transaction inputs. [address, amount][]
    inputs: any[][]

    /// Transaction outputs. [address, amount, remainder][]
    outputs: any[][]

    /// The indexation data.
    data: string
}

export interface TransferProgressEventPayload {
    accountId: string
    event: PreparedTransactionEvent
}

export enum MigrationProgressEventType {
    // Syncing account.
    SyncingAccount = 'SyncingAccount',
    /// Performing input selection.
    SelectingInputs = 'SelectingInputs',
    /// Generating remainder value deposit address.
    GeneratingRemainderDepositAddress = 'GeneratingRemainderDepositAddress',
    /// Signing the transaction.
    SigningTransaction = 'SigningTransaction',
    /// Performing PoW.
    PerformingPoW = 'PerformingPoW',
    /// Broadcasting.
    Broadcasting = 'Broadcasting',
    // Transaction confirmed (through promotion & reattachment)
    TransactionConfirmed = 'TransactionConfirmed'
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
    event: FetchingMigrationDataEvent | MiningEvent | SigningBundleEvent | BroadcastingBundleEvent | LegacyTransactionConfirmedEvent
}
