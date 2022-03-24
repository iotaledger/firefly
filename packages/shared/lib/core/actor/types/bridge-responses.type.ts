import { Account, AccountIdentifier, Balance, SyncedAccount } from '@lib/typings/account'
import { Message } from '@lib/typings/message'
import { Address } from '@lib/typings/address'
import { StrongholdStatus } from '@lib/typings/wallet'
import { MigrationAddress, MigrationBundle, MigrationData, SendMigrationBundleResponse } from '@lib/typings/migration'
import { NodeInfo } from '@lib/typings/node'
import { LedgerStatus } from '@lib/typings/ledger'
import { ParticipateResponsePayload, ParticipationOverviewResponse } from '@lib/participation/types'

import { BridgeError } from './bridge-error.type'
import { BridgeResponse } from './bridge-response.type'
import { BridgeResponseType } from '../enums'

export type RemovedAccountResponse = BridgeResponse<BridgeResponseType.RemovedAccount, AccountIdentifier>
export type CreatedAccountResponse = BridgeResponse<BridgeResponseType.CreatedAccount, Account>
export type ReadAccountResponse = BridgeResponse<BridgeResponseType.ReadAccount, Account>
export type ReadAccountsResponse = BridgeResponse<BridgeResponseType.ReadAccounts, Account[]>
export type ListMessagesResponse = BridgeResponse<BridgeResponseType.Messages, Message[]>
export type ListAddressesResponse = BridgeResponse<BridgeResponseType.Addresses, Address[]>
export type GeneratedAddressResponse = BridgeResponse<BridgeResponseType.GeneratedAddress, Address>
export type LatestAddressResponse = BridgeResponse<BridgeResponseType.LatestAddress, Address>
export type BalanceResponse = BridgeResponse<BridgeResponseType.Balance, Balance>
export type SyncAccountsResponse = BridgeResponse<BridgeResponseType.SyncedAccounts, SyncedAccount[]>
export type StartBackgroundSyncResponse = BridgeResponse<BridgeResponseType.Ok, void>
export type StopBackgroundSyncResponse = BridgeResponse<BridgeResponseType.Ok, void>
export type SyncAccountResponse = BridgeResponse<BridgeResponseType.SyncedAccount, SyncedAccount>
export type ReattachResponse = BridgeResponse<BridgeResponseType.Reattached, string> // message id
export type BackupSuccessfulResponse = BridgeResponse<BridgeResponseType.BackupSuccessful, void>
export type BackupRestoredResponse = BridgeResponse<BridgeResponseType.BackupRestored, void>
export type SetStrongholdPasswordResponse = BridgeResponse<BridgeResponseType.StrongholdPasswordSet, void>
export type SentTransferResponse = BridgeResponse<BridgeResponseType.SentTransfer, Message>
export type ErrorResponse = BridgeResponse<BridgeResponseType.Error, BridgeError>
export type PanicResponse = BridgeResponse<BridgeResponseType.Panic, string>
export type GenerateMnemonicResponse = BridgeResponse<BridgeResponseType.GeneratedMnemonic, string>
export type StoreMnemonicResponse = BridgeResponse<BridgeResponseType.StoredMnemonic, void>
export type VerifyMnemonicResponse = BridgeResponse<BridgeResponseType.VerifiedMnemonic, void>
export type SetStoragePasswordResponse = BridgeResponse<BridgeResponseType.StoragePasswordSet, void>
export type StrongholdStatusResponse = BridgeResponse<BridgeResponseType.StrongholdStatus, StrongholdStatus>
export type UnusedAddressResponse = BridgeResponse<BridgeResponseType.UnusedAddress, Address>
export type IsLatestAddressUnusedResponse = BridgeResponse<BridgeResponseType.IsLatestAddressUnused, boolean>
export type AreLatestAddressesUnusedResponse = BridgeResponse<BridgeResponseType.AreAllLatestAddressesUnused, boolean>
export type SetAliasResponse = BridgeResponse<BridgeResponseType.UpdatedAlias, void>
export type DeleteStorageResponse = BridgeResponse<BridgeResponseType.DeletedStorage, void>
export type LockStrongholdResponse = BridgeResponse<BridgeResponseType.LockedStronghold, void>
export type StrongholdPasswordChangeResponse = BridgeResponse<BridgeResponseType.StrongholdPasswordChanged, void>
export type UpdatedAllClientOptions = BridgeResponse<BridgeResponseType.UpdatedAllClientOptions, void>
export type LegacySeedChecksum = BridgeResponse<BridgeResponseType.LegacySeedChecksum, string>

/**
 * Migration responses
 */
export type MigrationDataResponse = BridgeResponse<BridgeResponseType.MigrationData, MigrationData>
export type CreatedMigrationBundleResponse = BridgeResponse<BridgeResponseType.CreatedMigrationBundle, MigrationBundle>
export type SentMigrationBundleResponse = BridgeResponse<
    BridgeResponseType.SentMigrationBundle,
    SendMigrationBundleResponse
>
export type GetNodeInfoResponse = BridgeResponse<BridgeResponseType.NodeInfo, NodeInfo>
export type GetMigrationAddressResponse = BridgeResponse<BridgeResponseType.MigrationAddress, MigrationAddress>
export type MinedBundleResponse = BridgeResponse<BridgeResponseType.MinedBundle, string[]>
export type LedgerDeviceStatusResponse = BridgeResponse<BridgeResponseType.LedgerStatus, LedgerStatus>
export type LegacyAddressChecksumResponse = BridgeResponse<BridgeResponseType.LegacyAddressChecksum, string>

/**
 * Staking responses
 */
export type StakingOverviewResponse = BridgeResponse<BridgeResponseType.StakingOverview, ParticipationOverviewResponse>
export type StakedAccountResponse = BridgeResponse<BridgeResponseType.StakedAccount, ParticipateResponsePayload>
export type UnstakedAccountResponse = BridgeResponse<BridgeResponseType.UnstakedAccount, ParticipateResponsePayload>
export type AdditionalFundsStakedResponse = BridgeResponse<
    BridgeResponseType.AdditionalFundsStaked,
    ParticipateResponsePayload
>

export type BridgeResponses =
    | RemovedAccountResponse
    | CreatedAccountResponse
    | ReadAccountResponse
    | ReadAccountsResponse
    | ListMessagesResponse
    | ListAddressesResponse
    | GeneratedAddressResponse
    | LatestAddressResponse
    | BalanceResponse
    | SyncAccountsResponse
    | StartBackgroundSyncResponse
    | StopBackgroundSyncResponse
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
    | UpdatedAllClientOptions
    | LedgerDeviceStatusResponse
    | LegacySeedChecksum
    // Migration types
    | MigrationDataResponse
    | CreatedMigrationBundleResponse
    | SentMigrationBundleResponse
    | GetNodeInfoResponse
    | GetMigrationAddressResponse
    | MinedBundleResponse
    | LegacyAddressChecksumResponse
    // Staking types
    | StakingOverviewResponse
    | StakedAccountResponse
    | UnstakedAccountResponse
    | AdditionalFundsStakedResponse
