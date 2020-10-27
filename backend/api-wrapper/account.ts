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

export function createAccount(bridge: Bridge, account: AccountToCreate): Promise<void> {
  return bridge({
    cmd: 'CreateAccount',
    payload: account
  })
}

export function removeAccount(bridge: Bridge, accountId: AccountIdentifier): Promise<void> {
  return bridge({
    cmd: 'RemoveAccount',
    payload: accountId
  })
}

export function getAccount(bridge: Bridge, accountId: AccountIdentifier): Promise<void> {
  return bridge({
    cmd: 'GetAccount',
    payload: accountId
  })
}

export function getAccounts(bridge: Bridge): Promise<void> {
  return bridge({
    cmd: 'GetAccounts'
  })
}

export function syncAccounts(bridge: Bridge): Promise<void> {
  return bridge({ cmd: 'SyncAccounts' })
}

export function internalTransfer(bridge: Bridge, fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number): Promise<void> {
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
}

function _callAccountMethod(bridge: Bridge, methodName: AccountMethod, accountId: AccountIdentifier, data = {}): Promise<void> {
  return bridge({
    cmd: 'CallAccountMethod',
    payload: {
      accountId,
      method: {
        name: methodName,
        ...data
      }
    }
  })
}

export function generateAddress(bridge: Bridge, accountId: AccountIdentifier): Promise<void> {
  return _callAccountMethod(bridge, AccountMethod.GenerateAddress, accountId)
}

export function listMessages(bridge: Bridge, accountId: AccountIdentifier, filters?: ListMessagesFilter): Promise<void> {
  return _callAccountMethod(bridge, AccountMethod.ListMessages, accountId, filters)
}

export function listAddresses(bridge: Bridge, accountId: AccountIdentifier, unspent?: boolean): Promise<void> {
  return _callAccountMethod(bridge, AccountMethod.ListAddresses, accountId, { unspent })
}

export function availableBalance(bridge: Bridge, accountId: AccountIdentifier): Promise<void> {
  return _callAccountMethod(bridge, AccountMethod.GetAvailableBalance, accountId)
}

export function totalBalance(bridge: Bridge, accountId: AccountIdentifier): Promise<void> {
  return _callAccountMethod(bridge, AccountMethod.GetTotalBalance, accountId)
}

export function latestAddress(bridge: Bridge, accountId: AccountIdentifier): Promise<void> {
  return _callAccountMethod(bridge, AccountMethod.GetLatestAddress, accountId)
}
