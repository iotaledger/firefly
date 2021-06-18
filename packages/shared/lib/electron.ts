import type { Error } from "./errors";
import type { WalletRoutes } from "./typings/routes";

export type VersionDetails = {
    upToDate: boolean
    currentVersion: string
    newVersion: string
    newVersionReleaseDate: Date
    changelog: string
}

export type NativeProgress = {
    total: number
    delta: number
    transferred: number
    percent: number
    bytesPerSecond: number
}

export interface INotificationManager {
    notify(message: string, contextData: any): void
}

export interface IDeepLinkManager {
    requestDeepLink(): void
}

export interface IPincodeManager {
    set(id: string, pin: string): Promise<void>
    remove(id: string): Promise<boolean>
    verify(id: string, pin: string): Promise<boolean>
}

interface ElectronEventMap {
    "menu-logout": void;
    "menu-navigate-wallet": WalletRoutes;
    "menu-navigate-settings": void;
    "menu-check-for-update": void;
    "menu-error-log": void;
    "menu-diagnostics": void;
    "log-error": void;
    "deep-link-params": string;
    "version-details": VersionDetails;
    "version-progress": NativeProgress;
    "version-complete": void;
    "version-error": Error;
    "notification-activated": any;
}

interface ILedger {
    connected: boolean;
    listeners: { (...data: any[]): void; }[];
    selectSeed(index: number, page: number, security: number): Promise<void | null>;
    awaitConnection(): Promise<void>;
    awaitApplication(index: number, page: number, security: number): Promise<void>;
    onMessage(...data: any[]): void;
    addListener(...data: any[]): void;
    removeListener(...data: any[]): void;
}

export interface IElectron {
    ledger: ILedger;
    getStrongholdBackupDestination(defaultPath: string): Promise<string | null>;
    exportMigrationLog(sourcePath: string, defaultFileName: string): Promise<boolean | null>;
    exportLedgerMigrationLog(content: any, defaultFileName: string): Promise<boolean | null>;
    getUserDataPath(): Promise<string>;
    getDiagnostics(): Promise<{ label: string; value: string; }[]>;
    getOS(): Promise<string>;
    updateActiveProfile(id: string): void;
    removeProfileFolder(profilePath: string): Promise<void>;
    listProfileFolders(profileStoragePath: string): Promise<string[]>;
    updateMenu(attribute: string, value: unknown): void;
    popupMenu(): void;
    maximize(): Promise<boolean>;
    minimize(): void;
    close(): void;
    isMaximized(): Promise<boolean>;
    saveRecoveryKit(kitData: ArrayBuffer): Promise<void>;
    openUrl(url: string): void;
    hookErrorLogger(logger: (error: Error) => void): void

    NotificationManager: INotificationManager;

    DeepLinkManager: IDeepLinkManager;

    PincodeManager: IPincodeManager;
    getVersionDetails(): Promise<VersionDetails>;
    updateCheck(): Promise<void>
    updateInstall(): Promise<void>
    updateCancel(): Promise<void>
    updateDownload(): Promise<void>

    unhandledException(title: string, err: Error): Promise<void>

    // SeedVault API methods
    importLegacySeed(buffer: any, password: string): Promise<string>;
    validateSeedVault(buffer: any): Promise<boolean>;

    onEvent<K extends keyof ElectronEventMap>(eventName: K, callback: (param: ElectronEventMap[K]) => void);
}

export const Electron: IElectron = window['Electron'];
