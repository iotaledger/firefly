import { writable, Writable, get } from 'svelte/store'
import type {
    MessageResponse,
    SetStrongholdPasswordResponse,
    CreatedAccountResponse,
    ReadAccountsResponse,
    LatestAddressResponse,
    SyncAccountsResponse,
    ErrorResponse,
    Actor,
    StrongholdStatusResponse,
} from './typings/bridge'
import { ResponseTypes } from './typings/bridge'
import type { Address } from './typings/address'
import type { Message } from './typings/message'
import type { Event, BalanceChangeEventPayload, TransactionEventPayload, ConfirmationStateChangeEventPayload } from './typings/events'
import Validator, { ErrorTypes as ValidatorErrorTypes } from 'shared/lib/validator'
import { generateRandomId } from 'shared/lib/utils'
import { mnemonic, getActiveProfile, updateStrongholdStatus } from 'shared/lib/app'
import { account, message } from './typings'
import { persistent } from './helpers'
import { _ } from 'shared/lib/i18n'
import { notifications } from 'shared/lib/settings'


const Wallet = window['__WALLET__']

export const WALLET_STORAGE_DIRECTORY = '__storage__'

type Account = {
    id: string
    index: number;
    alias: string
    addresses: Address[]
    messages: Message[],
}

interface ActorState {
    [id: string]: Actor
}

export type BalanceOverview = {
    incoming: string;
    incomingRaw: number;
    outgoing: string;
    outgoingRaw: number;
    balance: string;
    balanceRaw: number;
    balanceFiat: string;
}

type WalletState = {
    balanceOverview: Writable<BalanceOverview>;
    accounts: Writable<Account[]>
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
    areLatestAddressesUnused: ResponseTypes.AreAllLatestAddressesUnused,
    setAlias: ResponseTypes.UpdatedAlias,
    removeStorage: ResponseTypes.DeletedStorage,
    lockStronghold: ResponseTypes.LockedStronghold,
    changeStrongholdPassword: ResponseTypes.StrongholdPasswordChanged
};

/** Active actors state */
const actors: ActorState = {};

/*
 * Wallet state
 */
export const wallet = writable<WalletState>({
    balanceOverview: writable<BalanceOverview>({
        incoming: '0 Mi',
        incomingRaw: 0,
        outgoing: '0 Mi',
        outgoingRaw: 0,
        balance: '0 Mi',
        balanceRaw: 0,
        balanceFiat: '0.00 USD'
    }),
    accounts: writable<Account[]>([])
})

export const selectedAccountId = writable<string | null>(null)

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
        onSuccess: (response: CreatedAccountResponse): void => { },
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
        onSuccess: (response: SyncAccountsResponse): void => { },
        onError: (error: ErrorResponse): void => { },
    },
    BalanceChange: {
        onSuccess: (response: Event<BalanceChangeEventPayload>): void => { },
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

export const getStoragePath = (appPath: string, profileName: string): string => {
    return `${appPath}/${WALLET_STORAGE_DIRECTORY}/${profileName}`;
}

export const initialise = (id: string, storagePath: string): void => {
    const actor: Actor = Wallet.init(id, storagePath);

    actors[id] = actor;
}

/**
 * Destroys an actor & remove it from actors state
 * 
 * @method destroyActor
 * 
 * @param {string} id
 * 
 * @returns {void} 
 */
export const destroyActor = (id: string): void => {
    if (!actors[id]) {
        throw new Error('No actor found for provided id.')
    }

    // Destroy actor
    actors[id].destroy();

    // Delete actor id from state
    delete actors[id];
};

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

/**
 * Initialises event listeners from wallet library
 * 
 * @method initialiseListeners
 * 
 * @returns {void}
 */
export const initialiseListeners = () => {
    /**
     * Event listener for stronghold status change
     */
    api.onStrongholdStatusChange({
        onSuccess(response) {
            updateStrongholdStatus(response.payload.snapshot.status === 'Locked')
        },
        onError(error) { console.error(error) }
    })

    /**
    * Event listener for new message event
    */
    api.onNewTransaction({
        onSuccess(response: Event<TransactionEventPayload>) {
            if (get(notifications)) {
                const accounts = get(wallet).accounts
                const account = accounts.find(account => account.id === response.payload.accountId)
                const message = response.payload.message

                const locale = get(_) as (string) => string
                const notificationMessage = locale('notifications.valueTx')
                    .replace('{{value}}', message.value.toString())
                    .replace('{{account}}', account.alias)
                const NotificationManager = window['Electron']['NotificationManager']
                NotificationManager.notify(notificationMessage)
            }
        },
        onError(error) {
            console.error(error)
        }
    })

    api.onConfirmationStateChange({
        onSuccess(response: Event<ConfirmationStateChangeEventPayload>) {
            if (get(notifications)) {
                const accounts = get(wallet).accounts
                const account = accounts.find(account => account.id === response.payload.accountId)
                const message = response.payload.message
                const messageKey = response.payload.confirmed ? 'confirmed' : 'failed'

                const locale = get(_) as (string) => string
                const notificationMessage = locale(`notifications.${messageKey}`)
                    .replace('{{value}}', message.value.toString())
                    .replace('{{account}}', account.alias)
                const NotificationManager = window['Electron']['NotificationManager']
                NotificationManager.notify(notificationMessage)
            }
        },
        onError(error) {
            console.error(error)
        }
    })

    /**
    * Event listener for balance change event
    */
    api.onBalanceChange({
        onSuccess(response) { console.log('Balance change response', response) },
        onError(error) { console.error(error) }
    })
};




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
