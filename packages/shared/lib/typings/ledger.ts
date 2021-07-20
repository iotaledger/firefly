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

export enum LegacyLedgerErrorName {
    DisconnectedDeviceDuringOperation = 'DisconnectedDeviceDuringOperation',
    DisconnectedDevice = 'DisconnectedDevice',
    TransportStatusError = 'TransportStatusError'
}

export enum LegacyLedgerErrorCode {
    DeniedByTheUser = 27013, // 0x6985
    TimeoutExceeded = 25601 // 0x6401
}