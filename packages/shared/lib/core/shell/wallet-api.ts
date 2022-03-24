import {
    CreatedAccountResponse,
    LatestAddressResponse,
    BridgeResponses,
    ReadAccountsResponse,
    SetStrongholdPasswordResponse,
    SyncAccountsResponse,
} from '@core/actor'
import { BridgeResponseType } from '@core/actor'
import { BalanceChangeEventPayload, TransactionEventPayload } from '@lib/typings/events'
import { BridgeErrorType, BridgeEvent } from '@core/actor'
import { ValidationError, ValidatorService } from '@core/validators'
import { Platform } from '@core/platform/platform'
import { NodePlugin } from '@lib/typings/node'
import { IWalletApi } from '@core/api'
import { IWalletActor } from '@lib/typings/walletActor'

import { logError } from './error-logger'
import { getErrorMessage } from './wallet-errors'

export const WALLET: IWalletActor = window['__WALLET__']

type CallbacksStore = {
    [id: string]: CallbacksPattern
}

type CallbacksPattern = {
    onSuccess: (message: BridgeResponses) => void
    onError: (message: ErrorMessage) => void
}

type ErrorMessage = {
    type: BridgeErrorType | ValidationError
    error: string
}

const eventsApiToResponseTypeMap = {
    onError: BridgeResponseType.ErrorThrown,
    onBalanceChange: BridgeResponseType.BalanceChange,
    onNewTransaction: BridgeResponseType.NewTransaction,
    onConfirmationStateChange: BridgeResponseType.ConfirmationStateChange,
    onReattachment: BridgeResponseType.Reattachment,
    onBroadcast: BridgeResponseType.Broadcast,
    onStrongholdStatusChange: BridgeResponseType.StrongholdStatusChange,
    onTransferProgress: BridgeResponseType.TransferProgress,
    onLedgerAddressGeneration: BridgeResponseType.LedgerAddressGeneration,
    onMigrationProgress: BridgeResponseType.MigrationProgress,

    // Staking
    onStakingOverview: BridgeResponseType.StakingOverview,
    onStakedAccount: BridgeResponseType.StakedAccount,
    onUnstakedAccount: BridgeResponseType.UnstakedAccount,
    onAdditionalFundsStaked: BridgeResponseType.AdditionalFundsStaked,
}

const apiToResponseTypeMap = {
    ...eventsApiToResponseTypeMap,

    removeAccount: BridgeResponseType.RemovedAccount,
    createAccount: BridgeResponseType.CreatedAccount,
    getAccount: BridgeResponseType.ReadAccount,
    getAccounts: BridgeResponseType.ReadAccounts,
    syncAccounts: BridgeResponseType.SyncedAccounts,
    startBackgroundSync: BridgeResponseType.Ok,
    stopBackgroundSync: BridgeResponseType.Ok,
    listMessages: BridgeResponseType.Messages,
    listAddresses: BridgeResponseType.Addresses,
    generateAddress: BridgeResponseType.GeneratedAddress,
    latestAddress: BridgeResponseType.LatestAddress,
    getBalance: BridgeResponseType.Balance,
    reattach: BridgeResponseType.Reattached,
    backup: BridgeResponseType.BackupSuccessful,
    restoreBackup: BridgeResponseType.BackupRestored,
    send: BridgeResponseType.SentTransfer,
    setStrongholdPassword: BridgeResponseType.StrongholdPasswordSet,
    generateMnemonic: BridgeResponseType.GeneratedMnemonic,
    storeMnemonic: BridgeResponseType.StoredMnemonic,
    verifyMnemonic: BridgeResponseType.VerifiedMnemonic,
    setStoragePassword: BridgeResponseType.StoragePasswordSet,
    getStrongholdStatus: BridgeResponseType.StrongholdStatus,
    getUnusedAddress: BridgeResponseType.UnusedAddress,
    isLatestAddressUnused: BridgeResponseType.IsLatestAddressUnused,
    areLatestAddressesUnused: BridgeResponseType.AreAllLatestAddressesUnused,
    setAlias: BridgeResponseType.UpdatedAlias,
    deleteStorage: BridgeResponseType.DeletedStorage,
    lockStronghold: BridgeResponseType.LockedStronghold,
    changeStrongholdPassword: BridgeResponseType.StrongholdPasswordChanged,
    getLedgerDeviceStatus: BridgeResponseType.LedgerStatus,
    setStrongholdPasswordClearInterval: BridgeResponseType.StrongholdPasswordClearIntervalSet,
    getLegacySeedChecksum: BridgeResponseType.LegacySeedChecksum,
    getNodeInfo: BridgeResponseType.NodeInfo,
    mineBundle: BridgeResponseType.MinedBundle,
    getLegacyAddressChecksum: BridgeResponseType.LegacyAddressChecksum,

    // Participation
    getParticipationOverview: BridgeResponseType.ParticipationOverview,
    getParticipationEvents: BridgeResponseType.EventsData,
    participate: BridgeResponseType.SentParticipation,
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
        onSuccess: (response: SetStrongholdPasswordResponse): void => {},
        onError: (error: ErrorMessage): void => {},
    },
    CreatedAccount: {
        onSuccess: (response: CreatedAccountResponse): void => {},
        onError: (error: ErrorMessage): void => {},
    },
    ReadAccounts: {
        onSuccess: (response: ReadAccountsResponse): void => {},
        onError: (error: ErrorMessage): void => {},
    },
    LatestAddress: {
        onSuccess: (response: LatestAddressResponse): void => {},
        onError: (error: ErrorMessage): void => {},
    },
    SyncedAccounts: {
        onSuccess: (response: SyncAccountsResponse): void => {},
        onError: (error: ErrorMessage): void => {},
    },
    BalanceChange: {
        onSuccess: (response: BridgeEvent<BalanceChangeEventPayload>): void => {},
    },
    NewTransaction: {
        onSuccess: (response: BridgeEvent<TransactionEventPayload>): void => {},
    },
    StrongholdPasswordClearIntervalSet: {
        onSuccess: (response: BridgeEvent<void>): void => {},
        onError: (error: ErrorMessage): void => {},
    },
}

const eventsApiResponseTypes = Object.values(eventsApiToResponseTypeMap)

/**
 * Response subscriber.
 * Receives messages from wallet.rs.
 */

WALLET.onMessage((message: BridgeResponses) => {
    if (message && message.id === undefined) {
        // There is no message id
        // Something lower level has thrown an error
        // We should stop processing at this point
        let messageData = JSON.stringify(message)
        if (messageData == '{}') {
            messageData = message.toString()
        }
        const newError = { type: BridgeErrorType.ClientError, message: messageData, time: Date.now() }
        logError(newError)
        return
    }

    const _deleteCallbackId = (_id: string) => {
        // Do not delete callback ids for events api methods
        if (!eventsApiResponseTypes.includes(message.type)) {
            delete callbacksStore[_id]
        }
    }

    const { isValid, payload } = new ValidatorService(Object.keys(callbacksStore)).performValidation(message)

    if (!isValid) {
        if (payload.type !== ValidationError.UnknownId) {
            const { id } = message
            const { onError } = callbacksStore[id]

            onError(handleError(payload.type, payload.error))
        } else {
            handleError(payload.type, payload.error)
        }
    } else {
        const { id } = message

        const { onSuccess, onError } = callbacksStore[id]

        if (message.type === BridgeResponseType.Error) {
            onError(handleError(message.payload.type, message.payload.error, message.action))
        } else if (message.type === BridgeResponseType.Panic) {
            onError(handleError(BridgeErrorType.Panic, message.payload))
        } else {
            onSuccess(message)
        }
    }

    // Delete callback id from callback store
    _deleteCallbackId(message.id)
})

/**
 * Keeps a reference to (optional) callbacks.
 *
 * If callbacks are not provided, the default callbacks will be used.
 *
 * Note: Callbacks are invoked when a response is received from wallet.rs actor
 *
 * @method storeCallbacks
 *
 * @param {string} __id
 * @param {function} onSuccess
 * @param {function} onError
 *
 * @returns {void}
 */
const storeCallbacks = (__id: string, type: BridgeResponseType, callbacks?: CallbacksPattern): void => {
    if (callbacks && typeof callbacks.onSuccess === 'function' && typeof callbacks.onError === 'function') {
        callbacksStore[__id] = callbacks
    } else {
        callbacksStore[__id] = defaultCallbacks[type]
    }
}

/**
 * Emits formatted error and adds to error log
 *
 * @method handleError
 *
 * @param {BridgeErrorType | ValidatorErrorTypes} type
 * @param {string} error
 */
const handleError = (
    type: BridgeErrorType | ValidationError,
    error: string,
    action?: string
): { type: BridgeErrorType | ValidationError; error: string } => {
    const newError = { type, message: error, time: Date.now() }

    const hasStatusCode403 = error.includes('Response error with status code 403')

    if (hasStatusCode403) {
        if (action && action.includes(NodePlugin.Participation)) {
            newError.message = `${NodePlugin.Participation} not available on your current node. Please try a different node and try again.`
            logError(newError)
        }
    } else {
        logError(newError)
    }

    // TODO: Add full type list to remove this temporary fix
    const _getError = () => {
        if (error.includes('Snapshot is too short to be valid') || error.includes('is this really a snapshot file?')) {
            return 'error.backup.invalid'
        }
        if (error.includes('try another password')) {
            return 'error.password.incorrect'
        }
        if (error.includes('message history and balance')) {
            return 'error.account.empty'
        }
        if (error.includes('No synced node')) {
            return 'error.node.noSynced'
        }
        if (error.includes('dns error')) {
            return 'error.node.dns'
        }
        if (error.includes('timed out')) {
            return 'error.node.timedOut'
        }
        if (error.includes('onnection refused')) {
            // the 'C' so it handles upper and lower case
            return 'error.node.refused'
        }
        if (error.includes('HandshakeFailure')) {
            return 'error.node.handshake'
        }
        if (error.includes('invalid certificate')) {
            return 'error.node.invalidCertificate'
        }
        if (error.includes('Failed to get an answer from all nodes')) {
            return 'error.node.answer'
        }
        if (error.includes('forbidden')) {
            return 'error.node.forbidden'
        }

        if (hasStatusCode403) {
            return 'error.node.pluginNotFound'
        }

        return getErrorMessage(type)
    }

    return {
        type,
        error: _getError(),
    }
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

const proxyApi = (activeProfileIdGetter: () => string): IWalletApi => {
    const _generateMiddleware = (activeProfileIdGetter: () => string) => ({
        get:
            (_target, prop) =>
            async (...payload): Promise<void> => {
                const actorId = activeProfileIdGetter()

                const messageId = generateRandomId()

                const hasPayload = payload.length

                let shouldOverrideDefaultCallbacks = false
                let lastArgument = null

                if (hasPayload) {
                    lastArgument = payload[payload.length - 1]

                    shouldOverrideDefaultCallbacks =
                        typeof lastArgument === 'object' && 'onSuccess' in lastArgument && 'onError' in lastArgument
                }

                storeCallbacks(
                    messageId,
                    apiToResponseTypeMap[prop],
                    shouldOverrideDefaultCallbacks ? lastArgument : undefined
                )

                const actualPayload = shouldOverrideDefaultCallbacks ? payload.slice(0, -1) : payload

                await _target[prop](...actualPayload)({ actorId, messageId })
            },
        set: () => false,
    })

    return new Proxy({ ...WALLET.api }, _generateMiddleware(activeProfileIdGetter))
}

// eslint-disable-next-line
export const WalletApi = proxyApi(Platform.getActiveProfile)
