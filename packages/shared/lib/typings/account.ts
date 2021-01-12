import type { Bridge } from './bridge'
import type { Message } from './message'
import type { Address } from './address'
import type { ClientOptions } from './client'

export enum MessageType {}

export interface ListMessagesFilter {
    messageType: MessageType
    count: number
    from: number
}

export interface SyncAccountOptions {
    addressIndex?: number
    gapLimit?: number
    skipPersistance?: boolean
}

export interface Account {
    id: string
    mnemonic: string
    alias: string
    createdAt: string
    messages: Message[]
    addresses: Address[]
}

export type AccountIdentifier = number | string

export interface AccountToCreate {
    clientOptions: ClientOptions
    mnemonic?: string
    alias?: string
    createdAt?: string
}

export interface SyncedAccount {
    accountId: string
    depositAddress: Address
    addresses: Address[]
    messages: Message[]
}

export function createAccount(bridge: Bridge, __id: string, account: AccountToCreate): Promise<string> {
    return bridge({
        id: __id,
        cmd: 'CreateAccount',
        payload: account,
    })
}

export function removeAccount(bridge: Bridge, __id: string, accountId: AccountIdentifier): Promise<string> {
    return bridge({
        id: __id,
        cmd: 'RemoveAccount',
        payload: accountId,
    })
}

export function getAccount(bridge: Bridge, __id: string, accountId: AccountIdentifier): Promise<string> {
    return bridge({
        id: __id,
        cmd: 'GetAccount',
        payload: accountId,
    })
}

export function getAccounts(bridge: Bridge, __id: string): Promise<string> {
    return bridge({
        id: __id,
        cmd: 'GetAccounts',
    })
}

export function syncAccounts(bridge: Bridge, __id: string): Promise<string> {
    return bridge({
        id: __id,
        cmd: 'SyncAccounts',
    })
}

export function internalTransfer(
    bridge: Bridge,
    __id: string,
    fromAccountId: AccountIdentifier,
    toAccountId: AccountIdentifier,
    amount: number
): Promise<string> {
    return bridge({
        id: __id,
        cmd: 'InternalTransfer',
        payload: {
            fromAccountId,
            toAccountId,
            amount,
        },
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

function _callAccountMethod(
    bridge: Bridge,
    __id: string,
    methodName: AccountMethod,
    accountId: AccountIdentifier,
    data: any = void 0
): Promise<string> {
    return bridge({
        id: __id,
        cmd: 'CallAccountMethod',
        payload: {
            accountId,
            method: {
                name: AccountMethod[methodName],
                data,
            },
        },
    })
}

export function generateAddress(bridge: Bridge, __id: string, accountId: AccountIdentifier): Promise<string> {
    return _callAccountMethod(bridge, __id, AccountMethod.GenerateAddress, accountId)
}

export function listMessages(
    bridge: Bridge,
    __id: string,
    accountId: AccountIdentifier,
    filters?: ListMessagesFilter
): Promise<string> {
    return _callAccountMethod(bridge, __id, AccountMethod.ListMessages, accountId, filters || {})
}

export function listAddresses(bridge: Bridge, __id: string, accountId: AccountIdentifier, unspent?: boolean): Promise<string> {
    return _callAccountMethod(bridge, __id, AccountMethod.ListAddresses, accountId, { unspent })
}

export function availableBalance(bridge: Bridge, __id: string, accountId: AccountIdentifier): Promise<string> {
    return _callAccountMethod(bridge, __id, AccountMethod.GetAvailableBalance, accountId)
}

export function totalBalance(bridge: Bridge, __id: string, accountId: AccountIdentifier): Promise<string> {
    return _callAccountMethod(bridge, __id, AccountMethod.GetTotalBalance, accountId)
}

export function latestAddress(bridge: Bridge, __id: string, accountId: AccountIdentifier): Promise<string> {
    return _callAccountMethod(bridge, __id, AccountMethod.GetLatestAddress, accountId)
}

export function syncAccount(
    bridge: Bridge,
    __id: string,
    accountId: AccountIdentifier,
    options?: SyncAccountOptions
): Promise<string> {
    return _callAccountMethod(bridge, __id, AccountMethod.SyncAccount, accountId, options || {})
}
