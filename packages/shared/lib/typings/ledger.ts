import { LedgerStatus } from '@iota/wallet'

export interface LedgerExtendedStatus extends LedgerStatus {
    connectionState: LedgerConnectionState
}

export enum LedgerConnectionState {
    AppNotOpen = 'appNotOpen',
    Connected = 'connected',
    Locked = 'locked',
    NotDetected = 'notDetected',
    OtherConnected = 'otherConnected',
    MnemonicMismatch = 'mnemonicMismatch',
}

export enum LedgerAppName {
    BOLOS = 'BOLOS',
    SHIMMER = 'Shimmer',
    IOTALegacy = 'IOTA Legacy',
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
