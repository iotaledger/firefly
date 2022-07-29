export interface ILedger {
    connected: boolean
    listeners: { (...data: unknown[]): void }[]
    selectSeed(index: number, page: number, security: number): Promise<void | null>
    awaitConnection(): Promise<void>
    awaitApplication(index: number, page: number, security: number): Promise<void>
    onMessage(...data: unknown[]): void
    addListener(...data: unknown[]): void
    removeListener(...data: unknown[]): void
}
export interface LedgerApp {
    name: string
    version: string
}

export interface LedgerStatus {
    connected: boolean
    locked: boolean
    app?: LedgerApp
}

export enum LedgerDeviceState {
    AppNotOpen = 'appNotOpen',
    Connected = 'connected',
    LegacyConnected = 'legacyConnected',
    Locked = 'locked',
    MnemonicMismatch = 'mnemonicMismatch',
    NotDetected = 'notDetected',
    OtherConnected = 'otherConnected',
}

export enum LedgerAppName {
    BOLOS = 'BOLOS',
    IOTA = 'IOTA',
    Shimmer = 'Shimmer',
}

export enum LegacyLedgerErrorName {
    DisconnectedDeviceDuringOperation = 'DisconnectedDeviceDuringOperation',
    DisconnectedDevice = 'DisconnectedDevice',
    TransportStatusError = 'TransportStatusError',
}

export enum LegacyLedgerErrorCode {
    DeniedByTheUser = 27013, // 0x6985
    InvalidBundle = 27044, // 0x69a4
    TimeoutExceeded = 25601, // 0x6401
    Unknown = 28161, // 0x6e01
}
