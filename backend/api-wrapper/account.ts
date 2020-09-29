import { Bridge } from './bridge'
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

export function createAccount(bridge: Bridge, account: AccountToCreate): Promise<Account> {
  return bridge({
    cmd: 'CreateAccount',
    payload: account
  })
}
