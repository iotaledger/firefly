const binding = require('wallet-nodejs-binding')
const PincodeManager = require('./lib/pincodeManager')
const DeepLinkManager = require('./lib/deepLinkManager')
const NotificationManager = require('./lib/notificationManager')
const { ipcRenderer, contextBridge } = require('electron')
const { menuState } = require('./lib/menuState')
const fs = require('fs');
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
    PincodeManager,
    DeepLinkManager,
    NotificationManager,
    getStrongholdBackupDestination: (defaultPath) => {
        return ipcRenderer.invoke('show-save-dialog', { 
            properties: ['createDirectory', 'showOverwriteConfirmation'], 
            defaultPath,
            filters: [
                { name: 'Stronghold Files', extensions: ['stronghold'] }
            ]
        }).then((result) => {
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
                [attribute]: value
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
    minimize: () => {
        ipcRenderer.invoke('minimize')
    },
    /**
     * Maximize the app
     * @returns {undefined}
     */
    maximize: () => {
        ipcRenderer.invoke('maximize')
    },
    /**
     * Close the app
     * @returns {undefined}
     */
    close: () => {
        ipcRenderer.invoke('close')
    },
    /*
     * Opens url and checks against acceptlist
     * @param {string} url - Target url
     * @returns {undefined}
     */
    openUrl: (url) => {
        ipcRenderer.invoke('open-url', url)
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
            ipcRenderer.on(event, (e, args) => {
                listeners.forEach((call) => {
                    call(args)
                })
            })
        }
        listeners.push(callback)
    },
    /**
     * Save the recovery kit
     * @returns 
     */
    saveRecoveryKit: (recoverKitData) => {
        return ipcRenderer.invoke('show-save-dialog', {
            properties: ['createDirectory', 'showOverwriteConfirmation'],
            defaultPath: "firefly-recovery-kit.pdf",
            filters: [
                { name: 'Pdf Document', extensions: ['pdf'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        }).then((result) => {
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
    /**
     * Hook the logger
     * @returns 
     */
    hookErrorLogger
}

contextBridge.exposeInMainWorld('__WALLET_INIT__', {
    run: Wallet.init,
})

contextBridge.exposeInMainWorld('__WALLET_API__', Wallet.api)

contextBridge.exposeInMainWorld('Electron', Electron)
