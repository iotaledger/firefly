import { AccountIdentifier } from './account'
import { Bridge } from './bridge'
import { Message, Transfer } from './message'

export function backup(bridge: Bridge, destinationPath: string) {
  return bridge({
    cmd: 'Backup',
    payload: destinationPath
  })
}

export function restoreBackup(bridge: Bridge, backupPath: string) {
  return bridge({
    cmd: 'RestoreBackup',
    payload: backupPath
  })
}

export function setStrongholdPassword(bridge: Bridge, password: string) {
  return bridge({
    cmd: 'SetStrongholdPassword',
    payload: password
  })
}

export function send(bridge: Bridge, fromAccountId: AccountIdentifier, transfer: Transfer) {
  return bridge({
    cmd: 'SendTransfer',
    payload: {
      transfer,
      accountId: fromAccountId
    }
  })
}
