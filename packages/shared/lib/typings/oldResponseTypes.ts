import { INodeInfo } from '@iota/types'
import { Account, Address } from '@iota/wallet'
import { ParticipateResponsePayload, ParticipationOverviewResponse } from '@lib/participation'
import { AccountIdentifier } from '@lib/typings/accountIdentifier'
import { LedgerStatus } from '@lib/typings/ledger'
import { Message } from '@lib/typings/message'
import { MigrationAddress, MigrationBundle, MigrationData } from '@lib/typings/migration'
import { StrongholdStatus } from '@lib/typings/wallet'

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
    Ok = 'Ok',
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
    LedgerAddressGeneration = 'LedgerAddressGeneration',
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
    LedgerStatus = 'LedgerStatus',
    StrongholdPasswordClearIntervalSet = 'StrongholdPasswordClearIntervalSet',
    MigrationData = 'MigrationData',
    CreatedMigrationBundle = 'CreatedMigrationBundle',
    SentMigrationBundle = 'SentMigrationBundle',
    LegacySeedChecksum = 'SeedChecksum',
    NodeInfo = 'NodeInfo',
    MigrationAddress = 'MigrationAddress',
    MinedBundle = 'MinedBundle',
    MineBundle = 'MineBundle',
    LegacyAddressChecksum = 'GetLegacyAddressChecksum',

    // Staking
    ParticipationOverview = 'ParticipationOverview',
    EventsData = 'EventsData',
    SentParticipation = 'SentParticipation',
    StakingOverview = 'StakingOverview',
    StakedAccount = 'StakedAccount',
    UnstakedAccount = 'UnstakedAccount',
    AdditionalFundsStaked = 'AdditionalFundsStaked',
}

enum Actions {
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
export type StartBackgroundSyncResponse = Response<ResponseTypes.Ok, void>
export type StopBackgroundSyncResponse = Response<ResponseTypes.Ok, void>
export type ReattachResponse = Response<ResponseTypes.Reattached, string> // message id
export type BackupSuccessfulResponse = Response<ResponseTypes.BackupSuccessful, void>
export type BackupRestoredResponse = Response<ResponseTypes.BackupRestored, void>
export type SetStrongholdPasswordResponse = Response<ResponseTypes.StrongholdPasswordSet, void>
export type SentTransferResponse = Response<ResponseTypes.SentTransfer, Message>
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
export type GetNodeInfoResponse = Response<ResponseTypes.NodeInfo, INodeInfo>
export type GetMigrationAddressResponse = Response<ResponseTypes.MigrationAddress, MigrationAddress>
export type MinedBundleResponse = Response<ResponseTypes.MinedBundle, string[]>
export type LedgerDeviceStatusResponse = Response<ResponseTypes.LedgerStatus, LedgerStatus>
export type LegacyAddressChecksumResponse = Response<ResponseTypes.LegacyAddressChecksum, string>

/**
 * Staking responses
 */
export type StakingOverviewResponse = Response<ResponseTypes.StakingOverview, ParticipationOverviewResponse>
export type StakedAccountResponse = Response<ResponseTypes.StakedAccount, ParticipateResponsePayload>
export type UnstakedAccountResponse = Response<ResponseTypes.UnstakedAccount, ParticipateResponsePayload>
export type AdditionalFundsStakedResponse = Response<ResponseTypes.AdditionalFundsStaked, ParticipateResponsePayload>

export type MessageResponse =
    | RemovedAccountResponse
    | CreatedAccountResponse
    | ReadAccountResponse
    | ReadAccountsResponse
    | ListMessagesResponse
    | ListAddressesResponse
    | GeneratedAddressResponse
    | LatestAddressResponse
    | StartBackgroundSyncResponse
    | StopBackgroundSyncResponse
    | ReattachResponse
    | BackupSuccessfulResponse
    | BackupRestoredResponse
    | SetStrongholdPasswordResponse
    | SentTransferResponse
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
    | UpdatedAllClientOptions
    | LedgerDeviceStatusResponse
    | LegacySeedChecksum
    // Migration types
    | MigrationDataResponse
    | CreatedMigrationBundleResponse
    | GetNodeInfoResponse
    | GetMigrationAddressResponse
    | MinedBundleResponse
    | LegacyAddressChecksumResponse
    // Staking types
    | StakingOverviewResponse
    | StakedAccountResponse
    | UnstakedAccountResponse
    | AdditionalFundsStakedResponse
