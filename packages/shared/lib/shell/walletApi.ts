import {
    MessageResponse,
    ResponseTypes,
} from '../typings/bridge'
import { ErrorType } from '../typings/events'
import { ErrorTypes as ValidatorErrorTypes } from '../typings/validator'

type CallbacksStore = {
    [id: string]: CallbacksPattern
}

type CallbacksPattern = {
    onSuccess: (message: MessageResponse) => void
    onError: (message: ErrorMessage) => void
}

type ErrorMessage = {
    type: ErrorType | ValidatorErrorTypes
    error: string
}

const eventsApiToResponseTypeMap = {
    onError: ResponseTypes.ErrorThrown,
    onBalanceChange: ResponseTypes.BalanceChange,
    onNewTransaction: ResponseTypes.NewTransaction,
    onConfirmationStateChange: ResponseTypes.ConfirmationStateChange,
    onReattachment: ResponseTypes.Reattachment,
    onBroadcast: ResponseTypes.Broadcast,
    onStrongholdStatusChange: ResponseTypes.StrongholdStatusChange,
    onTransferProgress: ResponseTypes.TransferProgress,
    onLedgerAddressGeneration: ResponseTypes.LedgerAddressGeneration,
    onMigrationProgress: ResponseTypes.MigrationProgress,

    // Staking
    onStakingOverview: ResponseTypes.StakingOverview,
    onStakedAccount: ResponseTypes.StakedAccount,
    onUnstakedAccount: ResponseTypes.UnstakedAccount,
    onAdditionalFundsStaked: ResponseTypes.AdditionalFundsStaked,
}

const apiToResponseTypeMap = {
    ...eventsApiToResponseTypeMap,

    removeAccount: ResponseTypes.RemovedAccount,
    createAccount: ResponseTypes.CreatedAccount,
    getAccount: ResponseTypes.ReadAccount,
    getAccounts: ResponseTypes.ReadAccounts,
    syncAccounts: ResponseTypes.SyncedAccounts,
    startBackgroundSync: ResponseTypes.Ok,
    stopBackgroundSync: ResponseTypes.Ok,
    listMessages: ResponseTypes.Messages,
    listAddresses: ResponseTypes.Addresses,
    generateAddress: ResponseTypes.GeneratedAddress,
    latestAddress: ResponseTypes.LatestAddress,
    getBalance: ResponseTypes.Balance,
    reattach: ResponseTypes.Reattached,
    backup: ResponseTypes.BackupSuccessful,
    restoreBackup: ResponseTypes.BackupRestored,
    send: ResponseTypes.SentTransfer,
    setStrongholdPassword: ResponseTypes.StrongholdPasswordSet,
    generateMnemonic: ResponseTypes.GeneratedMnemonic,
    storeMnemonic: ResponseTypes.StoredMnemonic,
    verifyMnemonic: ResponseTypes.VerifiedMnemonic,
    setStoragePassword: ResponseTypes.StoragePasswordSet,
    getStrongholdStatus: ResponseTypes.StrongholdStatus,
    getUnusedAddress: ResponseTypes.UnusedAddress,
    isLatestAddressUnused: ResponseTypes.IsLatestAddressUnused,
    areLatestAddressesUnused: ResponseTypes.AreAllLatestAddressesUnused,
    setAlias: ResponseTypes.UpdatedAlias,
    deleteStorage: ResponseTypes.DeletedStorage,
    lockStronghold: ResponseTypes.LockedStronghold,
    changeStrongholdPassword: ResponseTypes.StrongholdPasswordChanged,
    getLedgerDeviceStatus: ResponseTypes.LedgerStatus,
    setStrongholdPasswordClearInterval: ResponseTypes.StrongholdPasswordClearIntervalSet,
    getLegacySeedChecksum: ResponseTypes.LegacySeedChecksum,
    getNodeInfo: ResponseTypes.NodeInfo,
    mineBundle: ResponseTypes.MinedBundle,
    getLegacyAddressChecksum: ResponseTypes.LegacyAddressChecksum,

    // Participation
    getParticipationOverview: ResponseTypes.ParticipationOverview,
    getParticipationEvents: ResponseTypes.EventsData,
    participate: ResponseTypes.SentParticipation,
}

/**
 * A simple store for keeping references to (success, error) callbacks
 */
const callbacksStore: CallbacksStore = {}

/**
 * (Default) callbacks for wallet.rs methods.
 * They can be overridden by the caller component.
 */
const defaultCallbacks = {
    StrongholdPasswordSet: {
        onSuccess: (): void => {},
        onError: (): void => {},
    },
    CreatedAccount: {
        onSuccess: (): void => {},
        onError: (): void => {},
    },
    ReadAccounts: {
        onSuccess: (): void => {},
        onError: (): void => {},
    },
    LatestAddress: {
        onSuccess: (): void => {},
        onError: (): void => {},
    },
    SyncedAccounts: {
        onSuccess: (): void => {},
        onError: (): void => {},
    },
    BalanceChange: {
        onSuccess: (): void => {},
    },
    NewTransaction: {
        onSuccess: (): void => {},
    },
    StrongholdPasswordClearIntervalSet: {
        onSuccess: (): void => {},
        onError: (): void => {},
    },
}

/**
 * @method generateRandomId
 *
 * @returns {string}
 */
const generateRandomId = (): string =>
    Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join(
        ''
    )
