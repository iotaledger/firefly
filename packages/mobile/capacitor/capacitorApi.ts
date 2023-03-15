import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { Device } from '@capacitor/device'
import { IAppVersionDetails, IPlatform } from '@core/app'

import { DeepLinkManager } from './lib/deepLinkManager'
import { NotificationManager } from './lib/notificationManager'
import { PincodeManager } from './lib/pincodeManager'

import features from '@features/features'

import { WalletApi } from '@iota/wallet-mobile'

window['__WALLET__API__'] = WalletApi

let activeProfileId = null

export const nativeSplash = SplashScreen

const CapacitorApi: Partial<IPlatform> = {
    // TODO: https://github.com/iotaledger/firefly/issues/6172
    updateAppSettings: () => new Promise((resolve) => resolve),

    getActiveProfile() {
        return activeProfileId
    },

    updateActiveProfile(id) {
        activeProfileId = id
    },

    // TODO: https://github.com/iotaledger/firefly/issues/5577
    // TODO: https://github.com/iotaledger/firefly/issues/5578
    renameProfileFolder: () => {
        throw new Error('Function not implemented.')
    },

    // TODO: https://github.com/iotaledger/firefly/issues/5577
    // TODO: https://github.com/iotaledger/firefly/issues/5578
    removeProfileFolder: () => {
        throw new Error('Function not implemented.')
    },

    // TODO: https://github.com/iotaledger/firefly/issues/5577
    // TODO: https://github.com/iotaledger/firefly/issues/5578
    listProfileFolders: () => new Promise<string[]>((resolve) => resolve([''])),

    PincodeManager: PincodeManager,

    DeepLinkManager: DeepLinkManager,

    NotificationManager: NotificationManager,

    // TODO: https://github.com/iotaledger/firefly/issues/5577
    // TODO: https://github.com/iotaledger/firefly/issues/5578
    getStrongholdBackupDestination: () => {
        throw new Error('Function not implemented.')
    },

    // TODO: https://github.com/iotaledger/firefly/issues/5577
    // TODO: https://github.com/iotaledger/firefly/issues/5578
    exportTransactionHistory: () => {
        throw new Error('Function not implemented.')
    },

    /**
     * Gets directory for app's configuration files
     * (On mobile is handled by the Capacitor wallet plugin)
     */
    getUserDataPath: (): Promise<string> => new Promise<string>((resolve) => resolve('/DATA')),

    /**
     * Gets diagnostics information for the system
     */
    getDiagnostics: async (): Promise<{ label: string; value: string }[]> => {
        const info = await Device.getInfo()
        return [
            { label: 'Name', value: info.name },
            { label: 'Model', value: info.model },
            { label: 'OS', value: info.operatingSystem },
            { label: 'OS version', value: info.osVersion },
            { label: 'Manufacturer', value: info.manufacturer },
            { label: 'Webview version', value: info.webViewVersion },
            { label: 'Memory used', value: `${(info.memUsed / 1024 / 1024).toFixed(2)} MB` },
            { label: 'Disk free', value: `${(info.realDiskFree / 1024 / 1024).toFixed(2)} MB` },
        ]
    },

    /**
     * Gets os information for the system
     */
    getOS: (): Promise<string> => new Promise<string>((resolve) => resolve(Capacitor.getPlatform())),

    /**
     * Gets machine ID mockup mehotd
     * (We don't use Sentry for mobile)
     */
    getMachineId: () => new Promise<string>((resolve) => resolve('')),

    /**
     * Starts an update of the application
     * (On mobile the only way to update the app is acroos the stores,
     *  we only can show a drawer / notification to redirecto to stores)
     */
    downloadAppUpdate: () => new Promise<void>(() => {}),

    /**
     * Cancels an update of the application
     * (Not needed on mobile)
     */
    cancelAppUpdateDownload: () => new Promise<void>(() => {}),

    /**
     * Install an update of the application
     * (Not needed on mobile)
     */
    installAppUpdate: () => new Promise<void>(() => {}),

    /**
     * Check for an update of the application
     */
    checkForAppUpdate: () => new Promise<void>(() => {}),

    /**
     * Get version details
     */
    getAppVersionDetails: () => new Promise<IAppVersionDetails>(() => {}),

    /**
     * Change menu state to determine what menu items to display
     */
    updateMenu: () => new Promise<void>(() => {}),

    /**
     * Show the popup menu
     */
    popupMenu: () => new Promise<void>(() => {}),

    minimize: () => new Promise<void>(() => {}),

    maximize: () => new Promise<boolean>(() => {}),

    isMaximized: () => new Promise<boolean>(() => {}),

    /**
     * Close the app
     */
    close: () => new Promise<void>(() => {}),

    openUrl: () => new Promise<void>(() => {}),

    /**
     * Log unhandled exception
     */
    unhandledException: () => new Promise<void>(() => {}),

    onEvent: () => new Promise<void>(() => {}),

    removeListenersForEvent: () => new Promise<void>(() => {}),

    saveRecoveryKit: () => new Promise<void>(() => {}),
    isFeatureFlagEnabled(keyPath) {
        return keyPath?.split('.').reduce((prev, cur) => prev && prev[cur], features)?.enabled ?? false
    },
}

window['__CAPACITOR__'] = CapacitorApi
