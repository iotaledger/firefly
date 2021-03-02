import type { ResponseTypes } from './bridge'
import type { Address } from './address'
import type { Message } from './message'

// Reference: https://github.com/iotaledger/wallet.rs/blob/develop/src/error.rs
export enum ErrorType {
    // Generic
    UnknownError,
    GenericError,
    IoError,
    JsonError,
    ClientError,
    Panic,
    UnexpectedResponse,

    // Account
    AccountAlreadyImported,
    LatestAccountIsEmpty,
    AccountNotEmpty,
    AccountInitialiseRequiredField,
    CannotUseIndexIdentifier,
    AccountAliasAlreadyExists,
    InvalidBackupFile,
    InvalidBackupDestination,
    InsufficientFunds,
    ZeroAmount,
    MnemonicEncode,
    InvalidMnemonic,

    // Address
    InvalidAddress,
    InvalidAddressLength,
    InvalidRemainderValueAddress,
    AddressBuildRequiredField,
    Bech32Error,

    // Message
    MessageAboveMaxDepth,
    MessageAlreadyConfirmed,
    MessageNotFound,
    InvalidMessageIdLength,
    MessageNotEmpty,
    InvalidMessageId,
    InvalidOutputKind,
    InvalidTransactionId,
    InvalidTransactionIdLength,

    // Stronghold
    StrongholdError,

    // Database
    SqliteError,
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
    EmptyNodeList,

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
