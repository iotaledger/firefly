import type { Account, AccountIdentifier, Balance, SyncedAccount } from './account'
import type { Address } from './address'
import type { ErrorEventPayload } from './events'
import type { Message } from './message'
import type { MigrationBundle, MigrationData, SendMigrationBundleResponse } from './migration'
import type { NodeInfo, StrongholdStatus } from './wallet'

export interface Actor {
    destroy(): void
    removeEventListeners(): void
}

export interface CommunicationIds {
    messageId: string
    actorId: string
}

export interface BridgeMessage {
    actorId: string
    // TODO: rename to messageId for clarity
    id: string
    cmd: string
    payload?: any
}

export enum ResponseTypes {
    InvalidMessage = 'InvalidMessage',
    RemovedAccount = 'RemovedAccount',
    CreatedAccount = 'CreatedAccount',
    ReadAccount = 'ReadAccount',
    ReadAccounts = 'ReadAccounts',
    Messages = 'Messages',
    Addresses = 'Addresses',
    GeneratedAddress = 'GeneratedAddress',
    LatestAddress = 'LatestAddress',
    Balance = 'Balance',
    SyncedAccounts = 'SyncedAccounts',
    SyncedAccount = 'SyncedAccount',
    Reattached = 'Reattached',
    BackupSuccessful = 'BackupSuccessful',
    BackupRestored = 'BackupRestored',
    StrongholdPasswordSet = 'StrongholdPasswordSet',
    SentTransfer = 'SentTransfer',
    Error = 'Error',
    Panic = 'Panic',
    ErrorThrown = 'ErrorThrown',
    BalanceChange = 'BalanceChange',
    NewTransaction = 'NewTransaction',
    ConfirmationStateChange = 'ConfirmationStateChange',
    Reattachment = 'Reattachment',
    Broadcast = 'Broadcast',
    StrongholdStatusChange = 'StrongholdStatusChange',
    TransferProgress = 'TransferProgress',
    MigrationProgress = 'MigrationProgress',
    GeneratedMnemonic = 'GeneratedMnemonic',
    StoredMnemonic = 'StoredMnemonic',
    VerifiedMnemonic = 'VerifiedMnemonic',
    StoragePasswordSet = 'StoragePasswordSet',
    StrongholdStatus = 'StrongholdStatus',
    UnusedAddress = 'UnusedAddress',
    IsLatestAddressUnused = 'IsLatestAddressUnused',
    AreAllLatestAddressesUnused = 'AreAllLatestAddressesUnused',
    UpdatedAlias = 'UpdatedAlias',
    DeletedStorage = 'DeletedStorage',
    LockedStronghold = 'LockedStronghold',
    StrongholdPasswordChanged = 'StrongholdPasswordChanged',
    UpdatedAllClientOptions = 'UpdatedAllClientOptions',
    StrongholdPasswordClearIntervalSet = 'StrongholdPasswordClearIntervalSet',
    MigrationData = 'MigrationData',
    CreatedMigrationBundle = 'CreatedMigrationBundle',
    SentMigrationBundle = 'SentMigrationBundle',
    LegacySeedChecksum = 'SeedChecksum',
    NodeInfo = 'NodeInfo',
    CalledGlow = 'CalledGlow'
}

export enum Actions {
    RemoveAccount = 'RemoveAccount',
}

export type Response<T, P> = { id: string; action: Actions; type: T; payload?: P }
export type RemovedAccountResponse = Response<ResponseTypes.RemovedAccount, AccountIdentifier>
export type CreatedAccountResponse = Response<ResponseTypes.CreatedAccount, Account>
export type ReadAccountResponse = Response<ResponseTypes.ReadAccount, Account>
export type ReadAccountsResponse = Response<ResponseTypes.ReadAccounts, Account[]>
export type ListMessagesResponse = Response<ResponseTypes.Messages, Message[]>
export type ListAddressesResponse = Response<ResponseTypes.Addresses, Address[]>
export type GeneratedAddressResponse = Response<ResponseTypes.GeneratedAddress, Address>
export type LatestAddressResponse = Response<ResponseTypes.LatestAddress, Address>
export type BalanceResponse = Response<ResponseTypes.Balance, Balance>
export type SyncAccountsResponse = Response<ResponseTypes.SyncedAccounts, SyncedAccount[]>
export type SyncAccountResponse = Response<ResponseTypes.SyncedAccount, SyncedAccount>
export type ReattachResponse = Response<ResponseTypes.Reattached, string> // message id
export type BackupSuccessfulResponse = Response<ResponseTypes.BackupSuccessful, void>
export type BackupRestoredResponse = Response<ResponseTypes.BackupRestored, void>
export type SetStrongholdPasswordResponse = Response<ResponseTypes.StrongholdPasswordSet, void>
export type SentTransferResponse = Response<ResponseTypes.SentTransfer, Message>
export type ErrorResponse = Response<ResponseTypes.Error, ErrorEventPayload>
export type PanicResponse = Response<ResponseTypes.Panic, string>
export type GenerateMnemonicResponse = Response<ResponseTypes.GeneratedMnemonic, string>
export type StoreMnemonicResponse = Response<ResponseTypes.StoredMnemonic, void>
export type VerifyMnemonicResponse = Response<ResponseTypes.VerifiedMnemonic, void>
export type SetStoragePasswordResponse = Response<ResponseTypes.StoragePasswordSet, void>
export type StrongholdStatusResponse = Response<ResponseTypes.StrongholdStatus, StrongholdStatus>
export type UnusedAddressResponse = Response<ResponseTypes.UnusedAddress, Address>
export type IsLatestAddressUnusedResponse = Response<ResponseTypes.IsLatestAddressUnused, boolean>
export type AreLatestAddressesUnusedResponse = Response<ResponseTypes.AreAllLatestAddressesUnused, boolean>
export type SetAliasResponse = Response<ResponseTypes.UpdatedAlias, void>
export type DeleteStorageResponse = Response<ResponseTypes.DeletedStorage, void>
export type LockStrongholdResponse = Response<ResponseTypes.LockedStronghold, void>
export type StrongholdPasswordChangeResponse = Response<ResponseTypes.StrongholdPasswordChanged, void>
export type UpdatedAllClientOptions = Response<ResponseTypes.UpdatedAllClientOptions, void>
export type LegacySeedChecksum = Response<ResponseTypes.LegacySeedChecksum, string>

/**
 * Migration responses
 */
export type MigrationDataResponse = Response<ResponseTypes.MigrationData, MigrationData>
export type CreatedMigrationBundleResponse = Response<ResponseTypes.CreatedMigrationBundle, MigrationBundle>
export type SentMigrationBundleResponse = Response<ResponseTypes.SentMigrationBundle, SendMigrationBundleResponse>
export type GetNodeInfoResponse = Response<ResponseTypes.NodeInfo, NodeInfo>

export type MessageResponse =
    RemovedAccountResponse
    | CreatedAccountResponse
    | ReadAccountResponse
    | ReadAccountsResponse
    | ListMessagesResponse
    | ListAddressesResponse
    | GeneratedAddressResponse
    | LatestAddressResponse
    | BalanceResponse
    | SyncAccountsResponse
    | SyncAccountResponse
    | ReattachResponse
    | BackupSuccessfulResponse
    | BackupRestoredResponse
    | SetStrongholdPasswordResponse
    | SentTransferResponse
    | ErrorResponse
    | PanicResponse
    | GenerateMnemonicResponse
    | StoreMnemonicResponse
    | VerifyMnemonicResponse
    | SetStoragePasswordResponse
    | StrongholdStatusResponse
    | UnusedAddressResponse
    | IsLatestAddressUnusedResponse
    | AreLatestAddressesUnusedResponse
    | SetAliasResponse
    | DeleteStorageResponse
    | LockStrongholdResponse
    | StrongholdStatusResponse
    | UpdatedAllClientOptions
    | LegacySeedChecksum
    // Migration types
    | MigrationDataResponse
    | CreatedMigrationBundleResponse
    | SentMigrationBundleResponse
    | GetNodeInfoResponse

export type Bridge = (message: BridgeMessage) => Promise<string>
