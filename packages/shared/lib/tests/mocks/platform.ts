import { IPlatform } from '../../typings/platform'
import { VersionDetails } from '../../typings/appUpdater'
import { EventMap } from '../../typings/events'
import { AppSettings } from '../../typings/app'
import { Error } from '../../typings/error'
import { ActionSheetOptions } from '../../typings/actionSheet'

const Platform: IPlatform = {
    BarcodeManager: undefined,
    DeepLinkManager: undefined,
    NotificationManager: undefined,
    PincodeManager: undefined,
    ledger: undefined,
    close(): void {},
    exportLedgerMigrationLog(content: unknown, defaultFileName: string): Promise<boolean | null> {
        return Promise.resolve(undefined)
    },
    exportMigrationLog(sourcePath: string, defaultFileName: string): Promise<boolean | null> {
        return Promise.resolve(undefined)
    },
    exportTransactionHistory(defaultPath: string, contents: string): Promise<string | null> {
        return Promise.resolve(undefined)
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
    saveStrongholdBackup({ allowAccess }: { allowAccess: boolean }): Promise<void> {
        return Promise.resolve(undefined)
    },
    getStrongholdBackupDestination(defaultPath: string): Promise<string | null> {
        return Promise.resolve(undefined)
    },
    getUserDataPath(): Promise<string> {
        return Promise.resolve('')
    },
    getVersionDetails(): Promise<VersionDetails> {
        return Promise.resolve(undefined)
    },
    hookErrorLogger(logger: (error: Error) => void): void {},
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
    unhandledException(title: string, err: Error | unknown): Promise<void> {
        return Promise.resolve(undefined)
    },
    updateActiveProfile(id: string): void {},
    updateAppSettings(settings: Partial<AppSettings>): Promise<void> {
        return Promise.resolve(undefined)
    },
    updateCancel(): Promise<void> {
        return Promise.resolve(undefined)
    },
    updateCheck(): Promise<void> {
        return Promise.resolve(undefined)
    },
    updateDownload(): Promise<void> {
        return Promise.resolve(undefined)
    },
    updateInstall(): Promise<void> {
        return Promise.resolve(undefined)
    },
    updateMenu(attribute: string, value: unknown): void {},
    validateSeedVault(buffer: unknown): Promise<boolean> {
        return Promise.resolve(false)
    },
    share(text: string): Promise<void> {
        return Promise.resolve(undefined)
    },
    showActionSheet(options: ActionSheetOptions): Promise<number> {
        return Promise.resolve(0)
    },
    copy(text): Promise<void> {
        return Promise.resolve(undefined)
    },
    paste(): Promise<string> {
        return Promise.resolve('')
    },
}

window['__CAPACITOR__'] = Platform
window['__ELECTRON__'] = Platform
