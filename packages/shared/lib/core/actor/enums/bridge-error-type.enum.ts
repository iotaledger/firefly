// Reference: https://github.com/iotaledger/wallet.rs/blob/develop/src/error.rs
export enum BridgeErrorType {
    // Generic
    IoError = 'IoError',
    JsonError = 'JsonError',
    ClientError = 'ClientError',
    Panic = 'Panic',

    // Account
    LatestAccountIsEmpty = 'LatestAccountIsEmpty',
    AccountNotEmpty = 'AccountNotEmpty',
    AccountInitialiseRequiredField = 'AccountInitialiseRequiredField',
    CannotUseIndexIdentifier = 'CannotUseIndexIdentifier',
    AccountAliasAlreadyExists = 'AccountAliasAlreadyExists',
    InvalidBackupFile = 'InvalidBackupFile',
    InvalidBackupDestination = 'InvalidBackupDestination',
    InsufficientFunds = 'InsufficientFunds',
    MnemonicEncode = 'MnemonicEncode',
    InvalidMnemonic = 'InvalidMnemonic',

    // Address
    InvalidAddress = 'InvalidAddress',
    InvalidAddressLength = 'InvalidAddressLength',
    InvalidRemainderValueAddress = 'InvalidRemainderValueAddress',
    AddressBuildRequiredField = 'AddressBuildRequiredField',

    // Message
    MessageNotFound = 'MessageNotFound',
    InvalidMessageIdLength = 'InvalidMessageIdLength',
    InvalidMessageId = 'InvalidMessageId',
    InvalidOutputKind = 'InvalidOutputKind',
    InvalidTransactionId = 'InvalidTransactionId',

    // Stronghold
    StrongholdError = 'StrongholdError',

    // Database
    StorageDoesntExist = 'StorageDoesntExist',
    Storage = 'Storage',
    StorageAdapterNotDefined = 'StorageAdapterNotDefined',
    StorageExists = 'StorageExists',
    StorageAdapterNotSet = 'StorageAdapterNotSet',
    StorageIsEncrypted = 'StorageIsEncrypted',
    RecordDecrypt = 'RecordDecrypt',
    RecordEncrypt = 'RecordEncrypt',
    RecordNotFound = 'RecordNotFound',

    // Bee (https://github.com/iotaledger/bee)
    BeeMessage = 'BeeMessage',

    // Nodes
    UrlError = 'UrlError',
    NodesNotSynced = 'NodesNotSynced',

    // Ledger
    LedgerMiscError = 'LedgerMiscError',
    LedgerDongleLocked = 'LedgerDongleLocked',
    LedgerDeniedByUser = 'LedgerDeniedByUser',
    LedgerDeviceNotFound = 'LedgerDeviceNotFound',
    LedgerEssenceTooLarge = 'LedgerEssenceTooLarge',
    WrongLedgerSeedError = 'WrongLedgerSeedError',

    // Dust output
    DustError = 'DustError',
}
