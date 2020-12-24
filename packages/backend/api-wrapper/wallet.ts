import { AccountIdentifier } from './account'
import { Bridge } from './bridge'
import { Transfer } from './message'

export interface LoggerOutput {
  name?: string
  level_filter: 'off' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
  target_filters?: string[]
}

export interface LoggerConfig {
  color_enabled?: boolean
  outputs?: LoggerOutput[]
}

export function backup(bridge: Bridge, __id: string, destinationPath: string) {
  return bridge({
    id: __id,
    cmd: 'Backup',
    payload: destinationPath
  })
}

export function restoreBackup(bridge: Bridge, __id: string, backupPath: string, password: string) {
  return bridge({
    id: __id,
    cmd: 'RestoreBackup',
    payload: {
      backupPath,
      password
    }
  })
}

export function setStrongholdPassword(bridge: Bridge, __id: string, password: string) {
  return bridge({
    id: __id,
    cmd: 'SetStrongholdPassword',
    payload: password
  })
}

export function send(bridge: Bridge, __id: string, fromAccountId: AccountIdentifier, transfer: Transfer) {
  return bridge({
    id: __id,
    cmd: 'SendTransfer',
    payload: {
      transfer,
      accountId: fromAccountId
    }
  })
}
