import { getOrInitWindow } from '../index.js'

import { app, ipcMain } from 'electron'
import { download } from 'electron-dl'

const downloadItems = {}

export function initNftDownloadHandlers() {
    ipcMain.removeHandler('nft-download')
    ipcMain.handle('nft-download', async (event, url, destination, nftId, accountIndex) => {
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
                getOrInitWindow('main').webContents.send('nft-download-done', { nftId, accountIndex })
            },
            onCancel: () => {
                delete downloadItems[nftId]
                getOrInitWindow('main').webContents.send('nft-download-interrupted', { nftId, accountIndex })
            },
            onStarted: (item) => (downloadItems[nftId] = item),
        })
    })

    ipcMain.removeHandler('cancel-nft-download')
    ipcMain.handle('cancel-nft-download', async (event, nftId) => {
        const downloadItem = downloadItems[nftId]
        downloadItem?.cancel()
    })
}
