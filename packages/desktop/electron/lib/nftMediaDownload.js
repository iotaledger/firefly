import { getOrInitWindow } from '../main'

const { app, ipcMain } = require('electron')
const { download } = require('electron-dl')
const fs = require('fs')

const downloadItems = {}

export function initNftMediaDownload() {
    ipcMain.handle('download', async (event, url, destination, nftId, accountIndex) => {
        const userPath = app.getPath('userData')
        const directory = app.isPackaged ? userPath : __dirname

        await download(getOrInitWindow('main'), url, {
            directory: directory + '/__storage__/' + destination,
            filename: 'original',
            saveAs: false,
            showBadge: true,
            showProgressBar: true,
            onCompleted: () => {
                delete downloadItems[nftId]
                getOrInitWindow('main').webContents.send('download-done', { nftId, accountIndex })
            },
            onCancel: () => {
                delete downloadItems[nftId]
                getOrInitWindow('main').webContents.send('download-interrupted', { nftId, accountIndex })
            },
            onStarted: (item) => (downloadItems[nftId] = item),
        })
    })

    ipcMain.handle('check-if-file-exists', (_e, filePath) => {
        const userPath = app.getPath('userData')
        const directory = app.isPackaged ? userPath : __dirname

        return fs.existsSync(`${directory}/__storage__/${filePath}`)
    })

    ipcMain.handle('cancel-download', async (event, nftId) => {
        const downloadItem = downloadItems[nftId]
        downloadItem?.cancel()
    })
}
