import { getOrInitWindow } from '../main'
const { ipcMain } = require('electron')
const { autoUpdater, CancellationToken } = require('electron-updater')
const packageJson = require('../../package.json')
const electronLog = require('electron-log')

const versionDetails = {
    upToDate: true,
    currentVersion: packageJson.version,
    newVersion: '',
    newVersionReleaseDate: new Date(),
    changelog: '',
}
let downloadCancellation
let ipcHandlersRegistered = false

export function initAutoUpdate(mainWindow) {
    if (!ipcHandlersRegistered) {
        // Registering more than one handler for an event causes an error
        // This will happen if the main window is closed and reopened on macOS since the app does not quit
        ipcMain.handle('update-download', () => updateDownload())
        ipcMain.handle('update-cancel', () => updateCancel())
        ipcMain.handle('update-install', () => updateInstall())
        ipcMain.handle('update-check', () => updateCheck())
        ipcMain.handle('update-get-version-details', () => getVersionDetails())
        ipcHandlersRegistered = true
    }

    autoUpdater.logger = electronLog
    autoUpdater.logger.transports.file.level = 'info'

    // Disable automatic update downloads
    autoUpdater.autoDownload = false

    autoUpdater.on('update-available', (info) => {
        versionDetails.upToDate = false
        versionDetails.newVersion = info.version
        versionDetails.newVersionReleaseDate = new Date(info.releaseDate)
        // release notes from GH are HTML so strip tags out
        let releaseNotes = info.releaseNotes || ''
        releaseNotes = releaseNotes.replace(/<[^>]*>?/gm, '')
        versionDetails.changelog = releaseNotes
        getOrInitWindow('main').webContents.send('version-details', versionDetails)
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

    mainWindow.webContents.send('version-details', versionDetails)

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

export function updateCheck() {
    autoUpdater.checkForUpdates()
}

export function getVersionDetails() {
    return versionDetails
}
