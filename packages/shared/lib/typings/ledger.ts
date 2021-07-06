export interface LedgerAppInfo {
    name: string,
    version: string
}

export enum LedgerDeviceState {
    Connected = 'connected',
    NotDetected = 'notDetected',
    AppNotOpen = 'appNotOpen',
    Locked = 'locked',
    MnemonicMismatch = 'mnemonicMismatch'
}

export interface LedgerStatusPayload {
    type: LedgerStatus
}

export enum LedgerStatus {
    Connected = 'Connected',
    Disconnected = 'Disconnected',
    Locked = 'Locked'
}
