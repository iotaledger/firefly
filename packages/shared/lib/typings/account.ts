import { Bridge, CommunicationIds } from './bridge'
import { Message } from './message'
import { Address } from './address'
import { ClientOptions } from './client'
import { NodeAuth } from './node'
import { Duration } from './wallet'

export enum MessageType {}

export interface Balance {
    total: number
    available: number
    incoming: number
    outgoing: number
}

export interface ListMessagesFilter {
    messageType: MessageType
    count: number
    from: number
}

export interface AccountSyncOptions {
    addressIndex?: number
    gapLimit?: number
    accountDiscoveryThreshold?: number
    skipPersistance?: boolean
}

export type Account = {
    id: string
    alias: string
    createdAt: string
    clientOptions: ClientOptions
    index: number
    lastSyncedAt: string
    signerType: SignerType
    storagePath: string
    messages: Message[]
    addresses: Address[]
}

export type AccountMetadata = {
    balance: number
    incoming: number
    outgoing: number
    depositAddress: string
}

export type AccountIdentifier = number | string

export interface SignerType {
    type: 'Stronghold' | 'LedgerNano' | 'LedgerNanoSimulator'
}

export interface AccountToCreate {
    clientOptions: ClientOptions
    signerType: SignerType
    alias?: string
    createdAt?: string
    allowCreateMultipleEmptyAccounts?: boolean
}

export interface SyncedAccount {
    index: number
    id: string
    depositAddress: Address
    isEmpty: boolean
    addresses: Address[]
    messages: Message[]
}

export function createAccount(bridge: Bridge, __ids: CommunicationIds, account: AccountToCreate): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'CreateAccount',
        payload: account,
    })
}

export function removeAccount(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'RemoveAccount',
        payload: accountId,
    })
}

export function getAccount(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetAccount',
        payload: accountId,
    })
}

export function getAccounts(bridge: Bridge, __ids: CommunicationIds): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetAccounts',
    })
}

export function syncAccounts(
    bridge: Bridge,
    __ids: CommunicationIds,
    addressIndex?: number,
    gapLimit?: number,
    accountDiscoveryThreshold?: number
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SyncAccounts',
        payload: { addressIndex, gapLimit, accountDiscoveryThreshold },
    })
}

export function startBackgroundSync(
    bridge: Bridge,
    __ids: CommunicationIds,
    pollingInterval: Duration,
    automaticOutputConsolidation: boolean,
    gapLimit: number
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'StartBackgroundSync',
        payload: { pollingInterval, automaticOutputConsolidation, gapLimit },
    })
}

export function stopBackgroundSync(bridge: Bridge, __ids: CommunicationIds): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'StopBackgroundSync',
    })
}

export function internalTransfer(
    bridge: Bridge,
    __ids: CommunicationIds,
    fromAccountId: AccountIdentifier,
    toAccountId: AccountIdentifier,
    amount: number
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'InternalTransfer',
        payload: {
            fromAccountId,
            toAccountId,
            amount,
        },
    })
}

export function areLatestAddressesUnused(bridge: Bridge, __ids: CommunicationIds): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'IsLatestAddressUnused',
    })
}

enum AccountMethod {
    GenerateAddress,
    GetUnusedAddress,
    ListMessages,
    ListAddresses,
    GetBalance,
    GetLatestAddress,
    SyncAccount,
    IsLatestAddressUnused,
    SetAlias,
    GetNodeInfo,
}

function _callAccountMethod(
    bridge: Bridge,
    __ids: CommunicationIds,
    methodName: AccountMethod,
    accountId: AccountIdentifier,
    data: unknown = void 0
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
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

export function setAlias(
    bridge: Bridge,
    __ids: CommunicationIds,
    accountId: AccountIdentifier,
    payload: string
): Promise<string> {
    return _callAccountMethod(bridge, __ids, AccountMethod.SetAlias, accountId, payload)
}

export function isLatestAddressUnused(
    bridge: Bridge,
    __ids: CommunicationIds,
    accountId: AccountIdentifier
): Promise<string> {
    return _callAccountMethod(bridge, __ids, AccountMethod.IsLatestAddressUnused, accountId)
}
export function generateAddress(
    bridge: Bridge,
    __ids: CommunicationIds,
    accountId: AccountIdentifier
): Promise<string> {
    return _callAccountMethod(bridge, __ids, AccountMethod.GenerateAddress, accountId)
}

export function getUnusedAddress(
    bridge: Bridge,
    __ids: CommunicationIds,
    accountId: AccountIdentifier
): Promise<string> {
    return _callAccountMethod(bridge, __ids, AccountMethod.GetUnusedAddress, accountId)
}

export function listMessages(
    bridge: Bridge,
    __ids: CommunicationIds,
    accountId: AccountIdentifier,
    filters?: ListMessagesFilter
): Promise<string> {
    return _callAccountMethod(bridge, __ids, AccountMethod.ListMessages, accountId, filters || {})
}

export function listAddresses(
    bridge: Bridge,
    __ids: CommunicationIds,
    accountId: AccountIdentifier,
    unspent?: boolean
): Promise<string> {
    return _callAccountMethod(bridge, __ids, AccountMethod.ListAddresses, accountId, { unspent })
}

export function getBalance(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier): Promise<string> {
    return _callAccountMethod(bridge, __ids, AccountMethod.GetBalance, accountId)
}

export function latestAddress(bridge: Bridge, __ids: CommunicationIds, accountId: AccountIdentifier): Promise<string> {
    return _callAccountMethod(bridge, __ids, AccountMethod.GetLatestAddress, accountId)
}

export function syncAccount(
    bridge: Bridge,
    __ids: CommunicationIds,
    accountId: AccountIdentifier,
    options?: AccountSyncOptions
): Promise<string> {
    return _callAccountMethod(bridge, __ids, AccountMethod.SyncAccount, accountId, options || {})
}

export function getNodeInfo(
    bridge: Bridge,
    __ids: CommunicationIds,
    accountId: AccountIdentifier,
    url?: string,
    auth?: NodeAuth
): Promise<string> {
    return _callAccountMethod(bridge, __ids, AccountMethod.GetNodeInfo, accountId, [
        url,
        auth?.jwt,
        [auth?.username, auth?.password],
    ])
}
