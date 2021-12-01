const { ipcRenderer, contextBridge } = require('electron')

// Hook the error handlers as early as possible
window.addEventListener('error', (event) => {
    if (event.error && event.error.message) {
        ipcRenderer.invoke('handle-error', 'Preload Context Error', {
            message: event.error.message,
            stack: event.error.stack,
        })
    } else {
        ipcRenderer.invoke('handle-error', 'Preload Context Error', event.error || event)
    }
    event.preventDefault()
    console.error(event.error || event)
})

window.addEventListener('unhandledrejection', (event) => {
    ipcRenderer.invoke('handle-error', 'Preload Render Context Unhandled Rejection', event.reason)
    event.preventDefault()
    console.error(event.reason)
})

try {
    const fs = require('fs')
    const binding = require('wallet-nodejs-binding')
    const PincodeManager = require('./lib/pincodeManager')
    const DeepLinkManager = require('./lib/deepLinkManager')
    const NotificationManager = require('./lib/notificationManager')
    const { menuState } = require('./lib/menuState')
    const kdbx = require('./lib/kdbx')
    const { proxyApi } = require('shared/lib/shell/walletApi')
    const { hookErrorLogger } = require('shared/lib/shell/errorLogger')

    let activeProfileId = null

    const Wallet = binding
    Wallet.api = proxyApi(() => activeProfileId)

    const eventListeners = {}

    const Electron = {
        updateActiveProfile(id) {
            activeProfileId = id
        },
        removeProfileFolder(profilePath) {
            ipcRenderer.invoke('get-path', 'userData').then((userDataPath) => {
                // Check that the removing profile path matches the user data path
                // so that we don't try and remove things outside our scope
                if (profilePath.startsWith(userDataPath)) {
                    try {
                        // Sometime the DB can still be locked while it is flushing
                        // so retry if we receive a busy exception
                        fs.rmdirSync(profilePath, { recursive: true, maxRetries: 30, retryDelay: 500 })
                    } catch (err) {
                        console.error(err)
                    }
                }
            })
        },
        listProfileFolders(profileStoragePath, profiles) {
            return ipcRenderer.invoke('get-path', 'userData').then((userDataPath) => {
                // Check that the profile path matches the user data path
                // so that we don't try and remove things outside our scope
                if (profileStoragePath.startsWith(userDataPath)) {
                    try {
                        // Get a list of all the profile folders in storage
                        return fs.readdirSync(profileStoragePath)
                    } catch (err) {
                        if (err.code === 'ENOENT') {
                            // The __storage__ directory doesn't exist
                            return []
                        }
                        console.error(err)
                    }
                }
            })
        },
        PincodeManager: PincodeManager,
        DeepLinkManager: DeepLinkManager,
        NotificationManager: NotificationManager,
        getStrongholdBackupDestination: (defaultPath) =>
            ipcRenderer
                .invoke('show-save-dialog', {
                    properties: ['createDirectory', 'showOverwriteConfirmation'],
                    defaultPath,
                    filters: [{ name: 'Stronghold Files', extensions: ['stronghold'] }],
                })
                .then((result) => {
                    if (result.canceled) {
                        return null
                    }

                    return result.filePath
                }),

        /**
         * Exports migration log
         *
         * @method exportMigrationLog
         *
         * @param {string} sourcePath
         * @param {string} defaultFileName
         *
         * @returns {Promise<boolean>}
         */
        exportMigrationLog: (sourcePath, defaultFileName) =>
            ipcRenderer
                .invoke('show-save-dialog', {
                    properties: ['createDirectory', 'showOverwriteConfirmation'],
                    defaultPath: defaultFileName,
                    filters: [{ name: 'Log Files', extensions: ['log'] }],
                })
                .then((result) => {
                    if (result.canceled) {
                        return null
                    }

                    return new Promise((resolve, reject) => {
                        fs.copyFile(sourcePath, result.filePath, (err) => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve(true)
                            }
                        })
                    })
                }),

        /**
         * Exports ledger migration log
         *
         * @method exportLedgerMigrationLog
         *
         * @param {string} content
         * @param {string} defaultFileName
         *
         * @returns {Promise}
         */
        exportLedgerMigrationLog: (content, defaultFileName) =>
            ipcRenderer
                .invoke('show-save-dialog', {
                    properties: ['createDirectory', 'showOverwriteConfirmation'],
                    defaultPath: defaultFileName,
                    filters: [{ name: 'Log Files', extensions: ['log'] }],
                })
                .then((result) => {
                    if (result.canceled) {
                        return null
                    }

                    return new Promise((resolve, reject) => {
                        try {
                            let payload = ''

                            content.forEach((object) => {
                                Object.keys(object).forEach((key) => {
                                    payload = `${payload}${[key]}: ${object[key] || 'undefined'} \r\n`
                                })

                                payload = `${payload} \r\n`
                            })

                            fs.writeFileSync(result.filePath, payload)
                            resolve(true)
                        } catch (err) {
                            reject(err)
                        }
                    })
                }),

        /**
         * Imports legacy IOTA seed
         *
         * @method importLegacySeed
         *
         * @param {Buffer} buffer
         * @param {string} password
         *
         * @returns {Promise<string>}
         */
        importLegacySeed: (buffer, password) => kdbx.importVault(buffer, password),

        /**
         * Validates Seed Vault
         *
         * @method validateSeedVault
         *
         * @param {Buffer} buffer
         *
         * @returns {boolean}
         */
        validateSeedVault: (buffer) => kdbx.checkFormat(buffer),

        /**
         * Gets directory for app's configuration files
         *
         * @method getUserDataPath
         *
         * @returns {Promise}
         */
        getUserDataPath: () => ipcRenderer.invoke('get-path', 'userData'),
        /**
         * Gets diagnostics information for the system
         *
         * @method getDiagnostics
         *
         * @returns {Promise}
         */
        getDiagnostics: () => ipcRenderer.invoke('diagnostics'),
        /**
         * Gets os information for the system
         *
         * @method getOS
         *
         * @returns {Promise}
         */
        getOS: () => ipcRenderer.invoke('get-os'),
        /**
         * Starts an update of the application
         *
         * @method updateDownload
         *
         * @returns void
         */
        updateDownload: () => ipcRenderer.invoke('update-download'),
        /**
         * Cancels an update of the application
         *
         * @method updateCancel
         *
         * @returns void
         */
        updateCancel: () => ipcRenderer.invoke('update-cancel'),
        /**
         * Install an update of the application
         *
         * @method updateInstall
         *
         * @returns void
         */
        updateInstall: () => ipcRenderer.invoke('update-install'),
        /**
         * Check for an update of the application
         *
         * @method updateCheck
         *
         * @returns void
         */
        updateCheck: () => ipcRenderer.invoke('update-check'),
        /**
         * Get version details
         *
         * @method getVersionDetails
         *
         * @returns void
         */
        getVersionDetails: () => ipcRenderer.invoke('update-get-version-details'),
        /**
         * Change menu state to determine what menu items to display
         * @param {string} Attribute - Target attribute
         * @param {any} Value - Target attribute value
         * @returns {undefined}
         */
        updateMenu: (attribute, value) => {
            if (Object.keys(menuState).includes(attribute)) {
                ipcRenderer.invoke('menu-update', {
                    [attribute]: value,
                })
            }
        },
        /**
         * Show the popup menu
         * @returns {undefined}
         */
        popupMenu: () => {
            ipcRenderer.invoke('menu-popup')
        },
        /**
         * Minimize the app
         * @returns {undefined}
         */
        minimize: () => ipcRenderer.invoke('minimize'),
        /**
         * Maximize the app
         * @returns {undefined}
         */
        maximize: () => ipcRenderer.invoke('maximize'),
        /**
         * Is the app maximized
         * @returns {boolean}
         */
        isMaximized: () => ipcRenderer.invoke('isMaximized'),
        /**
         * Close the app
         * @returns {undefined}
         */
        close: () => ipcRenderer.invoke('close'),
        /*
         * Opens url and checks against acceptlist
         * @param {string} url - Target url
         * @returns {undefined}
         */
        openUrl: (url) => {
            ipcRenderer.invoke('open-url', url)
        },
        /**
         * Log unhandled exception
         * @param {string} errorType The type of eerror
         * @param {Errir} error The error
         */
        unhandledException: (errorType, error) => {
            ipcRenderer.invoke('handle-error', errorType, error)
        },
        /**
         * Add native window wallet event listener
         * @param {string} event - Target event name
         * @param {function} callback - Event trigger callback
         * @returns {undefined}
         */
        onEvent: (event, callback) => {
            let listeners = eventListeners[event]
            if (!listeners) {
                listeners = eventListeners[event] = []
            }
            listeners.push(callback)
            ipcRenderer.removeAllListeners(event)
            ipcRenderer.on(event, (e, args) => {
                listeners.forEach((call) => {
                    call(args)
                })
            })
        },
        /**
         * Remove native window wallet event listener
         * @param {string} event - Target event name
         * @param {function} callback - Event trigger callback
         * @returns {undefined}
         */
        removeListenersForEvent: (event) => {
            eventListeners[event] = []
            ipcRenderer.removeAllListeners(event)
        },
        /**
         * Save the recovery kit
         * @returns
         */
        saveRecoveryKit: (recoverKitData) =>
            ipcRenderer
                .invoke('show-save-dialog', {
                    properties: ['createDirectory', 'showOverwriteConfirmation'],
                    defaultPath: 'firefly-recovery-kit.pdf',
                    filters: [
                        { name: 'Pdf Document', extensions: ['pdf'] },
                        { name: 'All Files', extensions: ['*'] },
                    ],
                })
                .then((result) => {
                    if (result.canceled) {
                        return
                    }

                    try {
                        fs.writeFileSync(result.filePath, Buffer.from(recoverKitData))
                    } catch (err) {
                        console.error(err)
                    }
                }),
        /**
         * Hook the logger
         * @returns
         */
        hookErrorLogger,
    }

    contextBridge.exposeInMainWorld('__WALLET_INIT__', {
        run: Wallet.init,
    })

    contextBridge.exposeInMainWorld('__WALLET_API__', Wallet.api)

    contextBridge.exposeInMainWorld('Electron', Electron)
} catch (error) {
    ipcRenderer.invoke('handle-error', 'Preload Error', error)
}
