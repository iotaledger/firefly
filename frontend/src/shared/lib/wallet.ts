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
import { account } from './typings';

const Wallet = window['__WALLET__'];

type Account = {
    id: string;
    alias: string;
    addresses: Address[];
    messages: Message[];
}

type WalletState = {
    accounts: Account[];
}

type CallbacksStore = {
    [id: string]: {
        onSuccess: (message: MessageResponse) => void;
        onError: (message: MessageResponse) => void;
    }
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
        },
        onError: (error: ErrorResponse): void => {
            console.info('Error syncing accounts', error);
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

    message.type === 'Error' ? onError(message) : onSuccess(message);

    delete callbacksStore[id];
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
    onSuccess?: () => any,
    onError?: () => any
): void => {
    if (typeof onSuccess === 'function' && typeof onError === 'function') {
        callbacksStore[__id] = {
            onSuccess,
            onError
        }
    } else {
        callbacksStore[__id] = defaultCallbacks[type];
    }
};

/**
 * Sets stronghold password
 * 
 * @method setStrongholdPassword
 * 
 * @param {string} password 
 * @param {function} onSuccess 
 * @param {function} onError 
 * 
 * @returns {Promise<void>}
 */
const setStrongholdPassword = async (
    password: string,
    onSuccess?: () => any,
    onError?: () => any
): Promise<void> => {
    const __id = generateRandomId();

    storeCallbacks(
        __id,
        ResponseTypes.StrongholdPasswordSet,
        onSuccess,
        onError
    );

    await Wallet.setStrongholdPassword(__id)(password);
};

/**
 * Creates a new account
 * 
 * @method createAccount
 * 
 * @param {string} alias
 * @param {ClientOptions} clientOptions
 * @param {function} onSuccess 
 * @param {function} onError 
 * 
 * @returns {Promise<void>}
 */
const createAccount = async (
    alias: string,
    clientOptions?: ClientOptions,
    onSuccess?: () => any,
    onError?: () => any
): Promise<void> => {
    const __id = generateRandomId();

    storeCallbacks(
        __id,
        ResponseTypes.CreatedAccount,
        onSuccess,
        onError
    );

    await Wallet.createAccount(__id)({ alias, clientOptions });
};

/**
 * Gets all accounts
 * 
 * @method getAccounts
 * 
 * @param {function} onSuccess 
 * @param {function} onError 
 * 
 * @returns {Promise<void>}
 */
const getAccounts = async (
    onSuccess?: () => any,
    onError?: () => any
): Promise<void> => {
    const __id = generateRandomId();

    storeCallbacks(
        __id,
        ResponseTypes.ReadAccounts,
        onSuccess,
        onError
    );

    await Wallet.getAccounts(__id)();
};

/**
 * Gets deposit address for an account
 * 
 * @method getDepositAddress
 * 
 * @param {string} accountId
 * @param {function} onSuccess 
 * @param {function} onError 
 * 
 * @returns {Promise<void>}
 */
const getDepositAddress = async (
    accountId: string,
    onSuccess?: () => any,
    onError?: () => any
): Promise<void> => {
    const __id = generateRandomId();

    storeCallbacks(
        __id,
        ResponseTypes.LatestAddress,
        onSuccess,
        onError
    );

    await Wallet.latestAddress(__id)(accountId);
};

/**
 * Gets total balance for an account
 * 
 * @method getTotalBalance
 * 
 * @param {string} accountId
 * @param {function} onSuccess 
 * @param {function} onError 
 * 
 * @returns {Promise<void>}
 */
const getTotalBalance = async (
    accountId: string,
    onSuccess?: () => any,
    onError?: () => any
): Promise<void> => {
    const __id = generateRandomId();

    storeCallbacks(
        __id,
        ResponseTypes.TotalBalance,
        onSuccess,
        onError
    );

    await Wallet.totalBalance(__id)(accountId);
};

/**
 * Syncs all stored accounts
 * 
 * @method syncAccounts
 * 
 * @param {function} onSuccess 
 * @param {function} onError 
 * 
 * @returns {Promise<void>}
 */
const syncAccounts = async (
    onSuccess?: () => any,
    onError?: () => any
): Promise<void> => {
    const __id = generateRandomId();

    storeCallbacks(
        __id,
        ResponseTypes.SyncedAccounts,
        onSuccess,
        onError
    );

    await Wallet.syncAccounts(__id)();
};

/**
 * Syncs account for provided id
 * 
 * @method syncAccount
 * 
 * @param {string} accountId
 * @param {function} onSuccess 
 * @param {function} onError 
 * 
 * @returns {Promise<void>}
 */
const syncAccount = async (
    accountId: string,
    onSuccess?: () => any,
    onError?: () => any
): Promise<void> => {
    const __id = generateRandomId();

    storeCallbacks(
        __id,
        ResponseTypes.SyncedAccounts,
        onSuccess,
        onError
    );

    await Wallet.syncAccount(__id)(accountId);
};

/**
 * setTimeout(() => {
    setStrongholdPassword('password');
    syncAccounts();
}, 2000);
 */
