import { Bridge } from './bridge'

export function backup(bridge: Bridge, destinationPath: string): Promise<void> {
  return bridge({
    cmd: 'Backup',
    payload: destinationPath
  })
}

export function restoreBackup(bridge: Bridge, backupPath: string): Promise<void> {
  return bridge({
    cmd: 'RestoreBackup',
    payload: backupPath
  })
}