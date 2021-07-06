export interface LedgerAppInfo {
    name: string,
    version: string
}

export enum LedgerDeviceState {
    Connected = 'connected',
    NotDetected = 'notDetected',
    AppNotOpen = 'appNotOpen',
    MnemonicMismatch = 'mnemonicMismatch',
    LegacyConnected = 'legacyConnected',
}

export interface LedgerStatusPayload {
    type: LedgerStatus
}

export enum LedgerStatus {
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    Locked = 'Locked'
}

export enum LedgerApp {
    IOTA = 'IOTA',
    IOTALegacy = 'IOTA Legacy'
}