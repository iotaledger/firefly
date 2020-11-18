import { writable } from 'svelte/store'
import type {
    MessageResponse,
    SetStrongholdPasswordResponse,
    CreatedAccountResponse,
    ReadAccountsResponse,
    LatestAddressResponse,
    TotalBalanceResponse,
    SyncAccountsResponse,
    ErrorResponse,
} from './typings/bridge'
import type { ClientOptions } from './typings/client'
import { ResponseTypes } from './typings/bridge';
import type {
    Address
} from './typings/address'
import type {
    Message
} from './typings/message';
import type { Event, BalanceChangeEventPayload, TransactionEventPayload } from './typings/events'

const Wallet = window['__WALLET__'];

type Account = {
    id: number[];
    alias: string;
    addresses: Address[];
    messages: Message[];
}

type WalletState = {
    accounts: Account[];
}

type CallbacksStore = {
    [id: string]: CallbacksPattern;
};

type CallbacksPattern = {
    onSuccess: (message: MessageResponse) => void;
    onError: (message: MessageResponse) => void;
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
    totalBalance: ResponseTypes.TotalBalance,
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
};

/*
* Wallet state
*/
export const wallet = writable<WalletState>({
    accounts: [] as Account[]
})

/**
 * A simple store for keeping references to (success, error) callbacks
 */
const callbacksStore: CallbacksStore = {};

/**
 * (Default) callbacks for wallet.rs methods. 
 * They can be overridden by the caller component. 
 */
const defaultCallbacks = {
    StrongholdPasswordSet: {
        onSuccess: (response: SetStrongholdPasswordResponse): void => {
            console.info('Stronghold password set successfully', response);
        },
        onError: (error: ErrorResponse): void => {
            console.info('Stronghold password set error', error);
        }
    },
    CreatedAccount: {
        onSuccess: (response: CreatedAccountResponse): void => {
            console.info('New account created!', response);

            wallet.update((_wallet) => Object.assign({}, _wallet, {
                accounts: [..._wallet.accounts, response.payload]
            }))
        },
        onError: (error: ErrorResponse): void => {
            console.info('New account creation error!', error);
        }
    },
    ReadAccounts: {
        onSuccess: (response: ReadAccountsResponse): void => {
            console.info('Accounts', response);
        },
        onError: (error: ErrorResponse): void => {
            console.info('Error reading accounts information', error);
        }
    },
    LatestAddress: {
        onSuccess: (response: LatestAddressResponse): void => {
            console.info('Latest address', response);
        },
        onError: (error: ErrorResponse): void => {
            console.info('Error reading latest address', error);
        }
    },
    TotalBalance: {
        onSuccess: (response: TotalBalanceResponse): void => {
            console.info('Total balance', response);
        },
        onError: (error: ErrorResponse): void => {
            console.info('Error reading total balance', error);
        }
    },
    SyncedAccounts: {
        onSuccess: (response: SyncAccountsResponse): void => {
            console.info('Synced accounts', response);
            wallet.update((_wallet) => {
                for (const synced of response.payload) {
                    // TODO this won't be necessary when the account id is serialized as a string
                    const accountId = JSON.stringify(synced.accountId)
                    const account = _wallet.accounts.find(acc => JSON.stringify(acc.id) === accountId)
                    account.addresses = [...account.addresses, ...synced.addresses]
                    account.messages = [...account.messages, ...synced.messages]
                }
                return _wallet
            })
        },
        onError: (error: ErrorResponse): void => {
            console.info('Error syncing accounts', error);
        }
    },
    BalanceChange: {
        onSuccess: (response: Event<BalanceChangeEventPayload>): void => {
            wallet.update((_wallet) => {
                // TODO this won't be necessary when the account id is serialized as a string
                const accountId = JSON.stringify(response.payload.accountId)
                const account = _wallet.accounts.find(acc => JSON.stringify(acc.id) === accountId)
                const address = account.addresses.find(addr => addr.address === response.payload.address.address)
                address.balance = response.payload.balance
                return _wallet
            })
        }
    },
    NewTransaction: {
        onSuccess: (response: Event<TransactionEventPayload>): void => {
        }
    }
};

wallet.subscribe((newState) => console.log('wallet: ', newState))

/**
 * @method generateRandomId
 * 
 * @returns {number}
 */
const generateRandomId = (): number => Math.floor(Math.random() * 99999999);

/**
 * Response subscriber.
 * Receives messages from wallet.rs.
 */
Wallet.onMessage((message: MessageResponse) => {
    const { id } = message;

    const { onSuccess, onError } = callbacksStore[id];

    message.type === 'Error' || message.type === 'Panic' ? onError(message) : onSuccess(message);

    const isEventMessage = [
        ResponseTypes.ErrorThrown,
        ResponseTypes.BalanceChange,
        ResponseTypes.NewTransaction,
        ResponseTypes.ConfirmationStateChange,
        ResponseTypes.Reattachment,
        ResponseTypes.Broadcast
    ].includes(message.type)

    if (!isEventMessage) {
        delete callbacksStore[id];
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
const storeCallbacks = (
    __id: number,
    type: ResponseTypes,
    callbacks?: CallbacksPattern
): void => {
    if (
        callbacks &&
        typeof callbacks.onSuccess === 'function' && typeof callbacks.onError === 'function'
    ) {
        callbacksStore[__id] = callbacks;
    } else {
        callbacksStore[__id] = defaultCallbacks[type];
    }
};

const Middleware = {
    get: (_target, prop) => {
        return async (...payload): Promise<void> => {
            const __id = generateRandomId();

            const hasPayload = payload.length;

            let shouldOverrideDefaultCallbacks = false;
            let lastArgument = null;

            if (hasPayload) {
                lastArgument = payload[payload.length - 1];

                shouldOverrideDefaultCallbacks = typeof lastArgument === 'object' &&
                    'onSuccess' in lastArgument &&
                    'onError' in lastArgument;
            }

            storeCallbacks(
                __id,
                apiToResponseTypeMap[prop],
                shouldOverrideDefaultCallbacks ? lastArgument : undefined
            );

            const actualPayload = shouldOverrideDefaultCallbacks ? payload.slice(0, -1) : payload;

            await _target[prop](...actualPayload)(__id);
        }
    }
}

export const api = new Proxy(Wallet.api, Middleware);

// setTimeout(async () => {
//     await api.setStrongholdPassword('password');
//     await api.createAccount({ alias: 'foo', clientOptions: { node: 'http://localhost:14265' } })
//     await api.syncAccounts();
// }, 2000);
