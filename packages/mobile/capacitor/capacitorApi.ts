import { Capacitor } from '@capacitor/core'

import { SplashScreen } from '@capacitor/splash-screen'
import { BarcodeManager } from './lib/barcodeManager'
import { DeepLinkManager } from './lib/deepLinkManager'
import { NotificationManager } from './lib/notificationManager'
import { PincodeManager } from './lib/pincodeManager'

import { hookErrorLogger } from '@lib/shell/errorLogger'
import { AppSettings } from '@lib/typings/app'
import { VersionDetails } from '@lib/typings/appUpdater'
import { IPlatform } from '@lib/typings/platform'

import * as WalletBindings from './walletPluginApi'

window['__WALLET__'] = WalletBindings

let activeProfileId = null

export const nativeSplash = SplashScreen

export const CapacitorApi: IPlatform = {
    updateAppSettings(settings: Partial<AppSettings>) {
        return new Promise((resolve) => resolve())
    },

    getActiveProfile() {
        return activeProfileId
    },

    updateActiveProfile(id) {
        activeProfileId = id
    },

    renameProfileFolder: (oldPath, newPath) => new Promise<void>((resolve, reject) => {}),

    removeProfileFolder: (profilePath) => new Promise<void>((resolve, reject) => {}),

    listProfileFolders: (profileStoragePath) => new Promise<string[]>((resolve, reject) => {}),

    PincodeManager: PincodeManager,

    DeepLinkManager: DeepLinkManager,

    NotificationManager: NotificationManager,

    BarcodeManager: BarcodeManager,

    getStrongholdBackupDestination: (defaultPath) => new Promise<string>((resolve, reject) => {}),

    exportTransactionHistory: async (defaultPath, content) => new Promise<string>((resolve, reject) => {}),

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
    exportMigrationLog: (sourcePath, defaultFileName) => new Promise<boolean>((resolve, reject) => {}),

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
    exportLedgerMigrationLog: (content, defaultFileName) => new Promise<boolean>((resolve, reject) => {}),

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
    importLegacySeed: (buffer, password) => new Promise<string>((resolve, reject) => {}),

    /**
     * Validates Seed Vault
     *
     * @method validateSeedVault
     *
     * @param {Buffer} buffer
     *
     * @returns {boolean}
     */
    validateSeedVault: (buffer) => new Promise<boolean>((resolve, reject) => {}),

    /**
     * Gets directory for app's configuration files
     *
     * @method getUserDataPath
     *
     * @returns {Promise}
     */
    getUserDataPath: () =>
        new Promise<string>((resolve, reject) => {
            resolve('DATA')
        }),

    /**
     * Gets diagnostics information for the system
     *
     * @method getDiagnostics
     *
     * @returns {Promise}
     */
    getDiagnostics: () => new Promise<{ label: string; value: string }[]>((resolve, reject) => {}),

    /**
     * Gets os information for the system
     *
     * @method getOS
     *
     * @returns {Promise}
     */
    getOS: () => new Promise<string>((resolve) => resolve(Capacitor.getPlatform())),

    /**
     * Gets machine ID
     *
     * @method getMachineId
     *
     * @returns {Promise}
     */
    getMachineId: () => new Promise<string>((resolve) => resolve('')),

    /**
     * Starts an update of the application
     *
     * @method updateDownload
     *
     * @returns void
     */
    updateDownload: () => new Promise<void>((resolve, reject) => {}),

    /**
     * Cancels an update of the application
     *
     * @method updateCancel
     *
     * @returns void
     */
    updateCancel: () => new Promise<void>((resolve, reject) => {}),

    /**
     * Install an update of the application
     *
     * @method updateInstall
     *
     * @returns void
     */
    updateInstall: () => new Promise<void>((resolve, reject) => {}),

    /**
     * Check for an update of the application
     *
     * @method updateCheck
     *
     * @returns void
     */
    updateCheck: () => new Promise<void>((resolve, reject) => {}),

    /**
     * Get version details
     *
     * @method getVersionDetails
     *
     * @returns void
     */
    getVersionDetails: () => new Promise<VersionDetails>((resolve, reject) => {}),

    /**
     * Change menu state to determine what menu items to display
     * @param {string} Attribute - Target attribute
     * @param {any} Value - Target attribute value
     * @returns {undefined}
     */
    updateMenu: (attribute, value) => new Promise<void>((resolve, reject) => {}),

    /**
     * Show the popup menu
     * @returns {undefined}
     */
    popupMenu: () => new Promise<void>((resolve, reject) => {}),

    /**
     * Minimize the app
     * @returns {undefined}
     */
    minimize: () => new Promise<void>((resolve, reject) => {}),

    /**
     * Maximize the app
     * @returns {undefined}
     */
    maximize: () => new Promise<boolean>((resolve, reject) => {}),

    /**
     * Is the app maximized
     * @returns {boolean}
     */
    isMaximized: () => new Promise<boolean>((resolve, reject) => {}),

    /**
     * Close the app
     * @returns {undefined}
     */
    close: () => new Promise<void>((resolve, reject) => {}),

    /*
     * Opens url and checks against acceptlist
     * @param {string} url - Target url
     * @returns {undefined}
     */
    openUrl: (url) => new Promise<void>((resolve, reject) => {}),

    /**
     * Log unhandled exception
     * @param {string} errorType The type of eerror
     * @param {Errir} error The error
     */
    unhandledException: (errorType, error) => new Promise<void>((resolve, reject) => {}),

    /**
     * Add native window wallet event listener
     * @param {string} event - Target event name
     * @param {function} callback - Event trigger callback
     * @returns {undefined}
     */
    onEvent: (event, callback) => new Promise<void>((resolve, reject) => {}),

    /**
     * Remove native window wallet event listener
     * @param {string} event - Target event name
     * @param {function} callback - Event trigger callback
     * @returns {undefined}
     */
    removeListenersForEvent: (event) => new Promise<void>((resolve, reject) => {}),

    /**
     * Save the recovery kit
     * @returns
     */
    saveRecoveryKit: (recoverKitData) => new Promise<void>((resolve, reject) => {}),

    /**
     * Hook the logger
     * @returns
     */
    hookErrorLogger,
    ledger: undefined,
}

window['__CAPACITOR__'] = CapacitorApi
