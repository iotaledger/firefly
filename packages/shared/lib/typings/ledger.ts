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
    Connected = 'connected',
    NotDetected = 'notDetected',
    AppNotOpen = 'appNotOpen',
    Locked = 'locked',
    MnemonicMismatch = 'mnemonicMismatch',
    LegacyConnected = 'legacyConnected',
}

export enum AppName {
    IOTA = 'IOTA',
    IOTALegacy = 'IOTA Legacy'
}