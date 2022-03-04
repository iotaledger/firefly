import { Electron } from 'shared/lib/electron'
import { CapacitorApi } from '../../mobile/capacitor/capacitorApi'
import { IPlatform, Platforms } from './typings/platform'
import * as binding from '../../mobile/capacitor/walletPluginApi'
import { AppSettings } from './typings/app'

const PLATFORM = process.env.PLATFORM

if (PLATFORM == Platforms.MOBILE) {
    const Wallet = binding
    window['__WALLET__'] = Wallet
}

export const Platform: IPlatform = {
    updateAppSettings(settings: Partial<AppSettings>) {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.updateAppSettings(settings)
            case Platforms.MOBILE:
                return CapacitorApi.updateAppSettings(settings)
            default:
                return
        }
    },
    getActiveProfile() {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.getActiveProfile()
            case Platforms.MOBILE:
                return CapacitorApi.getActiveProfile()
            default:
                return
        }
    },

    updateActiveProfile(id) {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.updateActiveProfile(id)
            case Platforms.MOBILE:
                return CapacitorApi.updateActiveProfile(id)
            default:
                return
        }
    },

    renameProfileFolder(oldPath, newPath) {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.renameProfileFolder(oldPath, newPath)
            case Platforms.MOBILE:
                return CapacitorApi.renameProfileFolder(oldPath, newPath)
            default:
                return
        }
    },

    removeProfileFolder(profilePath) {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.removeProfileFolder(profilePath)
            case Platforms.MOBILE:
                return CapacitorApi.removeProfileFolder(profilePath)
            default:
                return
        }
    },

    listProfileFolders(profileStoragePath) {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.listProfileFolders(profileStoragePath)
            case Platforms.MOBILE:
                return CapacitorApi.listProfileFolders(profileStoragePath)
            default:
                return
        }
    },

    PincodeManager:
        PLATFORM == Platforms.DESKTOP
            ? Electron.PincodeManager
            : PLATFORM == Platforms.MOBILE
            ? CapacitorApi.PincodeManager
            : undefined,

    DeepLinkManager:
        PLATFORM == Platforms.DESKTOP
            ? Electron.DeepLinkManager
            : PLATFORM == Platforms.MOBILE
            ? CapacitorApi.DeepLinkManager
            : undefined,

    NotificationManager:
        PLATFORM == Platforms.DESKTOP
            ? Electron.NotificationManager
            : PLATFORM == Platforms.MOBILE
            ? CapacitorApi.NotificationManager
            : undefined,

    BarcodeManager:
        PLATFORM == Platforms.DESKTOP
            ? undefined
            : PLATFORM == Platforms.MOBILE
            ? CapacitorApi.BarcodeManager
            : undefined,

    getStrongholdBackupDestination: (defaultPath) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.getStrongholdBackupDestination(defaultPath)
            case Platforms.MOBILE:
                return CapacitorApi.getStrongholdBackupDestination(defaultPath)
            default:
                return
        }
    },

    exportTransactionHistory: async (defaultPath, contents) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.exportTransactionHistory(defaultPath, contents)
            case Platforms.MOBILE:
                // TODO: Export transaction history on capacitor
                return Promise.resolve(null)
            default:
                return
        }
    },

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
    exportMigrationLog: (sourcePath, defaultFileName) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.exportMigrationLog(sourcePath, defaultFileName)
            case Platforms.MOBILE:
                return CapacitorApi.exportMigrationLog(sourcePath, defaultFileName)
            default:
                return
        }
    },

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
    exportLedgerMigrationLog: (content, defaultFileName) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.exportLedgerMigrationLog(content, defaultFileName)
            case Platforms.MOBILE:
                return CapacitorApi.exportLedgerMigrationLog(content, defaultFileName)
            default:
                return
        }
    },

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
    importLegacySeed: (buffer, password) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.importLegacySeed(buffer, password)
            case Platforms.MOBILE:
                return CapacitorApi.importLegacySeed(buffer, password)
            default:
                return
        }
    },

    /**
     * Validates Seed Vault
     *
     * @method validateSeedVault
     *
     * @param {Buffer} buffer
     *
     * @returns {boolean}
     */
    validateSeedVault: (buffer) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.validateSeedVault(buffer)
            case Platforms.MOBILE:
                return CapacitorApi.validateSeedVault(buffer)
            default:
                return
        }
    },

    /**
     * Gets directory for app's configuration files
     *
     * @method getUserDataPath
     *
     * @returns {Promise}
     */
    getUserDataPath: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.getUserDataPath()
            case Platforms.MOBILE:
                return CapacitorApi.getUserDataPath()
            default:
                return
        }
    },

    /**
     * Gets diagnostics information for the system
     *
     * @method getDiagnostics
     *
     * @returns {Promise}
     */
    getDiagnostics: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.getDiagnostics()
            case Platforms.MOBILE:
                return CapacitorApi.getDiagnostics()
            default:
                return
        }
    },

    /**
     * Gets os information for the system
     *
     * @method getOS
     *
     * @returns {Promise}
     */
    getOS: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.getOS()
            case Platforms.MOBILE:
                return CapacitorApi.getOS()
            default:
                return
        }
    },

    /**
     * Gets machine ID
     *
     * @method getMachineId
     *
     * @returns {Promise}
     */
    getMachineId: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.getMachineId()
            case Platforms.MOBILE:
                return CapacitorApi.getMachineId()
            default:
                return
        }
    },

    /**
     * Starts an update of the application
     *
     * @method updateDownload
     *
     * @returns void
     */
    updateDownload: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.updateDownload()
            case Platforms.MOBILE:
                return CapacitorApi.updateDownload()
            default:
                return
        }
    },

    /**
     * Cancels an update of the application
     *
     * @method updateCancel
     *
     * @returns void
     */
    updateCancel: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.updateCancel()
            case Platforms.MOBILE:
                return CapacitorApi.updateCancel()
            default:
                return
        }
    },

    /**
     * Install an update of the application
     *
     * @method updateInstall
     *
     * @returns void
     */
    updateInstall: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.updateInstall()
            case Platforms.MOBILE:
                return CapacitorApi.updateInstall()
            default:
                return
        }
    },

    /**
     * Check for an update of the application
     *
     * @method updateCheck
     *
     * @returns void
     */
    updateCheck: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.updateCheck()
            case Platforms.MOBILE:
                return CapacitorApi.updateCheck()
            default:
                return
        }
    },

    /**
     * Get version details
     *
     * @method getVersionDetails
     *
     * @returns void
     */
    getVersionDetails: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.getVersionDetails()
            case Platforms.MOBILE:
                return CapacitorApi.getVersionDetails()
            default:
                return
        }
    },

    /**
     * Change menu state to determine what menu items to display
     * @param {string} Attribute - Target attribute
     * @param {any} Value - Target attribute value
     * @returns {undefined}
     */
    updateMenu: (attribute, value) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.updateMenu(attribute, value)
            case Platforms.MOBILE:
                return CapacitorApi.updateMenu(attribute, value)
            default:
                return
        }
    },

    /**
     * Show the popup menu
     * @returns {undefined}
     */
    popupMenu: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.popupMenu()
            case Platforms.MOBILE:
                return CapacitorApi.popupMenu()
            default:
                return
        }
    },

    /**
     * Minimize the app
     * @returns {undefined}
     */
    minimize: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.minimize()
            case Platforms.MOBILE:
                return CapacitorApi.minimize()
            default:
                return
        }
    },

    /**
     * Maximize the app
     * @returns {undefined}
     */
    maximize: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.maximize()
            case Platforms.MOBILE:
                return CapacitorApi.maximize()
            default:
                return
        }
    },

    /**
     * Is the app maximized
     * @returns {boolean}
     */
    isMaximized: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.isMaximized()
            case Platforms.MOBILE:
                return CapacitorApi.isMaximized()
            default:
                return
        }
    },

    /**
     * Close the app
     * @returns {undefined}
     */
    close: () => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.close()
            case Platforms.MOBILE:
                return CapacitorApi.close()
            default:
                return
        }
    },

    /*
     * Opens url and checks against acceptlist
     * @param {string} url - Target url
     * @returns {undefined}
     */
    openUrl: (url) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.openUrl(url)
            case Platforms.MOBILE:
                return CapacitorApi.openUrl(url)
            default:
                return
        }
    },

    /**
     * Log unhandled exception
     * @param {string} errorType The type of eerror
     * @param {Errir} error The error
     */
    unhandledException: (errorType, error) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.unhandledException(errorType, error)
            case Platforms.MOBILE:
                return CapacitorApi.unhandledException(errorType, error)
            default:
                return
        }
    },

    /**
     * Add native window wallet event listener
     * @param {string} event - Target event name
     * @param {function} callback - Event trigger callback
     * @returns {undefined}
     */
    onEvent: (event, callback) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.onEvent(event, callback)
            case Platforms.MOBILE:
                return CapacitorApi.onEvent(event, callback)
            default:
                return
        }
    },

    /**
     * Remove native window wallet event listener
     * @param {string} event - Target event name
     * @param {function} callback - Event trigger callback
     * @returns {undefined}
     */
    removeListenersForEvent: (event) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.removeListenersForEvent(event)
            case Platforms.MOBILE:
                return CapacitorApi.removeListenersForEvent(event)
            default:
                return
        }
    },

    /**
     * Save the recovery kit
     * @returns
     */
    saveRecoveryKit: (recoverKitData) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.saveRecoveryKit(recoverKitData)
            case Platforms.MOBILE:
                return CapacitorApi.saveRecoveryKit(recoverKitData)
            default:
                return
        }
    },

    /**
     * Hook the logger
     * @returns
     */
    hookErrorLogger: (logger) => {
        switch (PLATFORM) {
            case Platforms.DESKTOP:
                return Electron.hookErrorLogger(logger)
            case Platforms.MOBILE:
                return CapacitorApi.hookErrorLogger(logger)
            default:
                return
        }
    },
    ledger: PLATFORM == Platforms.DESKTOP ? Electron.ledger : PLATFORM == Platforms.MOBILE ? undefined : undefined,
}
