import { getOrInitWindow, updateAppVersionDetails } from '../main'
const { ipcMain } = require('electron')
const { autoUpdater, CancellationToken } = require('electron-updater')
const electronLog = require('electron-log')

let downloadCancellationToken
let ipcHandlersRegistered = false

export function initAutoUpdate() {
    if (!ipcHandlersRegistered) {
        // Registering more than one handler for an event causes an error
        // This will happen if the main window is closed and reopened on macOS since the app does not quit
        ipcMain.handle('check-for-app-update', () => checkForAppUpdate())
        ipcMain.handle('download-app-update', () => downloadAppUpdate())
        ipcMain.handle('install-app-update', () => installAppUpdate())
        ipcMain.handle('cancel-app-update', () => cancelAppUpdate())
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
        getOrInitWindow('main').webContents.send('app-update-download-progress', progressObj)
    })

    autoUpdater.on('update-downloaded', (info) => {
        getOrInitWindow('main').webContents.send('app-update-download-complete', info)
    })

    autoUpdater.on('error', (err) => {
        getOrInitWindow('main').webContents.send('app-update-error', err)
    })

    checkForAppUpdate()
}

function checkForAppUpdate() {
    autoUpdater.checkForUpdates()
}

function downloadAppUpdate() {
    downloadCancellationToken = new CancellationToken()
    autoUpdater.downloadUpdate(downloadCancellationToken)
}

function installAppUpdate() {
    autoUpdater.quitAndInstall()
}

function cancelAppUpdate() {
    if (downloadCancellationToken) {
        downloadCancellationToken.cancel()
        downloadCancellationToken = undefined
    }
}
