import type { ErrorEvent, BalanceChangeEvent, TransactionEvent } from './events'
import type { Address } from './address'
import type { AccountIdentifier, Account, SyncedAccount } from './account'
import type { Message } from './message'

export interface BridgeMessage {
  id?: number;
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
  Error = 'Error'
}

export type Response<T, P> = { id: number, action: string, type: T, payload?: P }
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
export type ErrorResponse = Response<ResponseTypes.Error, ErrorEvent>

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
  // events
  ErrorEvent

export type Bridge = (message: BridgeMessage) => Promise<number>
