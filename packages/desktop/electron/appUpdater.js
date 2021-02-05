const { ipcMain } = require('electron')
const { autoUpdater, CancellationToken } = require('electron-updater')
const path = require('path')
const packageJson = require('../package.json')
const electronLog = require('electron-log')

let autoUpdateMainWindow;
let versionDetails = {
    upToDate: true,
    currentVersion: packageJson.version,
    newVersion: '',
    newVersionReleaseDate: new Date(),
    changelog: ''
}
let downloadCancellation

function initAutoUpdate(mainWindow, devMode) {
    autoUpdateMainWindow = mainWindow

    autoUpdater.logger = electronLog
    autoUpdater.logger.transports.file.level = "info"

    // Disable automatic update downloads
    autoUpdater.autoDownload = false;

    if (devMode) {
        autoUpdater.updateConfigPath = path.join(__dirname, '..', 'dev-app-update.yaml');
    }

    ipcMain.handle('update-download', () => updateDownload())
    ipcMain.handle('update-cancel', () => updateCancel())
    ipcMain.handle('update-install', () => updateInstall())
    ipcMain.handle('update-get-version-details', () => getVersionDetails())

    autoUpdater.on('update-available', (info) => {
        versionDetails.upToDate = false;
        versionDetails.newVersion = info.version
        versionDetails.newVersionReleaseDate = new Date(info.releaseDate)
        // release notes from GH are HTML so strip tags out
        let releaseNotes = info.releaseNotes || '';
        releaseNotes = releaseNotes.replace(/<[^>]*>?/gm, '')
        versionDetails.changelog = releaseNotes
        autoUpdateMainWindow.webContents.send('version-details', versionDetails)
    })
    autoUpdater.on('download-progress', (progressObj) => {
        autoUpdateMainWindow.webContents.send('version-progress', progressObj)
    })

    autoUpdater.on('update-downloaded', (info) => {
        autoUpdateMainWindow.webContents.send('version-complete', info)
    });

    autoUpdater.on('error', (err) => {
        autoUpdateMainWindow.webContents.send('version-error', err)
    });

    autoUpdateMainWindow.webContents.send('version-details', versionDetails)
    autoUpdater.checkForUpdates()
}

function updateDownload() {
    downloadCancellation = new CancellationToken()
    autoUpdater.downloadUpdate(downloadCancellation)
}

function updateCancel() {
    if (downloadCancellation) {
        downloadCancellation.cancel()
        downloadCancellation = undefined;
    }
}

function updateInstall() {
    autoUpdater.quitAndInstall();
}

function getVersionDetails() {
    return versionDetails
}

module.exports = {
    initAutoUpdate,
    getVersionDetails,
    updateDownload,
    updateCancel,
    updateInstall
}