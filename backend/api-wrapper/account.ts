import { Bridge } from './bridge'
import { Message } from './message'
import { Address } from './address'
import { ClientOptions } from './client'

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
  id: number[];
  mnemonic: string;
  alias: string;
  createdAt: string;
  messages: Message[];
  addresses: Address[];
}

export type AccountIdentifier = number | number[]

export interface AccountToCreate {
  clientOptions: ClientOptions;
  mnemonic?: string;
  alias?: string;
  createdAt?: string;
}

export interface SyncedAccount {
  accountId: number[]
  depositAddress: Address
}

export function createAccount(bridge: Bridge, account: AccountToCreate): Promise<number> {
  return bridge({
    cmd: 'CreateAccount',
    payload: account
  })
}

export function removeAccount(bridge: Bridge, accountId: AccountIdentifier): Promise<number> {
  return bridge({
    cmd: 'RemoveAccount',
    payload: accountId
  })
}

export function getAccount(bridge: Bridge, accountId: AccountIdentifier): Promise<number> {
  return bridge({
    cmd: 'GetAccount',
    payload: accountId
  })
}

export function getAccounts(bridge: Bridge): Promise<number> {
  return bridge({
    cmd: 'GetAccounts'
  })
}

export function syncAccounts(bridge: Bridge): Promise<number> {
  return bridge({ cmd: 'SyncAccounts' })
}

export function internalTransfer(bridge: Bridge, fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number): Promise<number> {
  return bridge({
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

function _callAccountMethod(bridge: Bridge, methodName: AccountMethod, accountId: AccountIdentifier, data: any = void 0): Promise<number> {
  return bridge({
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

export function generateAddress(bridge: Bridge, accountId: AccountIdentifier): Promise<number> {
  return _callAccountMethod(bridge, AccountMethod.GenerateAddress, accountId)
}

export function listMessages(bridge: Bridge, accountId: AccountIdentifier, filters?: ListMessagesFilter): Promise<number> {
  return _callAccountMethod(bridge, AccountMethod.ListMessages, accountId, filters || {})
}

export function listAddresses(bridge: Bridge, accountId: AccountIdentifier, unspent?: boolean): Promise<number> {
  return _callAccountMethod(bridge, AccountMethod.ListAddresses, accountId, { unspent })
}

export function availableBalance(bridge: Bridge, accountId: AccountIdentifier): Promise<number> {
  return _callAccountMethod(bridge, AccountMethod.GetAvailableBalance, accountId)
}

export function totalBalance(bridge: Bridge, accountId: AccountIdentifier): Promise<number> {
  return _callAccountMethod(bridge, AccountMethod.GetTotalBalance, accountId)
}

export function latestAddress(bridge: Bridge, accountId: AccountIdentifier): Promise<number> {
  return _callAccountMethod(bridge, AccountMethod.GetLatestAddress, accountId)
}

export function syncAccount(bridge: Bridge, accountId: AccountIdentifier, options?: SyncAccountOptions): Promise<number> {
  return _callAccountMethod(bridge, AccountMethod.SyncAccount, accountId, options || {})
}