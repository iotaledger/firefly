import { AccountIdentifier } from './account'
import { Bridge, CommunicationIds } from './bridge'
import { Transfer } from './message'
import { MnemonicPayload } from './mnemonic'

export interface LoggerOutput {
  name?: string
  level_filter: 'off' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
  target_filters?: string[]
}

export interface LoggerConfig {
  color_enabled?: boolean
  outputs?: LoggerOutput[]
}

export function backup(bridge: Bridge, __ids: CommunicationIds, destinationPath: string) {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'Backup',
    payload: destinationPath
  })
}

export function restoreBackup(bridge: Bridge, __ids: CommunicationIds, backupPath: string, password: string) {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'RestoreBackup',
    payload: {
      backupPath,
      password
    }
  })
}

export function setStrongholdPassword(bridge: Bridge, __ids: CommunicationIds, password: string) {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'SetStrongholdPassword',
    payload: password
  })
}

export function setStoragePassword(bridge: Bridge, __ids: CommunicationIds, password: string) {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'SetStoragePassword',
    payload: password
  })
}

export function send(bridge: Bridge, __ids: CommunicationIds, fromAccountId: AccountIdentifier, transfer: Transfer) {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'SendTransfer',
    payload: {
      transfer,
      accountId: fromAccountId
    }
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
    payload
  })
}

export function verifyMnemonic(bridge: Bridge, __ids: CommunicationIds, payload: string) {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'VerifyMnemonic',
    payload
  })
}

export function getStrongholdStatus(bridge: Bridge, __ids: CommunicationIds) {
  return bridge({
    actorId: __ids.actorId,
    id: __ids.messageId,
    cmd: 'GetStrongholdStatus',
  })
}
