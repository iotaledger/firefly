const { app, dialog, ipcMain, protocol, shell, BrowserWindow, session } = require('electron')
const path = require('path')
const Keychain = require('./lib/keychain')
const { initAutoUpdate } = require('./lib/appUpdater')
import { initMenu, contextMenu } from './lib/menu'
const { version } = require('../package.json')

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
    about: null
}

/**
 * Set environment mode
 */
const devMode = process.env.NODE_ENV === 'development'

let paths = {
    preload: '',
    html: '',
    aboutHtml: ''
}

if (app.isPackaged) {
    paths.preload = path.join(app.getAppPath(), '/public/build/preload.js')
    paths.html = path.join(app.getAppPath(), '/public/index.html')
    paths.aboutHtml = path.join(app.getAppPath(), '/public/about.html')
} else {
    // __dirname is desktop/public/build
    paths.preload = path.join(__dirname, 'preload.js')
    paths.html = path.join(__dirname, '../index.html')
    paths.aboutHtml = path.join(__dirname, '../about.html')
}

/**
 * Check URL against allowlist
 */
function isUrlAllowed(url) {
    // TODO: Add links for T&C, privacy policy and help
    const externalAllowlist = ['privacy@iota.org', 'explorer.iota.org']

    return externalAllowlist.indexOf(new URL(url).hostname.replace('www.', '').replace('mailto:', '')) > -1
}

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

    // Create the browser window
    windows.main = new BrowserWindow({
        minWidth: 1280,
        minHeight: 720,
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            worldSafeExecuteJavaScript: true,
            disableBlinkFeatures: 'Auxclick',
            webviewTag: false,
            enableWebSQL: false,
            devTools: devMode,
            preload: paths.preload,
        },
    })

    if (devMode) {
        // Enable dev tools only in developer mode
        windows.main.webContents.openDevTools()
    }

    if (!devMode) {
        initAutoUpdate(windows.main)
    }

    if (devMode) {
        windows.main.loadURL('http://localhost:8080')
    } else {
        // load the index.html of the app.
        windows.main.loadFile(paths.html)
    }

    const _handleNavigation = (e, url) => {
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
    windows.main.webContents.on('will-navigate', _handleNavigation)
    windows.main.webContents.on('new-window', _handleNavigation)

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
}

app.whenReady().then(createWindow)

/**
 * Gets Window instance
 */
export const getWindow = function (windowName) {
    return windows[windowName]
}

/**
 * Initialises the menu bar
 */
initMenu(app, getWindow)

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

// Dialogs
ipcMain.handle('show-open-dialog', (_e, options) => {
    return dialog.showOpenDialog(options)
})

// Miscellaneous
ipcMain.handle('get-path', (_e, path) => {
    const allowedPaths = ['userData']
    if (allowedPaths.indexOf(path) === -1) {
        throw Error(`Path ${path} is not allowed`)
    }
    return app.getPath(path)
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
                windows.main.webContents.send('deepLink-params', params)
            }
        }
        if (windows.main.isMinimized()) {
            windows.main.restore()
        }
        windows.main.focus()
    }
})

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
    deepLinkUrl = url
    if (windows.main) {
        windows.main.webContents.send('deepLink-params', url)
    }
})

/**
 * Proxy deep link event to the wallet application
 */
ipcMain.on('deepLink-request', () => {
    if (deepLinkUrl) {
        windows.main.webContents.send('deepLink-params', deepLinkUrl)
        deepLinkUrl = null
    }
})

export const openAboutWindow = () => {

    if (windows.about !== null) {
        windows.about.focus()
        return windows.about
    }

    windows.about = new BrowserWindow({
        width: 300,
        height: 180,
        useContentSize: true,
        titleBarStyle: 'hidden-inset',
        show: false,
        fullscreenable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            worldSafeExecuteJavaScript: true,
            disableBlinkFeatures: 'Auxclick',
            webviewTag: false,
            enableWebSQL: false,
            devTools: devMode,
            preload: `${__dirname}/lib/aboutPreload.js`,
        },
    })

    windows.about.once('closed', () => {
        windows.about = null
    })

    windows.about.loadFile(paths.aboutHtml)

    const content = {
        appName: app.name,
        version: version,
        iconPath: './assets/logos/firefly_logo.svg'
    }

    windows.about.webContents.once('dom-ready', () => {
        windows.about.webContents.send('about-content', content)
    })

    windows.about.once('ready-to-show', () => {
        windows.about.show()
    })

    windows.about.setMenu(null)

    return windows.about
}
