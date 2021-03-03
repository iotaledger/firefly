import type {
    MessageResponse,
    SetStrongholdPasswordResponse,
    CreatedAccountResponse,
    ReadAccountsResponse,
    LatestAddressResponse,
    SyncAccountsResponse,
} from './typings/bridge'
import { ResponseTypes } from './typings/bridge'
import type { ErrorType, Event, BalanceChangeEventPayload, TransactionEventPayload } from './typings/events'
import Validator, { ErrorTypes as ValidatorErrorTypes } from 'shared/lib/validator'

import * as Wallet from 'wallet-nodejs-binding'

type CallbacksStore = {
    [id: string]: CallbacksPattern
}

type CallbacksPattern = {
    onSuccess: (message: MessageResponse) => void
    onError: (message: ErrorMessage) => void
}

type ErrorMessage = {
    type: ErrorType | ValidatorErrorTypes,
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
}

const apiToResponseTypeMap = {
    removeAccount: ResponseTypes.RemovedAccount,
    createAccount: ResponseTypes.CreatedAccount,
    getAccount: ResponseTypes.ReadAccount,
    getAccounts: ResponseTypes.ReadAccounts,
    syncAccounts: ResponseTypes.SyncedAccounts,
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
    removeStorage: ResponseTypes.DeletedStorage,
    lockStronghold: ResponseTypes.LockedStronghold,
    changeStrongholdPassword: ResponseTypes.StrongholdPasswordChanged,
    ...eventsApiToResponseTypeMap
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
        onSuccess: (response: SetStrongholdPasswordResponse): void => { },
        onError: (error: ErrorMessage): void => { },
    },
    CreatedAccount: {
        onSuccess: (response: CreatedAccountResponse): void => { },
        onError: (error: ErrorMessage): void => { },
    },
    ReadAccounts: {
        onSuccess: (response: ReadAccountsResponse): void => { },
        onError: (error: ErrorMessage): void => { },
    },
    LatestAddress: {
        onSuccess: (response: LatestAddressResponse): void => { },
        onError: (error: ErrorMessage): void => { },
    },
    SyncedAccounts: {
        onSuccess: (response: SyncAccountsResponse): void => { },
        onError: (error: ErrorMessage): void => { },
    },
    BalanceChange: {
        onSuccess: (response: Event<BalanceChangeEventPayload>): void => { },
    },
    NewTransaction: {
        onSuccess: (response: Event<TransactionEventPayload>): void => { },
    },
}

const eventsApiResponseTypes = Object.values(eventsApiToResponseTypeMap)

/**
 * Response subscriber.
 * Receives messages from wallet.rs.
 */
Wallet.onMessage((message: MessageResponse) => {
    const _deleteCallbackId = (_id: string) => {
        // Do not delete callback ids for events api methods
        if (!eventsApiResponseTypes.includes(message.type)) {
            delete callbacksStore[_id]
        }
    }

    const { isValid, payload } = new Validator(Object.keys(callbacksStore)).performValidation(message)

    if (!isValid) {
        if (payload.type !== ValidatorErrorTypes.UnknownId) {
            const { id } = message
            const { onError } = callbacksStore[id]

            onError(
                createErrorMessage(
                    payload.type,
                    payload.error
                )
            )
        } else {
            /** TODO: In case of unknown ids, add validation failure to error log */
        }
    } else {
        const { id } = message

        const { onSuccess, onError } = callbacksStore[id]

        message.type === ResponseTypes.Error || message.type === ResponseTypes.Panic ? onError(
            createErrorMessage(
                message.payload.type,
                message.payload.error
            )
        ) : onSuccess(message)
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
const storeCallbacks = (__id: string, type: ResponseTypes, callbacks?: CallbacksPattern): void => {
    if (callbacks && typeof callbacks.onSuccess === 'function' && typeof callbacks.onError === 'function') {
        callbacksStore[__id] = callbacks
    } else {
        callbacksStore[__id] = defaultCallbacks[type]
    }
}

/**
 * Creates error message 
 * 
 * @method createErrorMessage
 * 
 * @param {ErrorType | ValidatorErrorTypes} type
 * @param {string} error
 */
const createErrorMessage = (type: ErrorType | ValidatorErrorTypes, error: string): { type: ErrorType | ValidatorErrorTypes, error: string } => {
    return {
        type,
        error
    }
};

/**
 * @method generateRandomId
 *
 * @returns {string}
 */
const generateRandomId = (): string => {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => {
        return ('0' + (byte & 0xff).toString(16)).slice(-2)
    }).join('')
}

const GenerateMiddleware = (activeProfileIdGetter: () => string) => ({
    get: (_target, prop) => {
        return async (...payload): Promise<void> => {
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

            storeCallbacks(messageId, apiToResponseTypeMap[prop], shouldOverrideDefaultCallbacks ? lastArgument : undefined)

            const actualPayload = shouldOverrideDefaultCallbacks ? payload.slice(0, -1) : payload

            await _target[prop](...actualPayload)({ actorId, messageId })
        }
    },
    set: () => {
        return false
    },
})

export function proxyApi(activeProfileIdGetter: () => string) {
    return new Proxy(Wallet.api, GenerateMiddleware(activeProfileIdGetter))
}
