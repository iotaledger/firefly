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
    "deep-link-params": string;
    "version-details": VersionDetails;
    "version-progress": NativeProgress;
    "version-complete": void;
    "version-error": Error;
}

export interface IElectron {
    getStrongholdBackupDestination(): Promise<string>;
    exportStronghold(defaultPath: string): Promise<string | null>;
    getUserDataPath(): Promise<string>;
    getDiagnostics(): Promise<{ label: string; value: string; }[]>;
    updateActiveProfile(id: string): void;
    updateMenu(attribute: string, value: unknown): void;

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
