import type { Bridge, CommunicationIds } from './bridge'
import type { Message } from './message'
import type { Address } from './address'
import type { ClientOptions } from './client'

export enum MessageType { }

export interface ListMessagesFilter {
  messageType: MessageType,
  count: number
  from: number
}

export interface SyncAccountOptions {
  addressIndex?: number;
  gapLimit?: number;
  skipPersistance?: boolean
}

export interface Account {
  id: string;
  mnemonic: string;
  alias: string;
  createdAt: string;
  messages: Message[];
  addresses: Address[];
}

export type AccountIdentifier = number | string

export interface SignerType {
  type: 'Stronghold';
}

export interface AccountToCreate {
  clientOptions: ClientOptions;
  signerType: SignerType;
  alias?: string;
  createdAt?: string;
}

export interface SyncedAccount {
  accountId: string
  depositAddress: Address
}

export function createAccount(bridge: Bridge, __ids: CommunicationIds, account: AccountToCreate): Promise<string> {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'CreateAccount',
    payload: account
  })
}

export function removeAccount(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier): Promise<string> {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'RemoveAccount',
    payload: accountId
  })
}

export function getAccount(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier): Promise<string> {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'GetAccount',
    payload: accountId
  })
}

export function getAccounts(bridge: Bridge, __ids: CommunicationIds): Promise<string> {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'GetAccounts'
  })
}

export function syncAccounts(bridge: Bridge, __ids: CommunicationIds): Promise<string> {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'SyncAccounts'
  })
}

export function internalTransfer(bridge: Bridge, __ids: CommunicationIds, fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number): Promise<string> {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'InternalTransfer',
    payload: {
      fromAccountId,
      toAccountId,
      amount
    }
  })
}

enum AccountMethod {
  GenerateAddress,
  ListMessages,
  ListAddresses,
  GetAvailableBalance,
  GetTotalBalance,
  GetLatestAddress,
  SyncAccount,
}

function _callAccountMethod(bridge: Bridge, __ids: CommunicationIds, methodName: AccountMethod, accountId: AccountIdentifier, data: any = void 0): Promise<string> {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'CallAccountMethod',
    payload: {
      accountId,
      method: {
        name: AccountMethod[methodName],
        data
      }
    }
  })
}

export function generateAddress(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier): Promise<string> {
  return _callAccountMethod(bridge, __ids, AccountMethod.GenerateAddress, accountId)
}

export function listMessages(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier, filters?: ListMessagesFilter): Promise<string> {
  return _callAccountMethod(bridge, __ids, AccountMethod.ListMessages, accountId, filters || {})
}

export function listAddresses(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier, unspent?: boolean): Promise<string> {
  return _callAccountMethod(bridge, __ids, AccountMethod.ListAddresses, accountId, { unspent })
}

export function availableBalance(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier): Promise<string> {
  return _callAccountMethod(bridge, __ids, AccountMethod.GetAvailableBalance, accountId)
}

export function totalBalance(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier): Promise<string> {
  return _callAccountMethod(bridge, __ids, AccountMethod.GetTotalBalance, accountId)
}

export function latestAddress(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier): Promise<string> {
  return _callAccountMethod(bridge, __ids, AccountMethod.GetLatestAddress, accountId)
}

export function syncAccount(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier, options?: SyncAccountOptions): Promise<string> {
  return _callAccountMethod(bridge, __ids, AccountMethod.SyncAccount, accountId, options || {})
}
