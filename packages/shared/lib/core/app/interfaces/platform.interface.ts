import { IError } from '@core/error/interfaces'
import { IRouter } from '@core/router/interfaces'

import { AppContext } from '../enums'

import { IDeepLinkManager, INotificationManager, IPincodeManager } from './managers'
import { IAppSettings } from './app-settings.interface'
import { IAppVersionDetails } from './app-version-details.interface'
import { IPlatformEventMap } from './platform-event-map.interface'

export interface IPlatform {
    getStrongholdBackupDestination(defaultPath: string): Promise<string | null>
    exportTransactionHistory(defaultPath: string, contents: string): Promise<string | null>
    getUserDataPath(): Promise<string>
    getDiagnostics(): Promise<{ label: string; value: string }[]>
    getOS(): Promise<string>
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
    copyFile(sourceFilePath: string, destinationFilePath: string): Promise<void>

    NotificationManager: INotificationManager | undefined
    DeepLinkManager: IDeepLinkManager | undefined
    PincodeManager: IPincodeManager | undefined

    getAppVersionDetails(): Promise<IAppVersionDetails>

    checkForAppUpdate(): Promise<void>
    installAppUpdate(): Promise<void>
    cancelAppUpdateDownload(): Promise<void>
    downloadAppUpdate(): Promise<void>

    unhandledException(title: string, err: IError | unknown): Promise<void>

    resetRouters?(): void
    resetRouterForAppContext?(context: AppContext): void
    getRouterForAppContext?(context: AppContext): IRouter

    onEvent<K extends keyof IPlatformEventMap>(eventName: K, callback: (param: IPlatformEventMap[K]) => void)
    removeListenersForEvent<K extends keyof IPlatformEventMap>(eventName: K)
}
