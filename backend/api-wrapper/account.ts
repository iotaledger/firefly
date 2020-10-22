import { Bridge, BridgeResponse } from './bridge'
import { Message } from './message'
import { Address } from './address'
import { ClientOptions } from './client'

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
