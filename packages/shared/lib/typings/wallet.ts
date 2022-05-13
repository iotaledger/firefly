import { AccountIdentifier } from './account'
import { AccountManager, Account as StardustAccount } from '@iota/wallet'

import { Bridge, CommunicationIds } from './bridge'
import { IClientOptions } from '@core/network'
import { Transfer } from './message'
import { MnemonicPayload } from './mnemonic'
import { Account } from './account'
import { Message } from './message'
import { Writable } from 'svelte/store'
import { HistoryDataProps } from './market'
import { WalletAccount } from './walletAccount'

export interface AccountMessage extends Message {
    account: number
}

type BalanceTimestamp = {
    timestamp: number
    balance: number
}

export type BalanceHistory = {
    [HistoryDataProps.ONE_HOUR]: BalanceTimestamp[]
    [HistoryDataProps.SEVEN_DAYS]: BalanceTimestamp[]
    [HistoryDataProps.TWENTY_FOUR_HOURS]: BalanceTimestamp[]
    [HistoryDataProps.ONE_MONTH]: BalanceTimestamp[]
}

export interface StrongholdStatus {
    snapshot: {
        status: 'Locked' | 'Unlocked'
    }
    snapshotPath: string
}

export interface DateDiff {
    unit: string
    value?: number
}

export interface LoggerOutput {
    name?: string
    level_filter: 'off' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
    target_filters?: string[]
}

export interface LoggerConfig {
    color_enabled?: boolean
    outputs?: LoggerOutput[]
}

export interface StrongholdPasswordChange {
    currentPassword: string
    newPassword: string
}

export interface Duration {
    secs: number
    nanos: number
}

export function backup(
    bridge: Bridge,
    __ids: CommunicationIds,
    destinationPath: string,
    password: string
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'Backup',
        payload: {
            destination: destinationPath,
            password,
        },
    })
}

export function restoreBackup(
    bridge: Bridge,
    __ids: CommunicationIds,
    backupPath: string,
    password: string
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'RestoreBackup',
        payload: {
            backupPath,
            password,
        },
    })
}

export function setStrongholdPassword(bridge: Bridge, __ids: CommunicationIds, password: string): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SetStrongholdPassword',
        payload: password,
    })
}

export function setStoragePassword(bridge: Bridge, __ids: CommunicationIds, password: string): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SetStoragePassword',
        payload: password,
    })
}

export function deleteStorage(bridge: Bridge, __ids: CommunicationIds): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'DeleteStorage',
    })
}

export function send(
    bridge: Bridge,
    __ids: CommunicationIds,
    fromAccountId: AccountIdentifier,
    transfer: Transfer
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SendTransfer',
        payload: {
            transfer,
            accountId: fromAccountId,
        },
    })
}

export function generateMnemonic(bridge: Bridge, __ids: CommunicationIds): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GenerateMnemonic',
    })
}

export function storeMnemonic(bridge: Bridge, __ids: CommunicationIds, payload: MnemonicPayload): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'StoreMnemonic',
        payload,
    })
}

export function verifyMnemonic(bridge: Bridge, __ids: CommunicationIds, payload: string): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'VerifyMnemonic',
        payload,
    })
}

export function getStrongholdStatus(bridge: Bridge, __ids: CommunicationIds): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetStrongholdStatus',
    })
}

export function lockStronghold(bridge: Bridge, __ids: CommunicationIds): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'LockStronghold',
    })
}

export function changeStrongholdPassword(
    bridge: Bridge,
    __ids: CommunicationIds,
    payload: StrongholdPasswordChange
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'ChangeStrongholdPassword',
        payload,
    })
}

export function setClientOptions(bridge: Bridge, __ids: CommunicationIds, payload: IClientOptions): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SetClientOptions',
        payload,
    })
}

export function getLedgerDeviceStatus(bridge: Bridge, __ids: CommunicationIds, isSimulator: boolean): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetLedgerStatus',
        payload: isSimulator,
    })
}

export function setStrongholdPasswordClearInterval(
    bridge: Bridge,
    __ids: CommunicationIds,
    payload: Duration
): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SetStrongholdPasswordClearInterval',
        payload,
    })
}

export function getLegacySeedChecksum(bridge: Bridge, __ids: CommunicationIds, payload: string): Promise<string> {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetSeedChecksum',
        payload,
    })
}
