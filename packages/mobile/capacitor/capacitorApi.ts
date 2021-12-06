import { Capacitor } from "@capacitor/core";
import { DeepLinkManager } from '../../mobile/capacitor/lib/deepLinkManager'
import { NotificationManager } from '../../mobile/capacitor/lib/notificationManager'
import { PincodeManager } from '../../mobile/capacitor/lib/pincodeManager'
import type { IPlatform } from 'shared/lib/typings/platform'
import type { VersionDetails } from 'shared/lib/typings/appUpdater'
import { hookErrorLogger } from '../../shared/lib/shell/errorLogger'

let activeProfileId = null

export const CapacitorApi: IPlatform = {
    getActiveProfile() {
        return activeProfileId
    },

    updateActiveProfile(id) {
        activeProfileId = id
    },

    removeProfileFolder(profilePath) {
        return new Promise<void>((resolve, reject) => {})
    },

    listProfileFolders(profileStoragePath) {
        return new Promise<string[]>((resolve, reject) => {})
    },

    PincodeManager: PincodeManager,

    DeepLinkManager: DeepLinkManager,

    NotificationManager: NotificationManager,

    getStrongholdBackupDestination: (defaultPath) => {
        return new Promise<string>((resolve, reject) => {})
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
        return new Promise<boolean>((resolve, reject) => {})
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
        return new Promise<boolean>((resolve, reject) => {})
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
        return new Promise<string>((resolve, reject) => {})
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
        return new Promise<boolean>((resolve, reject) => {})
    },

    /**
     * Gets directory for app's configuration files
     *
     * @method getUserDataPath
     *
     * @returns {Promise}
     */
    getUserDataPath: () => {
        return new Promise<string>((resolve, reject) => {
            resolve('DATA')
        })
    },

    /**
     * Gets diagnostics information for the system
     *
     * @method getDiagnostics
     *
     * @returns {Promise}
     */
    getDiagnostics: () => {
        return new Promise<{ label: string; value: string }[]>((resolve, reject) => {})
    },

    /**
     * Gets os information for the system
     *
     * @method getOS
     *
     * @returns {Promise}
     */
    getOS: () => {
        return new Promise<string>(resolve => resolve(Capacitor.getPlatform()))
    },

    /**
     * Starts an update of the application
     *
     * @method updateDownload
     *
     * @returns void
     */
    updateDownload: () => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Cancels an update of the application
     *
     * @method updateCancel
     *
     * @returns void
     */
    updateCancel: () => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Install an update of the application
     *
     * @method updateInstall
     *
     * @returns void
     */
    updateInstall: () => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Check for an update of the application
     *
     * @method updateCheck
     *
     * @returns void
     */
    updateCheck: () => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Get version details
     *
     * @method getVersionDetails
     *
     * @returns void
     */
    getVersionDetails: () => {
        return new Promise<VersionDetails>((resolve, reject) => {})
    },

    /**
     * Change menu state to determine what menu items to display
     * @param {string} Attribute - Target attribute
     * @param {any} Value - Target attribute value
     * @returns {undefined}
     */
    updateMenu: (attribute, value) => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Show the popup menu
     * @returns {undefined}
     */
    popupMenu: () => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Minimize the app
     * @returns {undefined}
     */
    minimize: () => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Maximize the app
     * @returns {undefined}
     */
    maximize: () => {
        return new Promise<boolean>((resolve, reject) => {})
    },

    /**
     * Is the app maximized
     * @returns {boolean}
     */
    isMaximized: () => {
        return new Promise<boolean>((resolve, reject) => {})
    },

    /**
     * Close the app
     * @returns {undefined}
     */
    close: () => {
        return new Promise<void>((resolve, reject) => {})
    },

    /*
     * Opens url and checks against acceptlist
     * @param {string} url - Target url
     * @returns {undefined}
     */
    openUrl: (url) => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Log unhandled exception
     * @param {string} errorType The type of eerror
     * @param {Errir} error The error
     */
    unhandledException: (errorType, error) => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Add native window wallet event listener
     * @param {string} event - Target event name
     * @param {function} callback - Event trigger callback
     * @returns {undefined}
     */
    onEvent: (event, callback) => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Remove native window wallet event listener
     * @param {string} event - Target event name
     * @param {function} callback - Event trigger callback
     * @returns {undefined}
     */
    removeListenersForEvent: (event) => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Save the recovery kit
     * @returns
     */
    saveRecoveryKit: (recoverKitData) => {
        return new Promise<void>((resolve, reject) => {})
    },

    /**
     * Hook the logger
     * @returns
     */
    hookErrorLogger,
    ledger: undefined,
}
