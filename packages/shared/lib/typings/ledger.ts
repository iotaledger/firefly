export interface LedgerApp {
    name: string,
    version: string
}

export interface LedgerStatus {
    connected: boolean,
    locked: boolean,

    // TODO: Fix parsing of the API data
    // app?: LedgerApp
    appName?: string,
    appVersion?: string,
}

export enum LedgerDeviceState {
    Connected = 'connected',
    NotDetected = 'notDetected',
    AppNotOpen = 'appNotOpen',
    Locked = 'locked',
    MnemonicMismatch = 'mnemonicMismatch'
}
