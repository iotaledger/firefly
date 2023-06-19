import { IAppSettings, IAppVersionDetails, IPlatform, IPlatformEventMap } from '@core/app'
import { IError } from '@core/error'

const Platform: IPlatform = {
    DeepLinkManager: undefined,
    NotificationManager: undefined,
    PincodeManager: undefined,
    close(): void {},
    exportTransactionHistory(defaultPath: string, contents: string): Promise<string | null> {
        return Promise.resolve(null)
    },
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
        return Promise.resolve(null)
    },
    getUserDataPath(): Promise<string> {
        return Promise.resolve('')
    },
    getAppVersionDetails(): Promise<IAppVersionDetails> {
        return Promise.resolve(undefined)
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
    onEvent<K extends keyof IPlatformEventMap>(eventName: K, callback: (param: IPlatformEventMap[K]) => void) {},
    openUrl(url: string): void {},
    popupMenu(): void {},
    removeListenersForEvent<K extends keyof IPlatformEventMap>(eventName: K) {},
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
    downloadNft(): Promise<void> {
        return Promise.resolve(undefined)
    },
    cancelNftDownload(nftId: string): Promise<void> {
        return Promise.resolve(undefined)
    },
    checkIfFileExists(): Promise<boolean> {
        return Promise.resolve(false)
    },
    updateMenu(attribute: string, value: unknown): void {},
    copyFile(copyFilePath: string, destinationFilePath: string): Promise<void> {
        return Promise.resolve()
    },
    deleteFile(filePath: string): Promise<void> {
        return Promise.resolve()
    },
    isFeatureFlagEnabled(keyPath: string): boolean {
        return false
    },
    getLanguageCode(): Promise<string> {
        return Promise.resolve('')
    },
    updateTheme(): void {},
}

window['__CAPACITOR__'] = Platform
window['__ELECTRON__'] = Platform
