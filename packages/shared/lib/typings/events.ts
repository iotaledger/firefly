import type { ResponseTypes } from './bridge'
import type { Address } from './address'
import type { Message } from './message'

// Reference: https://github.com/iotaledger/wallet.rs/blob/develop/src/error.rs
export enum ErrorType {
    // Generic
    IoError,
    JsonError,
    ClientError,
    Panic,

    // Account
    LatestAccountIsEmpty,
    AccountNotEmpty,
    AccountInitialiseRequiredField,
    CannotUseIndexIdentifier,
    AccountAliasAlreadyExists,
    InvalidBackupFile,
    InvalidBackupDestination,
    InsufficientFunds,
    MnemonicEncode,
    InvalidMnemonic,

    // Address
    InvalidAddress,
    InvalidAddressLength,
    InvalidRemainderValueAddress,
    AddressBuildRequiredField,

    // Message
    MessageNotFound,
    InvalidMessageIdLength,
    InvalidMessageId,
    InvalidOutputKind,
    InvalidTransactionId,

    // Stronghold
    StrongholdError,

    // Database
    StorageDoesntExist,
    Storage,
    StorageAdapterNotDefined,
    StorageExists,
    StorageAdapterNotSet,
    StorageIsEncrypted,
    RecordDecrypt,
    RecordEncrypt,
    RecordNotFound,

    // Bee (https://github.com/iotaledger/bee)
    BeeMessage,

    // Nodes
    UrlError,

    // Ledger
    LedgerMiscError,
    LedgerDongleLocked,
    LedgerDeniedByUser,
    LedgerDeviceNotFound,
    LedgerEssenceTooLarge,

    // Dust output
    DustError,
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
    accountId: string
    address: Address
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

export interface TransferProgressEventPayload {
    accountId: string
    event: { type: TransferProgressEventType }
}
