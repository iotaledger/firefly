import { initAutoUpdate } from './lib/appUpdater'
const { app, dialog, ipcMain, protocol, shell, BrowserWindow, session } = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')
const Keychain = require('./lib/keychain')
const { initMenu, contextMenu } = require('./lib/menu')

/**
 * Set AppUserModelID for Windows notifications functionallity
 */
app.setAppUserModelId('org.iota.firefly')

/**
 * Terminate application if Node remote debugging detected
 */
const argv = process.argv.join()
const flagBlocklist = ['inspect', 'inspect-brk', 'remote-debugging-port']
if (
    argv.includes('inspect') ||
    argv.includes('remote') ||
    typeof v8debug !== 'undefined' ||
    flagBlocklist.some((flag) => app.commandLine.hasSwitch(flag))
) {
    app.quit()
}

/**
 * Expose Garbage Collector flag for manual trigger after seed usage
 */
app.commandLine.appendSwitch('js-flags', '--expose-gc')

/**
 * Define wallet windows
 */
const windows = {
    main: null,
    about: null,
}

/**
 * Set environment mode
 */
const devMode = process.env.NODE_ENV === 'development'

let paths = {
    preload: '',
    html: '',
    aboutHtml: '',
    aboutPreload: '',
}

/**
 * Default web preferences (see https://www.electronjs.org/docs/tutorial/security)
 */
const defaultWebPreferences = {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    worldSafeExecuteJavaScript: true,
    disableBlinkFeatures: 'Auxclick',
    webviewTag: false,
    enableWebSQL: false,
    // TODO: Remove before stable
    devTools: true,
}

if (app.isPackaged) {
    paths.preload = path.join(app.getAppPath(), '/public/build/preload.js')
    paths.html = path.join(app.getAppPath(), '/public/index.html')
    paths.aboutPreload = path.join(app.getAppPath(), '/public/build/lib/aboutPreload.js')
    paths.aboutHtml = path.join(app.getAppPath(), '/public/about.html')
} else {
    // __dirname is desktop/public/build
    paths.preload = path.join(__dirname, 'preload.js')
    paths.html = path.join(__dirname, '../index.html')
    paths.aboutPreload = path.join(__dirname, 'lib/aboutPreload.js')
    paths.aboutHtml = path.join(__dirname, '../about.html')
}

/**
 * Check URL against allowlist
 */
function isUrlAllowed(targetUrl) {
    // TODO: Add links for T&C, privacy policy and help
    const externalAllowlist = [
        'privacy@iota.org',
        'iota.org',
        'github.com/iotaledger/firefly/issues',
        'discord.iota.org',
        'chrysalis.iota.org',
    ]

    const url = new URL(targetUrl)
    const domain = url.hostname.replace('www.', '').replace('mailto:', '')

    return externalAllowlist.indexOf(domain) > -1 || externalAllowlist.indexOf(domain + url.pathname) > -1
}

/**
 * Handles url navigation events
 */
const handleNavigation = (e, url) => {
    e.preventDefault()

    try {
        if (isUrlAllowed(url)) {
            shell.openExternal(url)
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * Create main window
 * @returns {BrowserWindow} Main window
 */
function createWindow() {
    /**
     * Register iota file protocol
     */
    try {
        protocol.registerFileProtocol('iota', (request, callback) => {
            callback(request.url.replace('iota:/', app.getAppPath()).split('?')[0].split('#')[0])
        })
    } catch (error) {
        console.log(error) //eslint-disable-line no-console
    }

    const mainWindowState = windowStateKeeper('main', 'settings.json');

    // Create the browser window
    windows.main = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 1280,
        minHeight: 720,
        titleBarStyle: 'hidden',
        frame: process.platform === 'linux',
        icon: process.platform === 'linux' ? path.join(__dirname, '../assets/icons/linux/icon256x256.png') : undefined,
        webPreferences: {
            ...defaultWebPreferences,
            preload: paths.preload,
        },
    })

    if (mainWindowState.isMaximized) {
        windows.main.maximize();
    }

    mainWindowState.track(windows.main);

    if (devMode) {
        // Enable dev tools only in developer mode
        windows.main.webContents.openDevTools()
    }

    if (devMode) {
        windows.main.loadURL('http://localhost:8080')
    } else {
        initAutoUpdate(windows.main)
        // load the index.html of the app.
        windows.main.loadFile(paths.html)
    }

    /**
     * Right click context menu for inputs
     */
    windows.main.webContents.on('context-menu', (_e, props) => {
        const { isEditable } = props
        if (isEditable) {
            contextMenu().popup(windows.main)
        }
    })

    /**
     * Only allow external navigation to allowed domains
     */
    windows.main.webContents.on('will-navigate', handleNavigation)
    windows.main.webContents.on('new-window', handleNavigation)

    windows.main.on('close', () => {
        closeAboutWindow()
    })

    windows.main.on('closed', () => {
        windows.main = null
    })

    /**
     * Handle permissions requests
     */
    session.defaultSession.setPermissionRequestHandler((_webContents, permission, cb, details) => {
        if (permission === 'openExternal' && details && details.externalURL && isUrlAllowed(details.externalURL)) {
            return cb(true)
        }

        const permissionAllowlist = ['clipboard-read', 'notifications', 'fullscreen']

        return cb(permissionAllowlist.indexOf(permission) > -1)
    })

    return windows.main
}

app.whenReady().then(createWindow)

/**
 * Gets BrowserWindow instance
 * @returns {BrowserWindow} Requested window
 */
export const getWindow = function (windowName) {
    return windows[windowName]
}

/**
 * Gets or creates the requested BrowserWindow instance
 * @param {string} windowName
 * @returns {BrowserWindow} Requested window
 */
export const getOrInitWindow = (windowName) => {
    if (!windows[windowName]) {
        if (windowName === 'main') {
            return createWindow()
        }
        if (windowName === 'about') {
            return openAboutWindow()
        }
    }
    return windows[windowName]
}

/**
 * Initialises the menu bar
 */
initMenu()

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

// IPC handlers for APIs exposed from main proces

// URLs
ipcMain.handle('open-url', (_e, url) => {
    return handleNavigation(_e, url)
})

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

// Dialogs
ipcMain.handle('show-open-dialog', (_e, options) => {
    return dialog.showOpenDialog(options)
})
ipcMain.handle('show-save-dialog', (_e, options) => {
    return dialog.showSaveDialog(options)
})

// Miscellaneous
ipcMain.handle('get-path', (_e, path) => {
    const allowedPaths = ['userData']
    if (allowedPaths.indexOf(path) === -1) {
        throw Error(`Path ${path} is not allowed`)
    }
    return app.getPath(path)
})

// Diagnostics
ipcMain.handle('diagnostics', (_e) => {
    const diagnostics = [
        { label: 'popups.diagnostics.platform', value: os.platform() },
        { label: 'popups.diagnostics.platformVersion', value: os.release() },
        { label: 'popups.diagnostics.platformArchitecture', value: os.arch() },
        { label: 'popups.diagnostics.cpuCount', value: os.cpus().length },
        { label: 'popups.diagnostics.totalMem', value: `${(os.totalmem() / 1048576).toFixed(1)} MB` },
        { label: 'popups.diagnostics.freeMem', value: `${(os.freemem() / 1048576).toFixed(1)} MB` },
        { label: 'popups.diagnostics.userPath', value: app.getPath('userData') },
    ]
    return diagnostics
})

// Os
ipcMain.handle('get-os', (_e) => {
    return process.platform
})

/**
 * Define deep link state
 */
let deepLinkUrl = null

/**
 * Create a single instance only
 */
const isFirstInstance = app.requestSingleInstanceLock()

if (!isFirstInstance) {
    app.quit()
}

app.on('second-instance', (_e, args) => {
    if (windows.main) {
        if (args.length > 1) {
            const params = args.find((arg) => arg.startsWith('iota://'))

            if (params) {
                windows.main.webContents.send('deep-link-params', params)
            }
        }
        if (windows.main.isMinimized()) {
            windows.main.restore()
        }
        windows.main.focus()
    }
})

// TODO: re-enable deep links
/**
 * Register iota:// protocol for deep links
 * Set Firefly as the default handler for iota:// protocol
 */
// protocol.registerSchemesAsPrivileged([{ scheme: 'iota', privileges: { secure: true, standard: true } }])
// if (process.defaultApp) {
//     if (process.argv.length >= 2) {
//         app.setAsDefaultProtocolClient('iota', process.execPath, [path.resolve(process.argv[1])])
//     }
// } else {
//     app.setAsDefaultProtocolClient('iota')
// }

// /**
//  * Proxy deep link event to the wallet application
//  */
// app.on('open-url', (event, url) => {
//     event.preventDefault()
//     deepLinkUrl = url
//     if (windows.main) {
//         windows.main.webContents.send('deep-link-params', url)
//     }
// })

// /**
//  * Proxy deep link event to the wallet application
//  */
// ipcMain.on('deep-link-request', () => {
//     if (deepLinkUrl) {
//         windows.main.webContents.send('deep-link-params', deepLinkUrl)
//         deepLinkUrl = null
//     }
// })

/**
 * Proxy notification activated to the wallet application
 */
ipcMain.on('notification-activated', (ev, contextData) => {
    windows.main.focus()
    windows.main.webContents.send('notification-activated', contextData)
})

/**
 * Create about window
 * @returns {BrowserWindow} About window
 */
export const openAboutWindow = () => {
    if (windows.about !== null) {
        windows.about.focus()
        return windows.about
    }

    windows.about = new BrowserWindow({
        width: 380,
        height: 230,
        useContentSize: true,
        titleBarStyle: 'hidden',
        show: false,
        fullscreenable: false,
        resizable: false,
        minimizable: false,
        webPreferences: {
            ...defaultWebPreferences,
            preload: paths.aboutPreload,
        },
    })

    windows.about.once('closed', () => {
        windows.about = null
    })

    windows.about.loadFile(paths.aboutHtml)

    windows.about.once('ready-to-show', () => {
        windows.about.show()
    })

    windows.about.setMenu(null)

    return windows.about
}

export const closeAboutWindow = () => {
    if (windows.about) {
        windows.about.close()
        windows.about = null
    }
}

function windowStateKeeper(windowName, settingsFilename) {
    let window, windowState;

    function setBounds() {
        const settings = loadJsonConfig(settingsFilename)

        if (settings && settings.windowState && settings.windowState[windowName]) {
            windowState = settings.windowState[windowName]
            return
        }

        // Default
        windowState = {
            x: undefined,
            y: undefined,
            width: 1280,
            height: 720,
        };
    }

    function saveState() {
        windowState.isMaximized = window.isMaximized();
        if (!windowState.isMaximized) {
            windowState = window.getBounds();
        }

        let settings = loadJsonConfig(settingsFilename)

        settings = settings || {}
        settings.windowState = settings.windowState || {}
        settings.windowState[windowName] = windowState

        saveJsonConfig(settingsFilename, settings)
    }

    function track(win) {
        window = win;
        ['resize', 'move', 'close'].forEach(event => {
            win.on(event, saveState);
        });
    }

    setBounds();

    return {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        isMaximized: windowState.isMaximized,
        track
    };
}

function saveJsonConfig(filename, data) {
    try {
        const userDataPath = app.getPath('userData')
        const configFilename = path.join(userDataPath, filename)
        fs.writeFileSync(configFilename, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

function loadJsonConfig(filename) {
    try {
        const userDataPath = app.getPath('userData')
        const configFilename = path.join(userDataPath, filename)
        return JSON.parse(fs.readFileSync(configFilename).toString())
    } catch (err) {
        if (!err.message.includes('ENOENT')) {
            console.error(err)
        }
    }
}