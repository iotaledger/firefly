import { getOrInitWindow, updateAppVersionDetails } from '../index.js'
import { ipcMain } from 'electron'
import { autoUpdater, CancellationToken } from 'electron-updater'
import electronLog from 'electron-log'

let downloadCancellation
let ipcHandlersRegistered = false

export function initAutoUpdate() {
    if (!ipcHandlersRegistered) {
        // Registering more than one handler for an event causes an error
        // This will happen if the main window is closed and reopened on macOS since the app does not quit
        ipcMain.handle('update-download', () => updateDownload())
        ipcMain.handle('update-cancel', () => updateCancel())
        ipcMain.handle('update-install', () => updateInstall())
        ipcMain.handle('update-check', () => updateCheck())
        ipcHandlersRegistered = true
    }

    autoUpdater.logger = electronLog
    autoUpdater.logger.transports.file.level = 'info'

    // Disable automatic update downloads
    autoUpdater.autoDownload = false

    autoUpdater.on('update-available', (info) => {
        // release notes from GH are HTML so strip tags out
        let releaseNotes = info.releaseNotes || ''
        releaseNotes = releaseNotes.replace(/<[^>]*>?/gm, '')
        const versionDetails = {
            upToDate: false,
            newVersion: info.version,
            newVersionReleaseDate: new Date(info.releaseDate),
            changelog: releaseNotes,
        }

        updateAppVersionDetails(versionDetails)
    })
    autoUpdater.on('download-progress', (progressObj) => {
        getOrInitWindow('main').webContents.send('version-progress', progressObj)
    })

    autoUpdater.on('update-downloaded', (info) => {
        getOrInitWindow('main').webContents.send('version-complete', info)
    })

    autoUpdater.on('error', (err) => {
        getOrInitWindow('main').webContents.send('version-error', err)
    })

    updateCheck()
}

export function updateDownload() {
    downloadCancellation = new CancellationToken()
    autoUpdater.downloadUpdate(downloadCancellation)
}

export function updateCancel() {
    if (downloadCancellation) {
        downloadCancellation.cancel()
        downloadCancellation = undefined
    }
}

export function updateInstall() {
    autoUpdater.quitAndInstall()
}

export async function updateCheck() {
    try {
        await autoUpdater.checkForUpdates()
    } catch (error) {
        console.error(error)
    }
}
