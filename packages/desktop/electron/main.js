const { app, ipcMain, protocol, BrowserWindow } = require('electron')
const path = require('path')
const Keychain = require('./keychain');

/**
 * Define wallet windows
 */
const windows = {
    main: null,
};

/**
 * Set environment mode
 */
const devMode = process.env.NODE_ENV === 'development';

function createWindow() {
    /**
     * Register iota file protocol
     */
    try {
        protocol.registerFileProtocol('iota', (request, callback) => {
            callback(request.url.replace('iota:/', app.getAppPath()).split('?')[0].split('#')[0]);
        });
    } catch (error) {
        console.log(error); //eslint-disable-line no-console
    }

    // Create the browser window.
    windows.main = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    })

    // and load the index.html of the app.
    windows.main.loadFile('../public/index.html')

    windows.main.webContents.openDevTools()
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

/**
 * Define deep link state
 */
let deepLinkUrl = null;

/**
 * Create a single instance only
 */
const isFirstInstance = app.requestSingleInstanceLock();

if (!isFirstInstance) {
    app.quit();
}

app.on('second-instance', (_e, args) => {
    if (windows.main) {
        if (args.length > 1) {
            const params = args.find((arg) => arg.startsWith('iota://'));

            if (params) {
                windows.main.webContents.send('deepLink-params', params);
            }
        }
        if (windows.main.isMinimized()) {
            windows.main.restore();
        }
        windows.main.focus();
    }
});

/**
 * Register iota:// protocol for deep links
 * Set Firefly as the default handler for iota:// protocol
 */
protocol.registerSchemesAsPrivileged([{ scheme: 'iota', privileges: { secure: true, standard: true } }])
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('iota', process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient('iota')
}

/**
 * Proxy deep link event to the wallet application
 */
app.on('open-url', (event, url) => {
    event.preventDefault()
    deepLinkUrl = url;
    if (windows.main) {
        windows.main.webContents.send('deepLink-params', url)
    }
});

/**
 * Proxy deep link event to the wallet application
 */
ipcMain.on('deepLink-request', () => {
    if (deepLinkUrl) {
        windows.main.webContents.send('deepLink-params', deepLinkUrl)
        deepLinkUrl = null
    }
});