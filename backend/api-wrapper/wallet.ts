import { AccountIdentifier } from './account'
import { Bridge, BridgeResponse } from './bridge'
import { Message, Transfer } from './message'

export function backup(bridge: Bridge<any>, destinationPath: string): Promise<BridgeResponse<any>> {
  return bridge({
    cmd: 'Backup',
    payload: destinationPath
  })
}

export function restoreBackup(bridge: Bridge<any>, backupPath: string): Promise<BridgeResponse<any>> {
  return bridge({
    cmd: 'RestoreBackup',
    payload: backupPath
  })
}

export function setStrongholdPassword(bridge: Bridge<any>, password: string): Promise<BridgeResponse<any>> {
  return bridge({
    cmd: 'SetStrongholdPassword',
    payload: password
  })
}

export function send(bridge: Bridge<Message>, fromAccountId: AccountIdentifier, transfer: Transfer): Promise<BridgeResponse<Message>> {
  return bridge({
    cmd: 'SendTransfer',
    payload: {
      transfer,
      accountId: fromAccountId
    }
  })
}
