import type { Event, ErrorEventPayload, BalanceChangeEventPayload, TransactionEventPayload } from './events'
import type { Address } from './address'
import type { AccountIdentifier, Account, SyncedAccount } from './account'
import type { Message } from './message'

export interface BridgeMessage {
  id: string;
  cmd: string;
  payload?: any;
}

export enum ResponseTypes {
  RemovedAccount = 'RemovedAccount',
  CreatedAccount = 'CreatedAccount',
  ReadAccount = 'ReadAccount',
  ReadAccounts = 'ReadAccounts',
  Messages = 'Messages',
  Addresses = 'Addresses',
  GeneratedAddress = 'GeneratedAddress',
  LatestAddress = 'LatestAddress',
  AvailableBalance = 'AvailableBalance',
  TotalBalance = 'TotalBalance',
  SyncedAccounts = 'SyncedAccounts',
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
}

export type Response<T, P> = { id: string, action: string, type: T, payload?: P }
export type RemovedAccountResponse = Response<ResponseTypes.RemovedAccount, AccountIdentifier>
export type CreatedAccountResponse = Response<ResponseTypes.CreatedAccount, Account>
export type ReadAccountResponse = Response<ResponseTypes.ReadAccount, Account>
export type ReadAccountsResponse = Response<ResponseTypes.ReadAccounts, Account[]>
export type ListMessagesResponse = Response<ResponseTypes.Messages, Message[]>
export type ListAddressesResponse = Response<ResponseTypes.Addresses, Address[]>
export type GeneratedAddressResponse = Response<ResponseTypes.GeneratedAddress, Address>
export type LatestAddressResponse = Response<ResponseTypes.LatestAddress, Address>
export type AvailableBalanceResponse = Response<ResponseTypes.AvailableBalance, number>
export type TotalBalanceResponse = Response<ResponseTypes.TotalBalance, number>
export type SyncAccountsResponse = Response<ResponseTypes.SyncedAccounts, SyncedAccount[]>
export type ReattachResponse = Response<ResponseTypes.Reattached, string> // message id
export type BackupSuccessfulResponse = Response<ResponseTypes.BackupSuccessful, void>
export type BackupRestoredResponse = Response<ResponseTypes.BackupRestored, void>
export type SetStrongholdPasswordResponse = Response<ResponseTypes.StrongholdPasswordSet, void>
export type SentTransferResponse = Response<ResponseTypes.SentTransfer, Message>
export type ErrorResponse = Response<ResponseTypes.Error, ErrorEventPayload>
export type PanicResponse = Response<ResponseTypes.Panic, string>

export type MessageResponse = RemovedAccountResponse |
  CreatedAccountResponse |
  ReadAccountResponse |
  ReadAccountsResponse |
  ListMessagesResponse |
  ListAddressesResponse |
  GeneratedAddressResponse |
  LatestAddressResponse |
  AvailableBalanceResponse |
  TotalBalanceResponse |
  SyncAccountsResponse |
  ReattachResponse |
  BackupSuccessfulResponse |
  BackupRestoredResponse |
  SetStrongholdPasswordResponse |
  SentTransferResponse |
  ErrorResponse |
  PanicResponse |
  // events
  Event<ErrorEventPayload> | Event<BalanceChangeEventPayload> | Event<TransactionEventPayload>

export type Bridge = (message: BridgeMessage) => Promise<string>
