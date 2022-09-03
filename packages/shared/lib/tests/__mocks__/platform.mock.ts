import { IAppSettings, IAppVersionDetails } from '@core/app'
import { IError } from '@core/error'
import { EventMap } from '@lib/typings/events'
import { IPlatform } from '@lib/typings/platform'

const Platform: IPlatform = {
    BarcodeManager: undefined,
    DeepLinkManager: undefined,
    NotificationManager: undefined,
    PincodeManager: undefined,
    close(): void {},
    getActiveProfile(): string {
        return ''
    },
    getDiagnostics(): Promise<{ label: string; value: string }[]> {
        return Promise.resolve([])
    },
    getMachineId(): Promise<string> {
        return Promise.resolve('')
    },
    getOS(): Promise<string> {
        return Promise.resolve('')
    },
    getStrongholdBackupDestination(defaultPath: string): Promise<string | null> {
        return Promise.resolve(undefined)
    },
    getUserDataPath(): Promise<string> {
        return Promise.resolve('')
    },
    getAppVersionDetails(): Promise<IAppVersionDetails> {
        return Promise.resolve(undefined)
    },
    hookErrorLogger(logger: (error: IError) => void): void {},
    importLegacySeed(buffer: unknown, password: string): Promise<string> {
        return Promise.resolve('')
    },
    isMaximized(): Promise<boolean> {
        return Promise.resolve(false)
    },
    listProfileFolders(profileStoragePath: string): Promise<string[]> {
        return Promise.resolve([])
    },
    maximize(): Promise<boolean> {
        return Promise.resolve(false)
    },
    minimize(): void {},
    onEvent<K extends keyof EventMap>(eventName: K, callback: (param: EventMap[K]) => void) {},
    openUrl(url: string): void {},
    popupMenu(): void {},
    removeListenersForEvent<K extends keyof EventMap>(eventName: K) {},
    removeProfileFolder(profilePath: string): Promise<void> {
        return Promise.resolve(undefined)
    },
    renameProfileFolder(oldPath: string, newPath: string): Promise<void> {
        return Promise.resolve(undefined)
    },
    saveRecoveryKit(kitData: ArrayBuffer): Promise<void> {
        return Promise.resolve(undefined)
    },
    unhandledException(title: string, err: IError | unknown): Promise<void> {
        return Promise.resolve(undefined)
    },
    updateActiveProfile(id: string): void {},
    updateAppSettings(settings: Partial<IAppSettings>): Promise<void> {
        return Promise.resolve(undefined)
    },
    cancelAppUpdateDownload(): Promise<void> {
        return Promise.resolve(undefined)
    },
    checkForAppUpdate(): Promise<void> {
        return Promise.resolve(undefined)
    },
    downloadAppUpdate(): Promise<void> {
        return Promise.resolve(undefined)
    },
    installAppUpdate(): Promise<void> {
        return Promise.resolve(undefined)
    },
    updateMenu(attribute: string, value: unknown): void {},
    validateSeedVault(buffer: unknown): Promise<boolean> {
        return Promise.resolve(false)
    },
    copyFile(copyFilePath: string, destinationFilePath: string): Promise<void> {
        return Promise.resolve()
    },
}

window['__CAPACITOR__'] = Platform
window['__ELECTRON__'] = Platform
