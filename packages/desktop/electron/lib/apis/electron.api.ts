import { ipcRenderer } from 'electron'
import fs from 'fs'
import { PincodeManager, DeepLinkManager, NotificationManager } from '../managers'
import { MenuEvent, menuState } from '../menu'
import { GetInfoEvent, UpdateEvent, WindowEvent } from '../enums'
import { hookErrorLogger } from 'shared/lib/shell/errorLogger'
import { IpcRendererEvent } from '../types'

let activeProfileId: string | null = null
const eventListeners = {}

const ElectronApi = {
    updateAppSettings(settings: unknown): Promise<void> {
        return ipcRenderer.invoke('update-app-settings', settings)
    },
    getActiveProfile(): string | null {
        return activeProfileId
    },
    updateActiveProfile(id: string): void {
        activeProfileId = id
    },
    async renameProfileFolder(oldPath: string, newPath: string): Promise<void> {
        return ipcRenderer.invoke(GetInfoEvent.Path, 'userData').then((userDataPath) => {
            if (oldPath.startsWith(userDataPath)) {
                try {
                    fs.renameSync(oldPath, newPath)
                } catch (err) {
                    console.error(err)
                }
            }
        })
    },
    async removeProfileFolder(profilePath: string): Promise<void> {
        return ipcRenderer.invoke(GetInfoEvent.Path, 'userData').then((userDataPath) => {
            // Check that the removing profile path matches the user data path
            // so that we don't try and remove things outside our scope
            if (profilePath.startsWith(userDataPath)) {
                try {
                    // Sometime the DB can still be locked while it is flushing
                    // so retry if we receive a busy exception
                    fs.rmdirSync(profilePath, { recursive: true, maxRetries: 30, retryDelay: 500 })
                } catch (err) {
                    console.error(err)
                }
            }
        })
    },
    async listProfileFolders(profileStoragePath: string): Promise<void | string[]> {
        return ipcRenderer.invoke(GetInfoEvent.Path, 'userData').then((userDataPath) => {
            // Check that the profile path matches the user data path
            // so that we don't try and remove things outside our scope
            if (profileStoragePath.startsWith(userDataPath)) {
                try {
                    // Get a list of all the profile folders in storage
                    return fs.readdirSync(profileStoragePath)
                } catch (err) {
                    if (err.code === 'ENOENT') {
                        // The __storage__ directory doesn't exist
                        return []
                    }
                    console.error(err)
                }
            }
        })
    },
    PincodeManager: PincodeManager,
    DeepLinkManager: DeepLinkManager,
    NotificationManager: NotificationManager,
    async getStrongholdBackupDestination(defaultPath: string): Promise<null | string> {
        return ipcRenderer
            .invoke('show-save-dialog', {
                properties: ['createDirectory', 'showOverwriteConfirmation'],
                defaultPath,
                filters: [{ name: 'Stronghold Files', extensions: ['stronghold'] }],
            })
            .then((result) => {
                if (result.canceled) {
                    return null
                }

                return result.filePath
            })
    },
    async exportTransactionHistory(defaultPath: string, contents: string): Promise<null | string> {
        return ipcRenderer
            .invoke('show-save-dialog', {
                properties: ['createDirectory', 'showOverwriteConfirmation'],
                defaultPath,
                filters: [{ name: 'CSV Files', extensions: ['csv'] }],
            })
            .then((result) => {
                if (result.canceled) {
                    return null
                }
                return new Promise((resolve, reject) => {
                    try {
                        fs.writeFileSync(result.filePath, contents)
                        resolve(result.filePath)
                    } catch (err) {
                        reject(err)
                    }
                })
            })
    },

    getUserDataPath(): Promise<string> {
        return ipcRenderer.invoke(GetInfoEvent.Path, 'userData')
    },
    getDiagnostics(): Promise<string> {
        return ipcRenderer.invoke('diagnostics')
    },
    getOS(): Promise<string> {
        return ipcRenderer.invoke(GetInfoEvent.Os)
    },
    getMachineId(): Promise<string> {
        return ipcRenderer.invoke(GetInfoEvent.MachineId)
    },
    updateDownload(): Promise<void> {
        return ipcRenderer.invoke(UpdateEvent.Download)
    },
    updateCancel(): Promise<void> {
        return ipcRenderer.invoke(UpdateEvent.Cancel)
    },
    updateInstall(): Promise<void> {
        return ipcRenderer.invoke(UpdateEvent.Install)
    },
    updateCheck(): Promise<void> {
        return ipcRenderer.invoke(UpdateEvent.Check)
    },
    getVersionDetails(): Promise<void> {
        return ipcRenderer.invoke(GetInfoEvent.VersionDetails)
    },
    updateMenu(attribute: keyof typeof menuState, value: typeof menuState[keyof typeof menuState]): Promise<void> {
        return ipcRenderer.invoke(MenuEvent.Update, { [attribute]: value })
    },
    popupMenu(): Promise<void> {
        return ipcRenderer.invoke(MenuEvent.Popup)
    },
    minimize(): Promise<void> {
        return ipcRenderer.invoke(WindowEvent.Minimize)
    },
    maximize(): Promise<void> {
        return ipcRenderer.invoke(WindowEvent.Maximize)
    },
    isMaximized(): Promise<boolean> {
        return ipcRenderer.invoke(WindowEvent.isMaximized)
    },
    close(): Promise<void> {
        return ipcRenderer.invoke(WindowEvent.Close)
    },
    openUrl(url: string): Promise<void> {
        return ipcRenderer.invoke('open-url', url)
    },
    copyFile(sourceFilePath: string, destinationFilePath: string): Promise<void> {
        return ipcRenderer.invoke('copy-file', sourceFilePath, destinationFilePath)
    },
    unhandledException(errorType: string, error: Error): Promise<void> {
        return ipcRenderer.invoke('handle-error', errorType, error)
    },
    // Adds native window wallet event listener
    onEvent(event: IpcRendererEvent, callback: () => unknown): void {
        let listeners = eventListeners[event]
        if (!listeners) {
            listeners = eventListeners[event] = []
        }
        listeners.push(callback)
        ipcRenderer.removeAllListeners(event)
        ipcRenderer.on(event, (e, args) => {
            listeners.forEach((call) => {
                call(args)
            })
        })
    },
    removeListenersForEvent(event: IpcRendererEvent): void {
        eventListeners[event] = []
        return void ipcRenderer.removeAllListeners(event)
    },
    async saveRecoveryKit(recoveryKitData: ArrayBuffer): Promise<void> {
        return ipcRenderer
            .invoke('show-save-dialog', {
                properties: ['createDirectory', 'showOverwriteConfirmation'],
                defaultPath: 'firefly-recovery-kit.pdf',
                filters: [
                    { name: 'Pdf Document', extensions: ['pdf'] },
                    { name: 'All Files', extensions: ['*'] },
                ],
            })
            .then((result) => {
                if (result.canceled) {
                    return
                }

                try {
                    fs.writeFileSync(result.filePath, Buffer.from(recoveryKitData))
                } catch (err) {
                    console.error(err)
                }
            })
    },
    hookErrorLogger,
}

export default ElectronApi
