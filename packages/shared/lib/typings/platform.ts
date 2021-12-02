import type { IDeepLinkManager } from './deepLinking/deepLinkManager'
import type { ILedger } from './ledger'
import type { INotificationManager } from './notificationManager'
import type { IPincodeManager } from './pincodeManager'
import type { VersionDetails } from './appUpdater'
import type { Error } from './error'
import type { EventMap } from './events'

export enum Platforms {
    MOBILE = 'mobile',
    DESKTOP = 'desktop',
}

export interface IPlatform {
    ledger: ILedger
    getStrongholdBackupDestination(defaultPath: string): Promise<string | null>
    exportMigrationLog(sourcePath: string, defaultFileName: string): Promise<boolean | null>
    exportLedgerMigrationLog(content: unknown, defaultFileName: string): Promise<boolean | null>
    getUserDataPath(): Promise<string>
    getDiagnostics(): Promise<{ label: string; value: string }[]>
    getOS(): Promise<string>
    updateActiveProfile(id: string): void
    removeProfileFolder(profilePath: string): Promise<void>
    listProfileFolders(profileStoragePath: string): Promise<string[]>
    updateMenu(attribute: string, value: unknown): void
    popupMenu(): void
    maximize(): Promise<boolean>
    minimize(): void
    close(): void
    isMaximized(): Promise<boolean>
    saveRecoveryKit(kitData: ArrayBuffer): Promise<void>
    openUrl(url: string): void
    hookErrorLogger(logger: (error: Error) => void): void
    NotificationManager: INotificationManager | undefined
    DeepLinkManager: IDeepLinkManager | undefined
    PincodeManager: IPincodeManager | undefined

    getVersionDetails(): Promise<VersionDetails>
    updateCheck(): Promise<void>
    updateInstall(): Promise<void>
    updateCancel(): Promise<void>
    updateDownload(): Promise<void>

    unhandledException(title: string, err: Error | unknown): Promise<void>

    // SeedVault API methods
    importLegacySeed(buffer: unknown, password: string): Promise<string>
    validateSeedVault(buffer: unknown): Promise<boolean>

    onEvent<K extends keyof EventMap>(eventName: K, callback: (param: EventMap[K]) => void)
    removeListenersForEvent<K extends keyof EventMap>(eventName: K)
}
