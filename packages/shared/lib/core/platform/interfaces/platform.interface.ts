import { VersionDetails } from '@core/app'
import { Error } from '@core/error'
import { INotificationManager } from '@core/notification'

import { IDeepLinkManager } from '@common/deep-links'

import { ILedger } from '@lib/typings/ledger'
import { AppSettings } from '@core/app'
import { IPincodeManager } from '@lib/typings/pincodeManager'
import { IBarcodeManager } from '@lib/typings/barcodeManager'
import { EventMap } from '@lib/typings/events'

export interface IPlatform {
    ledger: ILedger
    getStrongholdBackupDestination(defaultPath: string): Promise<string | null>
    exportTransactionHistory(defaultPath: string, contents: string): Promise<string | null>
    exportMigrationLog(sourcePath: string, defaultFileName: string): Promise<boolean | null>
    exportLedgerMigrationLog(content: unknown, defaultFileName: string): Promise<boolean | null>
    getUserDataPath(): Promise<string>
    getDiagnostics(): Promise<{ label: string; value: string }[]>
    getOS(): Promise<string> | string
    getMachineId(): Promise<string>
    updateAppSettings(settings: Partial<AppSettings>): Promise<void>
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
    hookErrorLogger(logger: (error: Error) => void): void

    NotificationManager: INotificationManager | undefined
    DeepLinkManager: IDeepLinkManager | undefined
    PincodeManager: IPincodeManager | undefined
    BarcodeManager: IBarcodeManager | undefined

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
