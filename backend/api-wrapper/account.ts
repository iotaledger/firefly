import { Bridge, BridgeResponse } from './bridge'
import { Message } from './message'
import { Address } from './address'
import { ClientOptions } from './client'

export interface Account {
  id: string;
  mnemonic: string;
  alias: string;
  createdAt: string;
  messages: Message[];
  addresses: Address[];
}

export type AccountIdentifier = string | number

export interface AccountToCreate {
  clientOptions: ClientOptions;
  mnemonic?: string;
  alias?: string;
  createdAt?: string;
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

export function syncAccounts(bridge: Bridge<any>): Promise<BridgeResponse<any>> {
  return bridge({ cmd: 'SyncAccounts' })
}
