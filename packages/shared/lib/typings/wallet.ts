import type { AccountIdentifier } from './account'
import type { Bridge, CommunicationIds } from './bridge'
import type { ClientOptions } from './client'
import type { Transfer } from './message'
import type { MnemonicPayload } from './mnemonic'

export interface StrongholdStatus {
    snapshot: {
        status: 'Locked' | 'Unlocked'
    }
    snapshotPath: string
}

export enum LedgerStatus {
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    Locked = 'Locked'
}

export interface LedgerStatusPayload {
    type: LedgerStatus
}

export interface LedgerAppInfo {
    name: string,
    version: string
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

export function backup(bridge: Bridge, __ids: CommunicationIds, destinationPath: string, password: string) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'Backup',
        payload: {
            destination: destinationPath,
            password,
        }
    })
}

export function restoreBackup(bridge: Bridge, __ids: CommunicationIds, backupPath: string, password: string) {
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

export function setStrongholdPassword(bridge: Bridge, __ids: CommunicationIds, password: string) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SetStrongholdPassword',
        payload: password,
    })
}

export function setStoragePassword(bridge: Bridge, __ids: CommunicationIds, password: string) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SetStoragePassword',
        payload: password,
    })
}

export function removeStorage(bridge: Bridge, __ids: CommunicationIds) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'DeleteStorage',
    })
}

export function send(bridge: Bridge, __ids: CommunicationIds, fromAccountId: AccountIdentifier, transfer: Transfer) {
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

export function generateMnemonic(bridge: Bridge, __ids: CommunicationIds) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GenerateMnemonic',
    })
}

export function storeMnemonic(bridge: Bridge, __ids: CommunicationIds, payload: MnemonicPayload) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'StoreMnemonic',
        payload,
    })
}

export function verifyMnemonic(bridge: Bridge, __ids: CommunicationIds, payload: string) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'VerifyMnemonic',
        payload,
    })
}

export function getStrongholdStatus(bridge: Bridge, __ids: CommunicationIds) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetStrongholdStatus',
    })
}

export function lockStronghold(bridge: Bridge, __ids: CommunicationIds) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'LockStronghold',
    })
}

export function changeStrongholdPassword(bridge: Bridge, __ids: CommunicationIds, payload: StrongholdPasswordChange) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'ChangeStrongholdPassword',
        payload,
    })
}

export function setClientOptions(bridge: Bridge, __ids: CommunicationIds, payload: ClientOptions) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SetClientOptions',
        payload,
    })
}

export function getLedgerDeviceStatus(bridge: Bridge, __ids: CommunicationIds, isSimulator: boolean) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetLedgerStatus',
        payload: isSimulator
    })
}

export function getLedgerOpenedApp(bridge: Bridge, __ids: CommunicationIds, isSimulator: boolean) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetLedgerOpenedApp',
        payload: isSimulator
    })
}

export function setStrongholdPasswordClearInterval(bridge: Bridge, __ids: CommunicationIds, payload: Duration) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'SetStrongholdPasswordClearInterval',
        payload,
    })
}

export function getLegacySeedChecksum(bridge: Bridge, __ids: CommunicationIds, payload: string) {
    return bridge({
        actorId: __ids.actorId,
        id: __ids.messageId,
        cmd: 'GetSeedChecksum',
        payload,
    })
}
