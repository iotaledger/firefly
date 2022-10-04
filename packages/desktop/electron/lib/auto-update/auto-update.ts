import { ipcMain } from 'electron'
import { ProgressInfo } from 'electron-builder'
import { autoUpdater, CancellationToken, UpdateInfo } from 'electron-updater'
import electronLog from 'electron-log'
import { getOrInitWindow, updateAppVersionDetails } from '../main'
import { AutoUpdaterEvent, VersionEvent, UpdateEvent } from './enums'

let downloadCancellation: CancellationToken | null = null
let isIpcHandlersRegistered = false

export function initAutoUpdate(): void {
    if (!isIpcHandlersRegistered) {
        initIpcHandlers()
        isIpcHandlersRegistered = true
    }
    setAutoUpdaterSettings()
    initAutoUpdateListeners()
    void autoUpdater.checkForUpdates()
}

function initIpcHandlers(): void {
    function updateDownload(): void {
        downloadCancellation = new CancellationToken()
        void autoUpdater.downloadUpdate(downloadCancellation)
    }
    function updateCancel(): void {
        downloadCancellation?.cancel()
        downloadCancellation = null
    }
    // Registering more than one handler for an event causes an error
    // This will happen if the main window is closed and reopened on macOS since the app does not quit
    ipcMain.handle(UpdateEvent.Download, updateDownload)
    ipcMain.handle(UpdateEvent.Cancel, updateCancel)
    ipcMain.handle(UpdateEvent.Install, () => autoUpdater.quitAndInstall())
    ipcMain.handle(UpdateEvent.Check, () => autoUpdater.checkForUpdates())
}

function setAutoUpdaterSettings(): void {
    const logger = electronLog
    logger.transports.file.level = 'info'
    autoUpdater.logger = logger
    autoUpdater.autoDownload = false
}

function initAutoUpdateListeners(): void {
    autoUpdater.on(AutoUpdaterEvent.DownloadProgress, (progressInfo: ProgressInfo) => {
        getOrInitWindow('main').webContents.send(VersionEvent.Progress, progressInfo)
    })
    autoUpdater.on(AutoUpdaterEvent.Downloaded, (updateInfo: UpdateInfo) => {
        getOrInitWindow('main').webContents.send(VersionEvent.Complete, updateInfo)
    })
    autoUpdater.on(AutoUpdaterEvent.Error, (error: Error) => {
        getOrInitWindow('main').webContents.send(VersionEvent.Error, error)
    })
    autoUpdater.on(AutoUpdaterEvent.Available, (info: UpdateInfo) => {
        // release notes from GH are HTML so strip tags out
        const releaseNotes = info.releaseNotes?.toString()?.replace(/<[^>]*>?/gm, '') ?? ''
        const versionDetails = {
            changelog: releaseNotes,
            newVersion: info.version,
            newVersionReleaseDate: new Date(info.releaseDate),
            upToDate: false,
        }
        updateAppVersionDetails(versionDetails)
    })
}
