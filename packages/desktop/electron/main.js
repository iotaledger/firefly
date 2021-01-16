const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')
const Keychain = require('./keychain');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    // and load the index.html of the app.
    mainWindow.loadFile('../public/index.html')

    mainWindow.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.allowRendererProcessReuse = false

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// IPC handlers for APIs exposed from main process

// Keychain
ipcMain.handle('keychain-getAll', (_e) => {
    return Keychain.getAll()
})
ipcMain.handle('keychain-get', (_e, key) => {
    return Keychain.get(key)
})
ipcMain.handle('keychain-set', (_e, key, content) => {
    return Keychain.set(key, content)
})
ipcMain.handle('keychain-remove', (_e, key) => {
    return Keychain.remove(key)
})
