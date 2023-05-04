import { ErrorTypes as ValidatorErrorTypes } from '../typings/validator'
import { ErrorType } from '../typings/events'

const errorMessages: {
    [key in keyof typeof ErrorType]: string
} = {
    IoError: 'error.global.generic',
    JsonError: 'error.global.generic',
    ClientError: 'error.global.generic',
    Panic: 'error.global.generic',
    // Account
    LatestAccountIsEmpty: 'error.account.empty',
    AccountNotEmpty: 'error.account.notEmpty',
    AccountInitialiseRequiredField: 'error.global.generic',
    CannotUseIndexIdentifier: 'error.global.generic',
    AccountAliasAlreadyExists: 'error.account.duplicate',
    InvalidBackupFile: 'error.backup.invalid',
    InvalidBackupDestination: 'error.backup.destination',
    InsufficientFunds: 'error.send.amountTooHigh',
    MnemonicEncode: 'error.global.generic',
    InvalidMnemonic: 'error.backup.mnemonic',
    // Address
    InvalidAddress: 'error.send.wrongAddressFormat',
    InvalidAddressLength: 'error.send.generic',
    InvalidRemainderValueAddress: 'error.global.generic',
    AddressBuildRequiredField: 'error.global.generic',
    // Message
    MessageNotFound: 'error.global.generic',
    InvalidMessageIdLength: 'error.global.generic',
    InvalidMessageId: 'error.global.generic',
    InvalidOutputKind: 'error.global.generic',
    InvalidTransactionId: 'error.global.generic',
    // Stronghold
    StrongholdError: 'error.global.generic',
    OutdatedStrongholdVersion: 'error.stronghold.outdated',
    // Database
    StorageDoesntExist: 'error.global.generic',
    Storage: 'error.global.generic',
    StorageAdapterNotDefined: 'error.global.generic',
    StorageExists: 'error.global.generic',
    StorageAdapterNotSet: 'error.global.generic',
    StorageIsEncrypted: 'error.global.generic',
    RecordDecrypt: 'error.global.generic',
    RecordEncrypt: 'error.global.generic',
    RecordNotFound: 'error.global.generic',
    // Bee (https://github.com/iotaledger/bee)
    BeeMessage: 'error.global.generic',
    // Nodes
    UrlError: 'error.node.invalid',
    NodesNotSynced: 'error.node.unsynced',
    // Ledger
    LedgerMiscError: 'error.ledger.generic',
    WrongLedgerSeedError: 'error.ledger.mnemonicMismatch',
    LedgerDongleLocked: 'error.ledger.locked',
    LedgerDeniedByUser: 'error.send.cancelled',
    LedgerDeviceNotFound: 'error.ledger.notFound',
    LedgerEssenceTooLarge: 'error.global.generic',
    // Dust output
    LeavingDustError: 'error.send.leavingDust',
}

export const getErrorMessage = (type: ErrorType | ValidatorErrorTypes): string => {
    const message = errorMessages?.[type]
    return message ? message : 'error.global.generic'
}
