export interface LedgerApp {
    name: string,
    version: string
}

export interface LedgerStatus {
    connected: boolean,
    locked: boolean,
    app?: LedgerApp
}

export enum LedgerDeviceState {
    AppNotOpen = 'appNotOpen',
    Connected = 'connected',
    LegacyConnected = 'legacyConnected',
    Locked = 'locked',
    MnemonicMismatch = 'mnemonicMismatch',
    NotDetected = 'notDetected'
}

export enum AppName {
    IOTA = 'IOTA',
    IOTALegacy = 'IOTA Legacy'
}
