import { Capacitor } from '@capacitor/core'
import { Device } from '@capacitor/device'
import { SecureFilesystemAccess } from 'capacitor-secure-filesystem-access'
import { App } from '@capacitor/app'

import { IAppVersionDetails, IPlatform } from '@core/app'
import features from '@features/features'

import { DeepLinkManager } from './lib/deepLinkManager'
import { NotificationManager } from './lib/notificationManager'
import { PincodeManager } from './lib/pincodeManager'

import { WalletApi } from '@iota/wallet-mobile'

window['__WALLET__API__'] = WalletApi

let activeProfileId = null

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
    listProfileFolders: () => new Promise<string[]>(() => {}),

    PincodeManager: PincodeManager,

    DeepLinkManager: DeepLinkManager,

    NotificationManager: NotificationManager,

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

    // TODO: https://github.com/iotaledger/firefly/issues/5577
    // TODO: https://github.com/iotaledger/firefly/issues/5578
    exportTransactionHistory: () => {
        throw new Error('Function not implemented.')
    },

    // Gets directory for app's configuration files
    // (On mobile is handled by the Capacitor wallet plugin)
    getUserDataPath: (): Promise<string> => new Promise<string>((resolve) => resolve('/DATA')),

    // Gets diagnostics information for the system
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

    // Gets os information for the system
    getOS: (): Promise<string> => new Promise<string>((resolve) => resolve(Capacitor.getPlatform())),

    // Check for an update of the application
    // TODO https://github.com/iotaledger/firefly/issues/6191
    checkForAppUpdate: () => new Promise<void>(() => {}),

    // Get version details
    getAppVersionDetails: async (): Promise<IAppVersionDetails> => {
        const { version, build } = await App.getInfo()
        return {
            upToDate: true,
            currentVersion: `${version} (${build})`,
            newVersion: '',
            newVersionReleaseDate: new Date(),
            changelog: '',
        }
    },

    isFeatureFlagEnabled(keyPath) {
        return keyPath?.split('.').reduce((prev, cur) => prev && prev[cur], features)?.enabled ?? false
    },

    cancelNftDownload: () => new Promise<void>(() => {}),

    /**
     * Methods not needed on mobile
     */
    copyFile: () => new Promise((resolve) => resolve),

    getMachineId: () => new Promise<string>((resolve) => resolve('')),

    downloadAppUpdate: () => new Promise<void>(() => {}),

    cancelAppUpdateDownload: () => new Promise<void>(() => {}),

    installAppUpdate: () => new Promise<void>(() => {}),

    updateMenu: () => new Promise<void>(() => {}),

    popupMenu: () => new Promise<void>(() => {}),

    minimize: () => new Promise<void>(() => {}),

    maximize: () => new Promise<boolean>(() => {}),

    isMaximized: () => new Promise<boolean>(() => {}),

    close: () => new Promise<void>(() => {}),

    onEvent: () => new Promise<void>(() => {}),

    removeListenersForEvent: () => new Promise<void>(() => {}),

    openUrl: () => new Promise<void>(() => {}),

    unhandledException: () => new Promise<void>(() => {}),

    saveRecoveryKit: () => new Promise<void>(() => {}),

    getLanguageCode: async () => {
        const { value } = await Device.getLanguageCode()
        return value
    },

    updateTheme: () => new Promise<void>(() => {}),
}

window['__CAPACITOR__'] = CapacitorApi
