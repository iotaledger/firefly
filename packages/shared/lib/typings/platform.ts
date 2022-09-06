import { IAppSettings, IAppVersionDetails } from '@core/app'
import { IError } from '@core/error'
import { IDeepLinkManager } from '@auxiliary/deep-link'
import { INotificationManager } from './notificationManager'
import { IPincodeManager } from './pincodeManager'
import { EventMap } from './events'
import { IBarcodeManager } from './barcodeManager'

export enum Platforms {
    MOBILE = 'mobile',
    DESKTOP = 'desktop',
}

export interface IPlatform {
    getStrongholdBackupDestination(defaultPath: string): Promise<string | null>
    exportTransactionHistory(defaultPath: string, contents: string): Promise<string | null>
    getUserDataPath(): Promise<string>
    getDiagnostics(): Promise<{ label: string; value: string }[]>
    getOS(): Promise<string> | string
    getMachineId(): Promise<string>
    updateAppSettings(settings: Partial<IAppSettings>): Promise<void>
    getActiveProfile(): string
    updateActiveProfile(id: string): void
    removeProfileFolder(profilePath: string): Promise<void>
    renameProfileFolder(oldPath: string, newPath: string): Promise<void>
    listProfileFolders(profileStoragePath: string): Promise<string[]>
    updateMenu(attribute: string, value: unknown): void
    popupMenu(): void
    maximize(): Promise<boolean>
    minimize(): void
    close(): void
    isMaximized(): Promise<boolean>
    saveRecoveryKit(kitData: ArrayBuffer): Promise<void>
    openUrl(url: string): void
    hookErrorLogger(logger: (error: IError) => void): void
    copyFile(sourceFilePath: string, destinationFilePath: string): Promise<void>

    NotificationManager: INotificationManager | undefined
    DeepLinkManager: IDeepLinkManager | undefined
    PincodeManager: IPincodeManager | undefined
    BarcodeManager: IBarcodeManager | undefined

    getAppVersionDetails(): Promise<IAppVersionDetails>

    checkForAppUpdate(): Promise<void>
    installAppUpdate(): Promise<void>
    cancelAppUpdateDownload(): Promise<void>
    downloadAppUpdate(): Promise<void>

    unhandledException(title: string, err: IError | unknown): Promise<void>

    // SeedVault API methods
    validateSeedVault(buffer: unknown): Promise<boolean>

    onEvent<K extends keyof EventMap>(eventName: K, callback: (param: EventMap[K]) => void)
    removeListenersForEvent<K extends keyof EventMap>(eventName: K)
}
