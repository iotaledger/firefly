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

export function createAccount(bridge: Bridge<Account>, account: AccountToCreate): Promise<BridgeResponse<Account>> {
  return bridge({
    cmd: 'CreateAccount',
    payload: account
  })
}

export function removeAccount(bridge: Bridge<any>, accountId: AccountIdentifier): Promise<BridgeResponse<any>> {
  return bridge({
    cmd: 'RemoveAccount',
    payload: accountId
  })
}

export function getAccount(bridge: Bridge<Account>, accountId: AccountIdentifier): Promise<BridgeResponse<Account>> {
  return bridge({
    cmd: 'GetAccount',
    payload: accountId
  })
}

export function syncAccounts(bridge: Bridge<SyncedAccount[]>): Promise<BridgeResponse<SyncedAccount[]>> {
  return bridge({ cmd: 'SyncAccounts' })
}

export function internalTransfer(bridge: Bridge<Message>, fromAccountId: AccountIdentifier, toAccountId: AccountIdentifier, amount: number): Promise<BridgeResponse<Message>> {
  return bridge({
    cmd: 'InternalTransfer',
    payload: {
      fromAccountId,
      toAccountId,
      amount
    }
  })
}
