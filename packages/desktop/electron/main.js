import features from 'shared/features/features'
import { initAutoUpdate } from './lib/appUpdater'
import { shouldReportError } from './lib/errorHandling'
const { app, dialog, ipcMain, protocol, shell, BrowserWindow, session } = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')
const { execSync } = require('child_process')
const { machineIdSync } = require('node-machine-id')
const Keychain = require('./lib/keychain')
const { initMenu, contextMenu } = require('./lib/menu')

const canSendCrashReports = () => {
    let sendCrashReports = loadJsonConfig('settings.json')?.sendCrashReports
    if (typeof sendCrashReports === 'undefined') {
        sendCrashReports = false
        updateSettings({ sendCrashReports })
    }

    return sendCrashReports
}

const CAN_LOAD_SENTRY = app.isPackaged
const SEND_CRASH_REPORTS = CAN_LOAD_SENTRY && canSendCrashReports()

let captureException = (..._) => {}
if (SEND_CRASH_REPORTS) {
    captureException = require('../sentry')(true).captureException
}

/**
 * Set AppUserModelID for Windows notifications functionality
 */
// APP_ID is replaced by Webpack
// eslint-disable-next-line no-undef
app.setAppUserModelId(APP_ID)

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

let machineId = null
function getMachineId() {
    // Will only be null the first time
    // If this fails, it will probably fail again, so set it to an empty string
    if (machineId === null) {
        try {
            machineId = machineIdSync()
        } catch (error) {
            machineId = ''
            console.error(error)
        }
    }
    return machineId
}

let lastError = {}

/**
 * Setup the error handlers early so they catch any issues
 */
const handleError = (errorType, error, isRenderProcessError) => {
    if (app.isPackaged) {
        const errorMessage = error.message || error.reason || error
        if (!shouldReportError(errorMessage)) {
            console.error(error)
            return
        }

        lastError = {
            diagnostics: getDiagnostics(),
            error,
            errorType,
        }

        /**
         * NOTE: We do NOT need to capture the exception unless it is from
         * the main process.
         */
        if (SEND_CRASH_REPORTS) {
            const sentryError = new Error(`${errorType} - ${errorMessage}`)
            if (error.stack) {
                sentryError.stack = error.stack
            }
            captureException(sentryError)
        }

        openErrorWindow()
    } else {
        const errorMessage = error.message || error.reason || error
        if (!shouldReportError(errorMessage) || !isRenderProcessError) {
            console.error(error)
            return
        }
    }
}

process.on('uncaughtException', (error) => {
    handleError('[Main Context] Unhandled Error', error)
})

process.on('unhandledRejection', (error) => {
    handleError('[Main Context] Unhandled Rejection', error)
})

/**
 * Define wallet windows
 */
const windows = {
    main: null,
    about: null,
    error: null,
}

const paths = {
    preload: '',
    html: '',
    aboutHtml: '',
    aboutPreload: '',
    errorHtml: '',
    errorPreload: '',
}

let versionDetails = {
    upToDate: true,
    currentVersion: app.getVersion(),
    newVersion: '',
    newVersionReleaseDate: new Date(),
    changelog: '',
}

/**
 * Default web preferences (see https://www.electronjs.org/docs/tutorial/security)
 */
const defaultWebPreferences = {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    disableBlinkFeatures: 'Auxclick',
    webviewTag: false,
    enableWebSQL: false,
    devTools: !app.isPackaged || features?.electron?.developerTools?.enabled,
    additionalArguments: [`--send-crash-reports=${SEND_CRASH_REPORTS}`],
}

if (app.isPackaged) {
    paths.preload = path.join(app.getAppPath(), '/public/build/preload.js')
    paths.html = path.join(app.getAppPath(), '/public/index.html')
    paths.aboutPreload = path.join(app.getAppPath(), '/public/build/lib/aboutPreload.js')
    paths.aboutHtml = path.join(app.getAppPath(), '/public/about.html')
    paths.errorPreload = path.join(app.getAppPath(), '/public/build/lib/errorPreload.js')
    paths.errorHtml = path.join(app.getAppPath(), '/public/error.html')
} else {
    // __dirname is desktop/public/build
    paths.preload = path.join(__dirname, 'preload.js')
    paths.html = path.join(__dirname, '../index.html')
    paths.aboutPreload = path.join(__dirname, 'lib/aboutPreload.js')
    paths.aboutHtml = path.join(__dirname, '../about.html')
    paths.errorPreload = path.join(__dirname, 'lib/errorPreload.js')
    paths.errorHtml = path.join(__dirname, '../error.html')
}

/**
 * Check URL against allowlist
 */
function isUrlAllowed(targetUrl) {
    const externalAllowlist = [
        // IOTA Foundation
        'blog.iota.org',
        'chrysalis.iota.org',
        'chrysalis.docs.iota.org',
        'discord.iota.org',
        'firefly.iota.org',
        'iota.org',
        'privacy@iota.org',
        'wiki.iota.org',
        'explorer.iota.org',

        // Assembly / Shimmer
        'assembly.sc',
        'shimmer.network',
        'explorer.shimmer.network',

        // GitHub
        'github.com/iotaledger/firefly/issues',
        'github.com/iotaledger/firefly/issues/new/choose',

        // Other
        'support.ledger.com',
    ]
    const url = new URL(targetUrl)
    const domain = url.hostname.replace('www.', '').replace('mailto:', '')

    return externalAllowlist.includes(domain) || externalAllowlist.includes(domain + url.pathname)
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
        console.error(error)
    }
}

/**
 * Create main window
 * @returns {BrowserWindow} Main window
 */
function createWindow() {
    /**
     * Register firefly file protocol
     */
    try {
        protocol.registerFileProtocol(process.env.APP_PROTOCOL, (request, callback) => {
            callback(request.url.replace(`${process.env.APP_PROTOCOL}:/`, app.getAppPath()).split('?')[0].split('#')[0])
        })
    } catch (error) {
        console.error(error)
    }

    const mainWindowState = windowStateKeeper('main', 'settings.json')

    // Create the browser window
    windows.main = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        minWidth: 1280,
        minHeight: 720,
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
        title: app.name,
        frame: process.platform === 'linux',
        icon:
            process.platform === 'linux'
                ? path.join(__dirname, `../assets/icons/${process.env.STAGE}/icon1024x1024.png`)
                : undefined,
        webPreferences: {
            ...defaultWebPreferences,
            preload: paths.preload,
        },
    })

    if (mainWindowState.isMaximized) {
        windows.main.maximize()
    }

    mainWindowState.track(windows.main)

    if (!app.isPackaged) {
        // Enable dev tools only in developer mode
        windows.main.webContents.openDevTools()

        windows.main.loadURL('http://localhost:8080')
    } else {
        if (process.env.STAGE === 'prod') {
            initAutoUpdate()
        }
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
        closeErrorWindow()
    })

    windows.main.on('closed', () => {
        windows.main = null
    })

    windows.main.webContents.on('did-finish-load', () => {
        windows.main.webContents.send('version-details', versionDetails)
    })

    /**
     * CVE-2022-21718 mitigation
     * Remove when updating to Electron 13.6.6 or later
     * https://github.com/advisories/GHSA-3p22-ghq8-v749
     */
    windows.main.webContents.on('select-bluetooth-device', (event, _devices, cb) => {
        event.preventDefault()
        // Cancel the request
        cb('')
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
        if (windowName === 'error') {
            return openErrorWindow()
        }
    }
    return windows[windowName]
}

/**
 * Initialises the menu bar
 */
initMenu()

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.once('ready', () => {
    ipcMain.handle('error-data', () => lastError)
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        //
        // This listener must be created once the app is ready,
        // otherwise we run into https://github.com/iotaledger/firefly/issues/1006
        // because the `activate` event is also emitted when the app is launched for the first time
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// IPC handlers for APIs exposed from main proces

// URLs
ipcMain.handle('open-url', (_e, url) => handleNavigation(_e, url))

// Keychain
ipcMain.handle('keychain-getAll', (_e) => Keychain.getAll())
ipcMain.handle('keychain-get', (_e, key) => Keychain.get(key))
ipcMain.handle('keychain-set', (_e, key, content) => Keychain.set(key, content))
ipcMain.handle('keychain-remove', (_e, key) => Keychain.remove(key))

// Dialogs
ipcMain.handle('show-open-dialog', (_e, options) => dialog.showOpenDialog(options))
ipcMain.handle('show-save-dialog', (_e, options) => dialog.showSaveDialog(options))

// Miscellaneous
ipcMain.handle('get-path', (_e, path) => {
    const allowedPaths = ['userData']
    if (allowedPaths.indexOf(path) === -1) {
        throw Error(`Path ${path} is not allowed`)
    }
    return app.getPath(path)
})
ipcMain.handle('get-version-details', (_e) => versionDetails)

ipcMain.handle('copy-file', (_e, sourceFilePath, destinationFilePath) => {
    const src = path.resolve(sourceFilePath)
    const srcFileBuffer = fs.readFileSync(src)
    const dest = path.resolve(destinationFilePath)
    fs.writeFileSync(dest, srcFileBuffer)
})

// Diagnostics
const getDiagnostics = () => {
    const osXNameMap = new Map([
        // Source: https://en.wikipedia.org/wiki/Darwin_(operating_system)#Release_history
        [21, ['Monterey', '12']],
        [20, ['Big Sur', '11']],
        [19, ['Catalina', '10.15']],
        [18, ['Mojave', '10.14']],
        [17, ['High Sierra', '10.13']],
        [16, ['Sierra', '10.12']],
        [15, ['El Capitan', '10.11']],
        [14, ['Yosemite', '10.10']],
        [13, ['Mavericks', '10.9']],
        [12, ['Mountain Lion', '10.8']],
        [11, ['Lion', '10.7']],
        [10, ['Snow Leopard', '10.6']],
        [9, ['Leopard', '10.5']],
        [8, ['Tiger', '10.4']],
        [7, ['Panther', '10.3']],
        [6, ['Jaguar', '10.2']],
        [5, ['Puma', '10.1']],
    ])

    let platform = os.platform()
    let platformVersion = os.release()

    if (platform === 'darwin') {
        platform = 'macOS'

        try {
            platformVersion = execSync('sw_vers -productVersion').toString().trim()
        } catch (_err) {
            // Fall back to Darwin version map
            const verSplit = platformVersion.split('.')
            const num = Number.parseInt(verSplit[0], 10)
            if (!Number.isNaN(num)) {
                const [_, version] = osXNameMap.get(num)
                if (version) {
                    platformVersion = version
                }
            }
        }
    }

    return [
        { label: 'popups.diagnostics.platform', value: platform },
        { label: 'popups.diagnostics.platformVersion', value: platformVersion },
        { label: 'popups.diagnostics.platformArchitecture', value: os.arch() },
        { label: 'popups.diagnostics.cpuCount', value: os.cpus().length },
        { label: 'popups.diagnostics.totalMem', value: `${(os.totalmem() / 1048576).toFixed(1)} MB` },
        { label: 'popups.diagnostics.freeMem', value: `${(os.freemem() / 1048576).toFixed(1)} MB` },
    ]
}

ipcMain.handle('diagnostics', (_e) => getDiagnostics())

ipcMain.handle('handle-error', (_e, errorType, error) => {
    handleError(errorType, error, true)
})

// System
ipcMain.handle('get-os', (_e) => process.platform)
ipcMain.handle('get-machine-id', (_e) => getMachineId())

// Settings
ipcMain.handle('update-app-settings', (_e, settings) => updateSettings(settings))

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
            const params = args.find((arg) => arg.startsWith(`${process.env.APP_PROTOCOL}://`))

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

/**
 * Register firefly:// protocol for deep links
 * Set Firefly as the default handler for firefly:// protocol
 */
protocol.registerSchemesAsPrivileged([
    { scheme: process.env.APP_PROTOCOL, privileges: { secure: true, standard: true } },
])
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(process.env.APP_PROTOCOL, process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient(process.env.APP_PROTOCOL)
}

/**
 * Proxy deep link event to the wallet application
 */
app.on('open-url', (event, url) => {
    event.preventDefault()
    deepLinkUrl = url
    if (windows.main) {
        windows.main.webContents.send('deep-link-params', deepLinkUrl)
        windows.main.webContents.send('deep-link-request')
    }
})

/**
 * Check if a deep link request/event currently exists and has not been cleared
 */
ipcMain.on('check-deep-link-request-exists', () => {
    if (deepLinkUrl) {
        windows.main.webContents.send('deep-link-params', deepLinkUrl)
    }
})

/**
 * Clear deep link request/event
 */
ipcMain.on('clear-deep-link-request', () => {
    deepLinkUrl = null
})

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
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
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

/**
 * Create error window
 * @returns {BrowserWindow} Error window
 */
export const openErrorWindow = () => {
    if (windows.error !== null) {
        windows.error.focus()
        return windows.error
    }

    windows.error = new BrowserWindow({
        useContentSize: true,
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
        show: false,
        fullscreenable: false,
        resizable: true,
        minimizable: false,
        webPreferences: {
            ...defaultWebPreferences,
            preload: paths.errorPreload,
        },
    })

    windows.error.once('closed', () => {
        windows.error = null
    })

    windows.error.loadFile(paths.errorHtml)

    windows.error.once('ready-to-show', () => {
        windows.error.show()
    })

    windows.error.setMenu(null)

    return windows.error
}

export const closeErrorWindow = () => {
    if (windows.error) {
        windows.error.close()
        windows.error = null
    }
}

function windowStateKeeper(windowName, settingsFilename) {
    let window, windowState

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
        }
    }

    function saveState() {
        windowState.isMaximized = window.isMaximized()
        if (!windowState.isMaximized) {
            windowState = window.getBounds()
        }

        let settings = loadJsonConfig(settingsFilename)

        settings = settings || {}
        settings.windowState = settings.windowState || {}
        settings.windowState[windowName] = windowState

        saveJsonConfig(settingsFilename, settings)
    }

    function track(win) {
        window = win
        ;['resize', 'move', 'close'].forEach((event) => {
            win.on(event, saveState)
        })
    }

    setBounds()

    return {
        x: windowState.x,
        y: windowState.y,
        width: windowState.width,
        height: windowState.height,
        isMaximized: windowState.isMaximized,
        track,
    }
}

function updateSettings(data) {
    const filename = 'settings.json'
    const config = loadJsonConfig(filename)

    /**
     * CAUTION: We must be careful saving properties to this file, as
     * once we decide to save it there then it will be there forever
     * even if the name changes later.
     */
    saveJsonConfig(filename, { ...config, ...data })
}

function saveJsonConfig(filename, data) {
    try {
        fs.writeFileSync(getJsonConfig(filename), JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

function loadJsonConfig(filename) {
    try {
        return JSON.parse(fs.readFileSync(getJsonConfig(filename)).toString())
    } catch (err) {
        if (!err.message.includes('ENOENT')) {
            console.error(err)
        }
    }
}

function getJsonConfig(filename) {
    const userDataPath = app.getPath('userData')
    return path.join(userDataPath, filename)
}

export const updateAppVersionDetails = (details) => {
    versionDetails = Object.assign({}, versionDetails, details)
    if (process.env.STAGE !== 'prod') {
        // Always true to avoid triggering auto-updater
        versionDetails.upToDate = true
    }

    getOrInitWindow('main').webContents.send('version-details', versionDetails)
}
