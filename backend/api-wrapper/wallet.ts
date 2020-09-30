import { Bridge, BridgeResponse } from './bridge'

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
