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
    notify(message: string): void
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
}

export interface IElectron {
    getStrongholdBackupDestination(defaultPath: string): Promise<string | null>;
    getUserDataPath(): Promise<string>;
    getDiagnostics(): Promise<{ label: string; value: string; }[]>;
    getOS(): Promise<string>;
    updateActiveProfile(id: string): void;
    removeProfileFolder(profilePath: string): Promise<void>;
    updateMenu(attribute: string, value: unknown): void;
    popupMenu(): void;
    maximize(): void;
    minimize(): void;
    close(): void;
    saveRecoveryKit(kitData: ArrayBuffer): Promise<void>;
    openUrl(url: string): void;
    hookErrorLogger(logger: (error: Error) => void): void

    NotificationManager: INotificationManager;

    DeepLinkManager: IDeepLinkManager;

    PincodeManager: IPincodeManager;

    getVersionDetails(): Promise<VersionDetails>;
    updateInstall(): Promise<void>
    updateCancel(): Promise<void>
    updateDownload(): Promise<void>

    onEvent<K extends keyof ElectronEventMap>(eventName: K, callback: (param: ElectronEventMap[K]) => void);
}

export const Electron: IElectron = window['Electron'];
