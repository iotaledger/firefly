import { Capacitor } from '@capacitor/core'

import { SplashScreen } from '@capacitor/splash-screen'
import { BarcodeManager } from './lib/barcodeManager'
import { DeepLinkManager } from './lib/deepLinkManager'
import { NotificationManager } from './lib/notificationManager'
import { PincodeManager } from './lib/pincodeManager'

import { hookErrorLogger } from '@lib/shell/errorLogger'
import { IAppVersionDetails } from '@core/app'
import { IPlatform } from '@lib/typings/platform'

let activeProfileId = null

export const nativeSplash = SplashScreen

export const CapacitorApi: IPlatform = {
    updateAppSettings() {
        return new Promise((resolve) => resolve())
    },

    getActiveProfile() {
        return activeProfileId
    },

    updateActiveProfile(id) {
        activeProfileId = id
    },

    renameProfileFolder: () => new Promise<void>(() => {}),

    removeProfileFolder: () => new Promise<void>(() => {}),

    listProfileFolders: () => new Promise<string[]>(() => {}),

    PincodeManager: PincodeManager,

    DeepLinkManager: DeepLinkManager,

    NotificationManager: NotificationManager,

    BarcodeManager: BarcodeManager,

    getStrongholdBackupDestination: () => new Promise<string>(() => {}),

    exportTransactionHistory: async () => new Promise<string>(() => {}),

    exportMigrationLog: () => new Promise<boolean>(() => {}),

    exportLedgerMigrationLog: () => new Promise<boolean>(() => {}),

    importLegacySeed: () => new Promise<string>(() => {}),

    getUserDataPath: () =>
        new Promise<string>((resolve) => {
            resolve('DATA')
        }),

    getDiagnostics: () => new Promise<{ label: string; value: string }[]>(() => {}),

    getOS: () => new Promise<string>((resolve) => resolve(Capacitor.getPlatform())),

    getMachineId: () => new Promise<string>((resolve) => resolve('')),

    /**
     * Starts an update of the application
     *
     * @method updateDownload
     *
     * @returns void
     */
    downloadAppUpdate: () => new Promise<void>(() => {}),

    /**
     * Cancels an update of the application
     *
     * @method updateCancel
     *
     * @returns void
     */
    cancelAppUpdateDownload: () => new Promise<void>(() => {}),

    /**
     * Install an update of the application
     *
     * @method updateInstall
     *
     * @returns void
     */
    installAppUpdate: () => new Promise<void>(() => {}),

    /**
     * Check for an update of the application
     *
     * @method updateCheck
     *
     * @returns void
     */
    checkForAppUpdate: () => new Promise<void>(() => {}),

    /**
     * Get version details
     *
     * @method getVersionDetails
     *
     * @returns void
     */
    getAppVersionDetails: () => new Promise<IAppVersionDetails>(() => {}),

    /**
     * Change menu state to determine what menu items to display
     * @returns {undefined}
     */
    updateMenu: () => new Promise<void>(() => {}),

    /**
     * Show the popup menu
     * @returns {undefined}
     */
    popupMenu: () => new Promise<void>(() => {}),

    minimize: () => new Promise<void>(() => {}),

    maximize: () => new Promise<boolean>(() => {}),

    isMaximized: () => new Promise<boolean>(() => {}),

    /**
     * Close the app
     * @returns {undefined}
     */
    close: () => new Promise<void>(() => {}),

    openUrl: () => new Promise<void>(() => {}),

    /**
     * Log unhandled exception
     * @param {string} errorType The type of eerror
     * @param {Errir} error The error
     */
    unhandledException: () => new Promise<void>(() => {}),

    onEvent: () => new Promise<void>(() => {}),

    removeListenersForEvent: () => new Promise<void>(() => {}),

    saveRecoveryKit: () => new Promise<void>(() => {}),
    hookErrorLogger,
    ledger: undefined,
}

window['__CAPACITOR__'] = CapacitorApi
