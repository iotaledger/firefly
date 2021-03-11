import Validator, { ErrorTypes as ValidatorErrorTypes } from 'shared/lib/validator'
import * as Wallet from 'wallet-nodejs-binding'
import { errorLog, getErrorMessage } from './events'
import type { Account, AccountToCreate, Balance, SyncedAccount } from './typings/account'
import type { Address } from './typings/address'
import type {
    CreatedAccountResponse,
    LatestAddressResponse, MessageResponse,
    ReadAccountsResponse, SetStrongholdPasswordResponse,
    SyncAccountsResponse
} from './typings/bridge'
import { ResponseTypes } from './typings/bridge'
import type { ClientOptions } from './typings/client'
import type { BalanceChangeEventPayload, ConfirmationStateChangeEventPayload, ErrorEventPayload, Event, TransactionEventPayload, TransferProgressEventPayload } from './typings/events'
import { ErrorType } from './typings/events'
import type { Message } from './typings/message'
import type { StrongholdStatus } from './typings/wallet'

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
    if (message && message.id === undefined) {
        // There is no message id
        // Something lower level has thrown an error
        // We should stop processing at this point
        errorLog.update((log) => [ { type: ErrorType.ClientError, message: JSON.stringify(message), time: Date.now() }, ...log ])
        return
    }

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
                handleError(
                    payload.type,
                    payload.error
                )
            )
        } else {
            handleError(
                payload.type,
                payload.error
            )
        }
    } else {
        const { id } = message

        const { onSuccess, onError } = callbacksStore[id]

        if (message.type === ResponseTypes.Error) {
            onError(
                handleError(
                    message.payload.type,
                    message.payload.error
                )
            )
        } else if (message.type === ResponseTypes.Panic) {
            onError(
                    handleError(
                    ErrorType.Panic,
                    message.payload
                )
            )
        }
        else {
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
const storeCallbacks = (__id: string, type: ResponseTypes, callbacks?: CallbacksPattern): void => {
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
 * @param {ErrorType | ValidatorErrorTypes} type
 * @param {string} error
 */
const handleError = (type: ErrorType | ValidatorErrorTypes, error: string): { type: ErrorType | ValidatorErrorTypes, error: string } => {
    errorLog.update((log) => [ { type, message: error, time: Date.now() }, ...log ])

    // TODO: Add full type list to remove this temporary fix
    const _getError = () => {
        if (error.includes('try another password')) {
            return ('error.password.incorrect')
        }
        if (error.includes('message history and balance')) {
            return ('error.account.empty')
        }

        return getErrorMessage(type)
    }


    return {
        type,
        error: _getError()
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

export interface ApiClient {
    generateMnemonic(callbacks: { onSuccess: (response: Event<string>) => void, onError: (err: ErrorEventPayload) => void })
    storeMnemonic(mnemonic: string, callbacks: { onSuccess: (response: Event<string>) => void, onError: (err: ErrorEventPayload) => void })
    verifyMnemonic(mnemonic: string, callbacks: { onSuccess: (response: Event<string>) => void, onError: (err: ErrorEventPayload) => void })
    getAccounts(callbacks: { onSuccess: (response: Event<Account[]>) => void, onError: (err: ErrorEventPayload) => void })
    getBalance(accountId: string, callbacks: { onSuccess: (response: Event<Balance>) => void, onError: (err: ErrorEventPayload) => void })
    latestAddress(accountId: string, callbacks: { onSuccess: (response: Event<Address>) => void, onError: (err: ErrorEventPayload) => void })
    areLatestAddressesUnused(callbacks: { onSuccess: (response: Event<boolean>) => void, onError: (err: ErrorEventPayload) => void })
    getUnusedAddress(accountId: string, callbacks: { onSuccess: (response: Event<Address>) => void, onError: (err: ErrorEventPayload) => void })
    getStrongholdStatus(callbacks: { onSuccess: (response: Event<StrongholdStatus>) => void, onError: (err: ErrorEventPayload) => void })
    syncAccounts(callbacks: { onSuccess: (response: Event<SyncedAccount[]>) => void, onError: (err: ErrorEventPayload) => void })
    syncAccount(accountId: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    createAccount(account: AccountToCreate, callbacks: { onSuccess: (response: Event<Account>) => void, onError: (err: ErrorEventPayload) => void })
    send(accountId: string, transfer: {
        amount: number,
        address: string,
        remainder_value_strategy: {
            strategy: string,
        },
        indexation: { index: string, data: number[] },
    }, callbacks: { onSuccess: (response: Event<Message>) => void, onError: (err: ErrorEventPayload) => void })
    internalTransfer(fromId: string, toId: string, amount: number, callbacks: { onSuccess: (response: Event<Message>) => void, onError: (err: ErrorEventPayload) => void })
    setAlias(accountId: string, alias: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    lockStronghold(callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    setStrongholdPassword(password: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    changeStrongholdPassword(currentPassword: string, newPassword: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    backup(strongholdPath: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    restoreBackup(strongholdPath: string, password: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    removeAccount(accountId: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    setStoragePassword(newPinCode: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    removeStorage(callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    setClientOptions(clientOptions: ClientOptions, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })

    onStrongholdStatusChange(callbacks: { onSuccess: (response: Event<StrongholdStatus>) => void, onError: (err: ErrorEventPayload) => void })
    onNewTransaction(callbacks: { onSuccess: (response: Event<TransactionEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
    onConfirmationStateChange(callbacks: { onSuccess: (response: Event<ConfirmationStateChangeEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
    onBalanceChange(callbacks: { onSuccess: (response: Event<BalanceChangeEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
    onTransferProgress(callbacks: { onSuccess: (response: Event<TransferProgressEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
}
