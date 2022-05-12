import type { IPlatform } from 'shared/lib/typings/platform'
import { Capacitor } from '@capacitor/core'

import { SplashScreen } from '@capacitor/splash-screen'
import { BarcodeManager } from './lib/barcodeManager'
import { SecureFilesystemAccess } from 'capacitor-secure-filesystem-access'
import { DeepLinkManager } from '../../mobile/capacitor/lib/deepLinkManager'
import { NotificationManager } from '../../mobile/capacitor/lib/notificationManager'
import { PincodeManager } from '../../mobile/capacitor/lib/pincodeManager'

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

    removeProfileFolder: async (profilePath) => {
        void (await SecureFilesystemAccess.removeProfileFolder({
            folder: profilePath,
        }))
    },

    listProfileFolders: (profileStoragePath) => new Promise<string[]>((resolve, reject) => {}),

    PincodeManager: PincodeManager,

    DeepLinkManager: DeepLinkManager,

    NotificationManager: NotificationManager,

    BarcodeManager: BarcodeManager,

    getStrongholdBackupDestination: async (defaultPath) => {
        // only with folder param the picker needs filename to save,
        // we pass explicity null on mobile to pick files
        const type = defaultPath === null ? 'file' : 'folder'
        const { selected } = await SecureFilesystemAccess.showPicker({
            type,
            defaultPath,
        })
        return `${selected}`
    },

    saveStrongholdBackup: async ({ allowAccess }) => {
        const os: string = Capacitor.getPlatform()
        switch (os) {
            case 'ios':
                if (allowAccess) {
                    await SecureFilesystemAccess.allowAccess()
                } else {
                    await SecureFilesystemAccess.revokeAccess()
                }
                break
            case 'android':
                if (!allowAccess) {
                    await SecureFilesystemAccess.finishBackup()
                }
                break
        }
        return
    },

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
    getUserDataPath: () => new Promise<string>((resolve, reject) => resolve('')),

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
    saveRecoveryKit: async (recoverKitData) => {
        const os: string = Capacitor.getPlatform()
        const { selected } = await SecureFilesystemAccess.showPicker({
            type: 'folder',
            defaultPath: '',
        })
        if (os === 'ios') {
            void (await SecureFilesystemAccess.allowAccess())
        }
        void (await SecureFilesystemAccess.saveRecoveryKit({
            selectedPath: `${selected}/recovery-kit.pdf`,
            fromRelativePath: '/assets/docs/recovery-kit.pdf',
        }))
        if (os === 'ios') {
            void SecureFilesystemAccess.revokeAccess()
        }
        return
    },

    /**
     * Hook the logger
     * @returns
     */
    hookErrorLogger,
    ledger: undefined,
}

window['__CAPACITOR__'] = CapacitorApi
