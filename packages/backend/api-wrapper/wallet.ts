import { AccountIdentifier } from './account'
import { Bridge } from './bridge'
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

export function setStoragePassword(bridge: Bridge, __id: string, password: string) {
  return bridge({
    id: __id,
    cmd: 'SetStoragePassword',
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

export function generateMnemonic(bridge: Bridge, __id: string,) {
  return bridge({
    id: __id,
    cmd: 'GenerateMnemonic',
  })
}

export function storeMnemonic(bridge: Bridge, __id: string, payload: MnemonicPayload) {
  return bridge({
    id: __id,
    cmd: 'StoreMnemonic',
    payload
  })
}

export function verifyMnemonic(bridge: Bridge, __id: string, payload: string) {
  return bridge({
    id: __id,
    cmd: 'VerifyMnemonic',
    payload
  })
}