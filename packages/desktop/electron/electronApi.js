const { ipcRenderer } = require('electron')

const fs = require('fs')
const PincodeManager = require('./lib/pincodeManager')
const DeepLinkManager = require('./lib/deepLinkManager')
const NotificationManager = require('./lib/notificationManager')
const { menuState } = require('./lib/menuState')
const features = require('../features/features').default

const eventListeners = {}

const ElectronApi = {
    updateAppSettings(settings) {
        return ipcRenderer.invoke('update-app-settings', settings)
    },
    async removeProfileFolder(profilePath) {
        return ipcRenderer.invoke('get-path', 'userData').then((userDataPath) => {
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
    async listProfileFolders(profileStoragePath) {
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
    async getStrongholdBackupDestination(defaultPath) {
        return ipcRenderer
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
            })
    },
    /**
     * Gets directory for app's configuration files
     *
     * @method getUserDataPath
     *
     * @returns {Promise}
     */
    getUserDataPath() {
        return ipcRenderer.invoke('get-path', 'userData')
    },
    /**
     * Gets diagnostics information for the system
     *
     * @method getDiagnostics
     *
     * @returns {Promise}
     */
    getDiagnostics() {
        return ipcRenderer.invoke('diagnostics')
    },
    /**
     * Gets os information for the system
     *
     * @method getOS
     *
     * @returns {Promise}
     */
    getOS() {
        return ipcRenderer.invoke('get-os')
    },
    /**
     * Gets machine ID
     *
     * @method getMachineId
     *
     * @returns {Promise}
     */
    getMachineId() {
        return ipcRenderer.invoke('get-machine-id')
    },
    /**
     * Starts an update of the application
     *
     * @method downloadAppUpdate
     *
     * @returns void
     */
    downloadAppUpdate() {
        return ipcRenderer.invoke('update-download')
    },
    /**
     * Cancels an update of the application
     *
     * @method cancelAppUpdateDownload
     *
     * @returns void
     */
    cancelAppUpdateDownload() {
        return ipcRenderer.invoke('update-cancel')
    },
    /**
     * Install an update of the application
     *
     * @method installAppUpdate
     *
     * @returns void
     */
    installAppUpdate() {
        return ipcRenderer.invoke('update-install')
    },
    /**
     * Check for an update of the application
     *
     * @method checkForAppUpdate
     *
     * @returns void
     */
    checkForAppUpdate() {
        return ipcRenderer.invoke('update-check')
    },
    /**
     * Get version details
     *
     * @method getAppVersionDetails
     *
     * @returns void
     */
    getAppVersionDetails() {
        return ipcRenderer.invoke('get-version-details')
    },
    /**
     * Change menu state to determine what menu items to display
     * @param {string} Attribute - Target attribute
     * @param {any} Value - Target attribute value
     * @returns {undefined}
     */
    updateMenu(attribute, value) {
        if (Object.keys(menuState).includes(attribute)) {
            return ipcRenderer.invoke('menu-update', {
                [attribute]: value,
            })
        }
    },
    /**
     * Show the popup menu
     * @returns {undefined}
     */
    popupMenu() {
        return ipcRenderer.invoke('menu-popup')
    },
    /**
     * Minimize the app
     * @returns {undefined}
     */
    minimize() {
        return ipcRenderer.invoke('minimize')
    },
    /**
     * Maximize the app
     * @returns {undefined}
     */
    maximize() {
        return ipcRenderer.invoke('maximize')
    },
    /**
     * Is the app maximized
     * @returns {boolean}
     */
    isMaximized() {
        return ipcRenderer.invoke('isMaximized')
    },
    /**
     * Close the app
     * @returns {undefined}
     */
    close() {
        return ipcRenderer.invoke('close')
    },
    downloadNft(url, destinationFilePath, nftId, accountIndex) {
        return ipcRenderer.invoke('nft-download', url, destinationFilePath, nftId, accountIndex)
    },
    cancelNftDownload(nftId) {
        return ipcRenderer.invoke('cancel-nft-download', nftId)
    },
    checkIfFileExists(filePath) {
        return ipcRenderer.invoke('check-if-file-exists', filePath)
    },
    /*
     * Opens url and checks against acceptlist
     * @param {string} url - Target url
     * @returns {undefined}
     */
    openUrl(url) {
        return ipcRenderer.invoke('open-url', url)
    },
    copyFile(sourceFilePath, destinationFilePath) {
        return ipcRenderer.invoke('copy-file', sourceFilePath, destinationFilePath)
    },
    deleteFile(filePath) {
        return ipcRenderer.invoke('delete-file', filePath)
    },
    /**
     * Log unhandled exception
     * @param {string} errorType The type of eerror
     * @param {Errir} error The error
     */
    unhandledException(errorType, error) {
        return ipcRenderer.invoke('handle-error', errorType, error)
    },
    /**
     * Add native window wallet event listener
     * @param {string} event - Target event name
     * @param {function} callback - Event trigger callback
     * @returns {undefined}
     */
    onEvent(event, callback) {
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
    removeListenersForEvent(event) {
        eventListeners[event] = []
        return ipcRenderer.removeAllListeners(event)
    },
    /**
     * Save the recovery kit
     * @returns
     */
    async saveRecoveryKit(recoverKitData) {
        return ipcRenderer
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
            })
    },
    trackEvent(eventName, eventProperties) {
        return ipcRenderer.invoke('track-event', eventName, eventProperties)
    },
    isFeatureFlagEnabled(keyPath) {
        return keyPath?.split('.').reduce((prev, cur) => prev && prev[cur], features)?.enabled ?? false
    },
    updateTheme(theme) {
        return ipcRenderer.invoke('update-theme', theme)
    },
}

module.exports = ElectronApi
