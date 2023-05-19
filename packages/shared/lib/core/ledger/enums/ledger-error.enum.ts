export enum LedgerError {
    DeniedByUser = 'denied by user',
    DeviceNotFound = 'device not found',
    Generic = 'generic',
    Locked = 'ledger locked',
    Transport = 'transport error',
}

export enum LedgerErrorCode {
    DeviceLocked = '0x6b0c',
    DisconnectedDevice = 'DisconnectedDevice',
    NoAppOpen = '0x6511',
    NoDevice = 'NoDevice',
    UpdateRequired = '0x6e00',
    WrongApp = '0x6a15',
}
