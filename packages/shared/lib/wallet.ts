import { writable } from 'svelte/store'
import type {
    MessageResponse,
    SetStrongholdPasswordResponse,
    CreatedAccountResponse,
    ReadAccountsResponse,
    LatestAddressResponse,
    SyncAccountsResponse,
    ErrorResponse,
} from './typings/bridge'
import { ResponseTypes } from './typings/bridge'
import type { Address } from './typings/address'
import type { Message } from './typings/message'
import type { Event, BalanceChangeEventPayload, TransactionEventPayload } from './typings/events'
import Validator, { ErrorTypes as ValidatorErrorTypes } from 'shared/lib/validator'
import { generateRandomId } from 'shared/lib/utils'
import { mnemonic, getActiveProfile } from 'shared/lib/app'
import { account, message } from './typings'

const Wallet = window['__WALLET__']

type Account = {
    id: string
    index: number;
    alias: string
    addresses: Address[]
    messages: Message[]
}

type WalletState = {
    accounts: Account[]
}

type CallbacksStore = {
    [id: string]: CallbacksPattern
}

type CallbacksPattern = {
    onSuccess: (message: MessageResponse) => void
    onError: (message: MessageResponse) => void
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
    onError: ResponseTypes.ErrorThrown,
    onBalanceChange: ResponseTypes.BalanceChange,
    onNewTransaction: ResponseTypes.NewTransaction,
    onConfirmationStateChange: ResponseTypes.ConfirmationStateChange,
    onReattachment: ResponseTypes.Reattachment,
    onBroadcast: ResponseTypes.Broadcast,
    onStrongholdStatusChange: ResponseTypes.StrongholdStatusChange,
    generateMnemonic: ResponseTypes.GeneratedMnemonic,
    storeMnemonic: ResponseTypes.StoredMnemonic,
    verifyMnemonic: ResponseTypes.VerifiedMnemonic,
    setStoragePassword: ResponseTypes.StoragePasswordSet,
    getStrongholdStatus: ResponseTypes.StrongholdStatus,
    getUnusedAddress: ResponseTypes.UnusedAddress,
    isLatestAddressUnused: ResponseTypes.IsLatestAddressUnused,
    areLatestAddressesUnused: ResponseTypes.AreAllLatestAddressesUnused
};

/*
 * Wallet state
 */
export const wallet = writable<WalletState>({
    accounts: [] as Account[],
})

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
        onError: (error: ErrorResponse): void => { },
    },
    CreatedAccount: {
        onSuccess: (response: CreatedAccountResponse): void => {
            wallet.update((_wallet) =>
                Object.assign({}, _wallet, {
                    accounts: [..._wallet.accounts, response.payload],
                })
            )
        },
        onError: (error: ErrorResponse): void => { },
    },
    ReadAccounts: {
        onSuccess: (response: ReadAccountsResponse): void => { },
        onError: (error: ErrorResponse): void => { },
    },
    LatestAddress: {
        onSuccess: (response: LatestAddressResponse): void => { },
        onError: (error: ErrorResponse): void => { },
    },
    SyncedAccounts: {
        onSuccess: (response: SyncAccountsResponse): void => {
            wallet.update((_wallet) => {
                for (const synced of response.payload) {
                    // TODO this won't be necessary when the account id is serialized as a string
                    const accountId = JSON.stringify(synced.accountId)
                    const account = _wallet.accounts.find((acc) => JSON.stringify(acc.id) === accountId)
                    account.addresses = [...account.addresses, ...synced.addresses]
                    account.messages = [...account.messages, ...synced.messages]
                }
                return _wallet
            })
        },
        onError: (error: ErrorResponse): void => { },
    },
    BalanceChange: {
        onSuccess: (response: Event<BalanceChangeEventPayload>): void => {
            wallet.update((_wallet) => {
                // TODO this won't be necessary when the account id is serialized as a string
                const accountId = JSON.stringify(response.payload.accountId)
                const account = _wallet.accounts.find((acc) => JSON.stringify(acc.id) === accountId)
                const address = account.addresses.find((addr) => addr.address === response.payload.address.address)
                address.balance = response.payload.balance
                return _wallet
            })
        },
    },
    NewTransaction: {
        onSuccess: (response: Event<TransactionEventPayload>): void => { }
    },
};

/**
 * Response subscriber.
 * Receives messages from wallet.rs.
 */
Wallet.onMessage((message: MessageResponse) => {
    const _deleteCallbackId = (_id: string) => {
        const isEventMessage = [
            ResponseTypes.ErrorThrown,
            ResponseTypes.BalanceChange,
            ResponseTypes.NewTransaction,
            ResponseTypes.ConfirmationStateChange,
            ResponseTypes.Reattachment,
            ResponseTypes.Broadcast,
        ].includes(message.type)

        if (!isEventMessage) {
            delete callbacksStore[_id]
        }
    }

    const { isValid, error } = new Validator(Object.keys(callbacksStore)).performValidation(message);

    if (!isValid) {
        if (error.type !== ValidatorErrorTypes.UnknownId) {
            const { id } = message
            const { onError } = callbacksStore[id]

            onError(message)

            _deleteCallbackId(id)
        } else {
            /** TODO: In case of unknown ids, add validation failure to error log */
        }
    } else {
        const { id } = message

        const { onSuccess, onError } = callbacksStore[id]

        message.type === 'Error' || message.type === 'Panic' ? onError(message) : onSuccess(message)
    }
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

const Middleware = {
    get: (_target, prop) => {
        return async (...payload): Promise<void> => {
            const actorId = getActiveProfile().id;

            const messageId = generateRandomId();

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
}

export const api = new Proxy(Wallet.api, Middleware)

export const initialise = Wallet.init;

/**
 * Generate BIP39 Mnemonic Recovery Phrase
 */
export const generateRecoveryPhrase = (): Promise<string[]> => new Promise((resolve, reject) => {
    api.generateMnemonic({
        onSuccess(response) { resolve(response.payload.split(' ')) },
        onError(error) { reject(error) }
    })
})

export const verifyRecoveryPhrase = (phrase): Promise<void> => new Promise((resolve, reject) => {
    api.verifyMnemonic(phrase, {
        onSuccess(response) {
            resolve(response)
        },
        onError(error) { reject(error) }
    })
})

export const requestMnemonic = async () => {
    let recoveryPhrase = await generateRecoveryPhrase()
    mnemonic.set(recoveryPhrase)
}

Wallet.api.onStrongholdStatusChange({
    onSuccess(response) {
        console.log(response)
    },
    onError(error) {
        console.error(error)
    }
})

/**
 * Gets latest messages
 * 
 * @method getLatestMessages
 * 
 * @param {Account} accounts 
 * @param {number} [count] 
 * 
 * @returns {Message[]}
 */
export const getLatestMessages = (
    accounts: Account[],
    count = 10
): Message[] => {    
    const messages: Message[] = accounts.reduce((messages, account) => messages.concat(
        account.messages.map((message, idx) => Object.assign({}, message, {
            account: account.index,
            internal: idx % 2 !== 0
        })
        )
    ), []);

    return messages.slice().sort((a, b) => {
        return <any>new Date(b.timestamp) - <any>new Date(a.timestamp);
    }).slice(0, count);
};
