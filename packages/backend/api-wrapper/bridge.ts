import type { ErrorEvent, BalanceChangeEvent, TransactionEvent } from './events'
import type { Address } from './address'
import type { AccountIdentifier, Account, SyncedAccount } from './account'
import type { Message } from './message'
import type { MnemonicPayload } from './mnemonic'

export interface CommunicationIds {
  messageId: string;
  actorId: string;
}

export interface BridgeMessage {
  actorId: string;
  // TODO: rename to messageId for clarity
  id: string;
  cmd: string;
  payload?: any;
}

export type Response<T, P> = { id: string, action: string, type: T, payload?: P }
export type RemovedAccountResponse = Response<'RemovedAccount', AccountIdentifier>
export type CreatedAccountResponse = Response<'CreatedAccount', Account>
export type ReadAccountResponse = Response<'ReadAccount', Account>
export type ReadAccountsResponse = Response<'ReadAccounts', Account[]>
export type ListMessagesResponse = Response<'Messages', Message[]>
export type ListAddressesResponse = Response<'Addresses', Address[]>
export type GeneratedAddressResponse = Response<'GeneratedAddress', Address>
export type LatestAddressResponse = Response<'LatestAddress', Address>
export type BalanceResponse = Response<'Balance', number>
export type SyncAccountsResponse = Response<'SyncedAccounts', SyncedAccount[]>
export type ReattachResponse = Response<'Reattached', string> // message id
export type BackupSuccessfulResponse = Response<'BackupSuccessful', void>
export type BackupRestoredResponse = Response<'BackupRestored', void>
export type SetStrongholdPasswordResponse = Response<'StrongholdPasswordSet', void>
export type SentTransferResponse = Response<'SentTransfer', Message>
export type ErrorResponse = Response<'Error', ErrorEvent>
export type GenerateMnemonicResponse = Response<'GeneratedMnemonic', string>
export type StoreMnemonicResponse = Response<'StoredMnemonic', void>
export type VerifyMnmonicResponse = Response<'VerifiedMnemonic', void>
export type StrongholdStatusResponse = Response<'StrongholdStatus', void>
export type UnusedAddressResponse = Response<'UnusedAddress', void>
export type IsLatestAddressUnusedResponse = Response<'IsLatestAddressUnused', void>
export type AreLatestAddressesUnusedResponse = Response<'AreLatestAddressesUnused', void>

export type MessageResponse = RemovedAccountResponse |
  CreatedAccountResponse |
  ReadAccountResponse |
  ReadAccountsResponse |
  ListMessagesResponse |
  ListAddressesResponse |
  GeneratedAddressResponse |
  LatestAddressResponse |
  BalanceResponse |
  SyncAccountsResponse |
  ReattachResponse |
  BackupSuccessfulResponse |
  BackupRestoredResponse |
  SetStrongholdPasswordResponse |
  SentTransferResponse |
  GenerateMnemonicResponse |
  StoreMnemonicResponse |
  VerifyMnmonicResponse |
  StrongholdStatusResponse |
  ErrorResponse |
  UnusedAddressResponse |
  IsLatestAddressUnusedResponse |
  AreLatestAddressesUnusedResponse |
  // events
  ErrorEvent

export type Bridge = (message: BridgeMessage) => Promise<string>
