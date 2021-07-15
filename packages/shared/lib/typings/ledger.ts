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
    NotDetected = 'notDetected',
    OtherConnected = 'otherConnected'
}

export enum LedgerAppName {
    BOLOS = 'BOLOS',
    IOTA = 'IOTA',
    IOTALegacy = 'IOTA Legacy'
}
