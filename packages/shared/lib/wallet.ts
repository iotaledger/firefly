import { mnemonic } from 'shared/lib/app'
import { convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
import { localize } from 'shared/lib/i18n'
import type { HistoryData, PriceData } from 'shared/lib/marketData'
import { HistoryDataProps } from 'shared/lib/marketData'
import { showAppNotification, showSystemNotification } from 'shared/lib/notifications'
import { activeProfile, isStrongholdLocked } from 'shared/lib/profile'
import type { Account, Account as BaseAccount, SyncedAccount } from 'shared/lib/typings/account'
import type { Address } from 'shared/lib/typings/address'
import type { Actor } from 'shared/lib/typings/bridge'
import type { ErrorEventPayload, TransferProgressEventType } from 'shared/lib/typings/events'
import type { Message } from 'shared/lib/typings/message'
import { formatUnit } from 'shared/lib/units'
import type { ApiClient } from 'shared/lib/walletApi'
import { get, writable, Writable } from 'svelte/store'

const ACCOUNT_COLORS = ['turquoise', 'green', 'orange', 'yellow', 'purple', 'pink']

export const MAX_PROFILE_NAME_LENGTH = 20

export const MAX_ACCOUNT_NAME_LENGTH = 20

export const MAX_PASSWORD_LENGTH = 256

// Setting to 0 removes auto lock. We must lock Stronghold manually.
export const STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS = 0

export const WALLET_STORAGE_DIRECTORY = '__storage__'

export interface WalletAccount extends Account {
    depositAddress: string;
    rawIotaBalance: number;
    balance: string;
    balanceEquiv: string;
    color: string;
}

export interface AccountMessage extends Message {
    account: number;
    internal: boolean;
}

interface ActorState {
    [id: string]: Actor
}

export type BalanceOverview = {
    incoming: string
    incomingRaw: number
    outgoing: string
    outgoingRaw: number
    balance: string
    balanceRaw: number
    balanceFiat: string
}

type WalletState = {
    balanceOverview: Writable<BalanceOverview>
    accounts: Writable<WalletAccount[]>
    accountsLoaded: Writable<boolean>
}

type BalanceTimestamp = {
    timestamp: number,
    balance: number
}

export type BalanceHistory = {
    [HistoryDataProps.ONE_HOUR]: BalanceTimestamp[]
    [HistoryDataProps.SEVEN_DAYS]: BalanceTimestamp[]
    [HistoryDataProps.TWENTY_FOUR_HOURS]: BalanceTimestamp[]
    [HistoryDataProps.ONE_MONTH]: BalanceTimestamp[]
}

/** Active actors state */
const actors: ActorState = {}

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
        balanceFiat: '0.00 USD',
    }),
    accounts: writable<WalletAccount[]>([]),
    accountsLoaded: writable<boolean>(false),
})

export const resetWallet = () => {
    const { balanceOverview, accounts, accountsLoaded } = get(wallet)
    balanceOverview.set({
        incoming: '0 Mi',
        incomingRaw: 0,
        outgoing: '0 Mi',
        outgoingRaw: 0,
        balance: '0 Mi',
        balanceRaw: 0,
        balanceFiat: '0.00 USD',
    })
    accounts.set([])
    accountsLoaded.set(false)
    selectedAccountId.set(null)
    selectedMessage.set(null)
    isTransferring.set(false)
    transferState.set(null)
    isSyncing.set(null)
}

export const selectedAccountId = writable<string | null>(null)

export const selectedMessage = writable<Message | null>(null)

export const isTransferring = writable<boolean>(false)
export const transferState = writable<TransferProgressEventType | "Complete" | null>(null)

export const isSyncing = writable<boolean>(false)

export const api: ApiClient = window['__WALLET_API__']

export const getStoragePath = (appPath: string, profileName: string): string => {
    return `${appPath}/${WALLET_STORAGE_DIRECTORY}/${profileName}`
}

export const initialise = (id: string, storagePath: string): void => {
    const actor: Actor = window['__WALLET_INIT__'].run(id, storagePath)

    actors[id] = actor
}

/**
 * Removes event listeners for active actor
 * 
 * @method removeEventListeners
 * 
 * @param {string} id 
 * 
 * @returns {void}
 */
export const removeEventListeners = (id: string): void => {
    actors[id].removeEventListeners()
};

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
    actors[id].destroy()

    // Delete actor id from state
    delete actors[id]
}

/**
 * Generate BIP39 Mnemonic Recovery Phrase
 */
export const generateRecoveryPhrase = (): Promise<string[]> =>
    new Promise((resolve, reject) => {
        api.generateMnemonic({
            onSuccess(response) {
                resolve(response.payload.split(' '))
            },
            onError(error) {
                reject(error)
            },
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
            isStrongholdLocked.set(response.payload.snapshot.status === 'Locked')
        },
        onError(error) {
            console.error(error)
        },
    })

    /**
     * Event listener for new message event
     */
    api.onNewTransaction({
        onSuccess(response) {
            const accounts = get(wallet).accounts
            const account = get(accounts).find((account) => account.id === response.payload.accountId)
            const message = response.payload.message

            const essence = message.payload.data.essence

            if (!get(isSyncing)) {
                if (!essence.data.internal) {
                    const { balanceOverview } = get(wallet);
                    const overview = get(balanceOverview);

                    const incoming = essence.data.incoming ? overview.incomingRaw + essence.data.value : overview.incomingRaw;
                    const outgoing = essence.data.incoming ? overview.outgoingRaw : overview.outgoingRaw + essence.data.value;

                    updateBalanceOverview(
                        overview.balanceRaw,
                        incoming,
                        outgoing
                    );
                }

                // Update account with new message
                saveNewMessage(response.payload.accountId, response.payload.message);
            }

            const notificationMessage = localize('notifications.valueTx')
                .replace('{{value}}', formatUnit(message.payload.data.essence.data.value))
                .replace('{{account}}', account.alias)

            showSystemNotification({ type: "info", message: notificationMessage })
        },
        onError(error) {
            console.error(error)
        },
    })

    /**
     * Event listener for transfer confirmation state change
     */
    api.onConfirmationStateChange({
        onSuccess(response) {
            const accounts = get(wallet).accounts
            const account = get(accounts).find((account) => account.id === response.payload.accountId)
            const message = response.payload.message
            const messageKey = response.payload.confirmed ? 'confirmed' : 'failed'

            const essence = message.payload.data.essence

            if (!get(isSyncing)) {
                if (response.payload.confirmed && !essence.data.internal) {
                    const { balanceOverview } = get(wallet);
                    const overview = get(balanceOverview);

                    const incoming = essence.data.incoming ? overview.incomingRaw + essence.data.value : overview.incomingRaw;
                    const outgoing = essence.data.incoming ? overview.outgoingRaw : overview.outgoingRaw + essence.data.value;

                    updateBalanceOverview(
                        overview.balanceRaw,
                        incoming,
                        outgoing
                    );
                }

                const accountMessage = account.messages.find((_message) => _message.id === message.id)
                accountMessage.confirmed = response.payload.confirmed
                accounts.update((storedAccounts) => {
                    return storedAccounts.map((storedAccount) => {
                        if (storedAccount.id === account.id) {
                            return Object.assign<WalletAccount, Partial<WalletAccount>, Partial<WalletAccount>>({} as WalletAccount, storedAccount, {
                                messages: storedAccount.messages.map((_message: Message) => {
                                    if (_message.id === message.id) {
                                        return Object.assign<Message, Partial<Message>, Partial<Message>>(
                                            {} as Message,
                                            _message,
                                            { confirmed: response.payload.confirmed }
                                        )
                                    }
                                    return _message
                                })
                            })
                        }
                        return storedAccount
                    })
                })
            }

            const notificationMessage = localize(`notifications.${messageKey}`)
                .replace('{{value}}', formatUnit(message.payload.data.essence.data.value))
                .replace('{{account}}', account.alias)

            showSystemNotification({ type: "info", message: notificationMessage })
        },
        onError(error) {
            console.error(error)
        },
    })

    /**
     * Event listener for balance change event
     */
    api.onBalanceChange({
        onSuccess(response) {
            if (!get(isSyncing)) {
                const { payload: { accountId, address, balanceChange } } = response;

                updateAccountAfterBalanceChange(accountId, address, balanceChange.received, balanceChange.spent)
    
                const { balanceOverview } = get(wallet);
                const overview = get(balanceOverview);
    
                const balance = overview.balanceRaw - balanceChange.spent + balanceChange.received
    
                updateBalanceOverview(balance, overview.incomingRaw, overview.outgoingRaw);
            }
        },
        onError(error) {
            console.error(error)
        },
    })

    /**
     * Event listener for reattachment
     */
    api.onReattachment({
        onSuccess(response) {
            // Replace original message with reattachment
            replaceMessage(response.payload.accountId, response.payload.reattachedMessageId, response.payload.message);
        },
        onError(error) {
            console.error(error)
        },
    })

    /**
     * Event listener for transfer progress
     */
    api.onTransferProgress({
        onSuccess(response) {
            transferState.set(response.payload.event.type)
        },
        onError(error) {
            console.error(error)
        }
    })
}

/**
 * Updates account information after balance change
 * 
 * @method updateAccountAfterBalanceChange
 * 
 * @param {string} accountId 
 * @param {Address} addressMeta 
 */
export const updateAccountAfterBalanceChange = (
    accountId: string,
    address: Address,
    receivedBalance: number,
    spentBalance: number
): void => {
    const { accounts } = get(wallet);

    accounts.update((storedAccounts) => {
        return storedAccounts.map((storedAccount) => {
            if (storedAccount.id === accountId) {
                const rawIotaBalance = storedAccount.rawIotaBalance - spentBalance + receivedBalance;

                const activeCurrency = get(activeProfile)?.settings.currency ?? CurrencyTypes.USD;

                return Object.assign<WalletAccount, Partial<WalletAccount>, Partial<WalletAccount>>({} as WalletAccount, storedAccount, {
                    rawIotaBalance,
                    balance: formatUnit(rawIotaBalance, 2),
                    balanceEquiv: `${convertToFiat(
                        rawIotaBalance,
                        get(currencies)[CurrencyTypes.USD],
                        get(exchangeRates)[activeCurrency]
                    )} ${activeCurrency}`,
                    addresses: storedAccount.addresses.map((_address: Address) => {
                        if (_address.address === address.address) {
                            return Object.assign<Address, Partial<Address>, Partial<Address>>({} as Address, _address, address)
                        }

                        return _address
                    })
                })
            }

            return storedAccount;
        })
    })
}

/** 
 * @method saveNewMessage
 * 
 * @param {string} accountId 
 * @param {Message} message
 * 
 * @returns {void} 
 */
export const saveNewMessage = (accountId: string, message: Message): void => {
    const { accounts } = get(wallet)

    accounts.update((storedAccounts) => {
        return storedAccounts.map((storedAccount: WalletAccount) => {
            if (storedAccount.id === accountId) {
                return Object.assign<WalletAccount, Partial<WalletAccount>, Partial<WalletAccount>>({} as WalletAccount, storedAccount, {
                    messages: [message, ...storedAccount.messages]
                })
            }

            return storedAccount;
        })
    })
};

/** 
 * @method replaceMessage
 * 
 * @param {string} accountId 
 * @param {string} messageId
 * @param {Message} newMessage
 * 
 * @returns {void} 
 */
export const replaceMessage = (accountId: string, messageId: string, newMessage: Message): void => {
    const { accounts } = get(wallet)

    accounts.update((storedAccounts) => {
        return storedAccounts.map((storedAccount: WalletAccount) => {
            if (storedAccount.id === accountId) {
                return Object.assign<WalletAccount, Partial<WalletAccount>, Partial<WalletAccount>>({} as WalletAccount, storedAccount, {
                    messages: storedAccount.messages.map((_message) => {
                        if (_message.id === messageId) {
                            return newMessage;
                        }

                        return _message;
                    })
                })
            }

            return storedAccount;
        })
    })
};

/**
 * Gets latest messages
 *
 * @method getLatestMessages
 *
 * @param {WalletAccount} accounts
 * @param {number} [count]
 *
 * @returns {AccountMessage[]}
 */
export const getLatestMessages = (accounts: WalletAccount[], count = 10): AccountMessage[] => {
    const messages: {
        [key: string]: AccountMessage
    } = {};

    const addresses: string[] = [];

    accounts.forEach((account) => {
        account.addresses.forEach((address: Address) => {
            addresses.push(address.address);
        })

        account.messages.forEach((message) => {

            if (message.id in messages) {
                const existingMessage = messages[message.id];

                // If a copy of the message exists, only override it if the new message is confirmed and the existing one is unconfirmed
                // Imagine an internal transfer (between accounts). 
                // If the first account already updates the confirmation state as confirmed, there is a chance that the user might see the confirmation state
                // changing from confirmed to unconfirmed. To avoid that, we always give preference to the message that's already confirmed. 
                if (!existingMessage.confirmed && message.confirmed) {
                    messages[message.id] = Object.assign<
                        AccountMessage,
                        Message,
                        Partial<AccountMessage>
                    >(
                        {} as AccountMessage,
                        message,
                        { account: account.index });
                }
            } else {
                messages[message.id] = Object.assign<
                    AccountMessage,
                    Message,
                    Partial<AccountMessage>
                >(
                    {} as AccountMessage,
                    message,
                    { account: account.index });
            }
        })
    });

    return Object.values(messages)
        .sort((a, b) => {
            return <any>new Date(b.timestamp) - <any>new Date(a.timestamp)
        })
        .slice(0, count)
}

/**
 * Updates balance overview
 *
 * @method updateBalanceOverview
 *
 * @param {number} balance
 * @param {number} incoming
 * @param {number} outgoing
 *
 * @returns {void}
 */
export const updateBalanceOverview = (balance: number, incoming: number, outgoing: number): void => {
    const { balanceOverview } = get(wallet);

    const activeCurrency = get(activeProfile)?.settings.currency ?? CurrencyTypes.USD;

    balanceOverview.update((overview) => {
        return Object.assign<BalanceOverview, BalanceOverview, Partial<BalanceOverview>>({} as BalanceOverview, overview, {
            incoming: formatUnit(incoming, 2),
            incomingRaw: incoming,
            outgoing: formatUnit(outgoing, 2),
            outgoingRaw: outgoing,
            balance: formatUnit(balance, 2),
            balanceRaw: balance,
            balanceFiat: `${convertToFiat(
                balance,
                get(currencies)[CurrencyTypes.USD],
                get(exchangeRates)[activeCurrency]
            )} ${activeCurrency}`,
        });
    });
};

/**
 * Updates balance overview fiat value
 *
 * @method updateBalanceOverviewFiat
 *
 * @returns {void}
 */
export const updateBalanceOverviewFiat = (): void => {
    const { balanceOverview } = get(wallet);

    const activeCurrency = get(activeProfile)?.settings.currency ?? CurrencyTypes.USD;

    balanceOverview.update((overview) => {
        return Object.assign<BalanceOverview, BalanceOverview, Partial<BalanceOverview>>({} as BalanceOverview, overview, {
            balanceFiat: `${convertToFiat(
                overview.balanceRaw,
                get(currencies)[CurrencyTypes.USD],
                get(exchangeRates)[activeCurrency]
            )} ${activeCurrency}`,
        });
    });
}

/**
* Updates accounts information after a successful sync accounts operation
*
* @method updateAccounts
*
* @param {SyncedAccount[]} syncedAccounts
*
* @returns {void}
*/
export const updateAccounts = (syncedAccounts: SyncedAccount[]): void => {
    const { accounts } = get(wallet)

    const existingAccountIds = get(accounts).map((account) => account.id)

    const { newAccounts, existingAccounts } = syncedAccounts.reduce((acc, syncedAccount: SyncedAccount) => {
        if (existingAccountIds.includes(syncedAccount.id)) {
            acc.existingAccounts.push(syncedAccount);
        } else {
            acc.newAccounts.push(syncedAccount);
        }

        return acc;
    }, { newAccounts: [], existingAccounts: [] })

    const updatedStoredAccounts = get(accounts).map((storedAccount) => {
        const syncedAccount = existingAccounts.find((_account) => _account.id === storedAccount.id)

        return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>({} as WalletAccount, storedAccount, {
            // Update deposit address
            depositAddress: syncedAccount.depositAddress.address,
            // If we have received a new address, simply add it;
            // If we have received an existing address, update the properties.
            addresses: mergeProps(storedAccount.addresses, syncedAccount.addresses, 'address'),
            messages: mergeProps(storedAccount.messages, syncedAccount.messages, 'id'),
        })
    })

    if (newAccounts.length) {
        const totalBalance = {
            balance: 0,
            incoming: 0,
            outgoing: 0,
        }

        const _accounts = []

        for (const [idx, newAccount] of newAccounts.entries()) {
            getAccountMeta(newAccount.id, (err, meta) => {
                if (!err) {
                    totalBalance.balance += meta.balance
                    totalBalance.incoming += meta.incoming
                    totalBalance.outgoing += meta.outgoing

                    const account = prepareAccountInfo(Object.assign<
                        WalletAccount, WalletAccount, Partial<WalletAccount>
                    >({} as WalletAccount, newAccount, {
                        alias: `Account ${newAccount.index + 1}`,
                        clientOptions: existingAccounts[0].clientOptions,
                        createdAt: new Date().toISOString(),
                        signerType: existingAccounts[0].signerType,
                        depositAddress: newAccount.depositAddress.address
                    }), meta)

                    _accounts.push(account)

                    if (idx === newAccounts.length - 1) {
                        const { balanceOverview } = get(wallet);
                        const overview = get(balanceOverview);

                        accounts.update(() => {
                            return [...updatedStoredAccounts, ..._accounts]
                        })

                        updateBalanceOverview(
                            overview.balanceRaw + totalBalance.balance,
                            overview.incomingRaw + totalBalance.incoming,
                            overview.outgoingRaw + totalBalance.outgoing
                        )
                    }
                } else {
                    console.error(err)
                }
            })
        }
    } else {
        accounts.update(() => updatedStoredAccounts);
    }
};

function mergeProps<T>(existingPayload: T[], newPayload: T[], prop: string): T[] {
    const existingPayloadMap = existingPayload.reduce((acc, object) => {
        acc[object[prop]] = object

        return acc
    }, {})

    const newPayloadMap = newPayload.reduce((acc, object) => {
        acc[object[prop]] = object

        return acc
    }, {})

    return Object.values(Object.assign({}, existingPayloadMap, newPayloadMap))
}

/**
 * Updates balance fiat value for every account
 *
 * @method updateAccountBalanceEquiv
 *
 * @returns {void}
 */
export const updateAccountsBalanceEquiv = (): void => {
    const { accounts } = get(wallet)

    const activeCurrency = get(activeProfile)?.settings.currency ?? CurrencyTypes.USD;

    accounts.update((storedAccounts) => {
        return storedAccounts.map((storedAccount) => {
            return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>({} as WalletAccount, storedAccount, {
                balanceEquiv: `${convertToFiat(
                    storedAccount.rawIotaBalance,
                    get(currencies)[CurrencyTypes.USD],
                    get(exchangeRates)[activeCurrency]
                )} ${activeCurrency}`,
            })
        })
    })
}

/**
 * Gets balance history for each account in market data timestamps
 *
 * @method getLatestMessages
 *
 * @param {Account} accounts
 * @param {PriceData} [priceData]
 *
 */
export const getAccountsBalanceHistory = (accounts: Account[], priceData: PriceData): BalanceHistory => {
    let balanceHistory: BalanceHistory = {
        [HistoryDataProps.ONE_HOUR]: [],
        [HistoryDataProps.TWENTY_FOUR_HOURS]: [],
        [HistoryDataProps.SEVEN_DAYS]: [],
        [HistoryDataProps.ONE_MONTH]: [],
    }
    if (priceData && accounts) {
        accounts.forEach((account) => {
            let accountBalanceHistory: HistoryData = {
                [HistoryDataProps.ONE_HOUR]: [],
                [HistoryDataProps.TWENTY_FOUR_HOURS]: [],
                [HistoryDataProps.SEVEN_DAYS]: [],
                [HistoryDataProps.ONE_MONTH]: [],
            }
            // Sort messages from last to newest
            let messages = account.messages.sort((a, b) => {
                return <any>new Date(a.timestamp).getTime() - <any>new Date(b.timestamp).getTime()
            })
            // Calculate the variations for each account
            var balanceSoFar = 0;
            let accountBalanceVariations = [{ balance: balanceSoFar, timestamp: '0' }]
            messages.forEach((message) => {
                const essence = message.payload.data.essence.data;

                if (essence.incoming) {
                    balanceSoFar += essence.value;
                } else {
                    balanceSoFar -= essence.value;
                }

                accountBalanceVariations.push({ balance: balanceSoFar, timestamp: message.timestamp })
            })
            // Calculate the balance in each market data timestamp
            let balanceHistoryInTimeframe = []
            Object.entries(priceData[CurrencyTypes.USD]).forEach(([timeframe, data]) => {
                // sort market data from last to newest
                let sortedData = data.sort((a, b) => a[0] - b[0])
                balanceHistoryInTimeframe = []
                // if there are no balance variations
                if (accountBalanceVariations.length === 1) {
                    balanceHistoryInTimeframe = sortedData.map(_data => ({ timestamp: _data[0], balance: 0 }))
                }
                else {
                    let i = 1
                    sortedData.forEach(data => {
                        let data_timestamp = new Date(data[0] * 1000).getTime()
                        // find balance for each market data timepstamp
                        for (i; i < accountBalanceVariations.length; i++) {
                            let currentBalanceTimestamp = new Date(accountBalanceVariations[i].timestamp).getTime()
                            let peviousBalanceTimestamp = new Date(accountBalanceVariations[i - 1].timestamp).getTime()
                            if (data_timestamp >= peviousBalanceTimestamp && data_timestamp < currentBalanceTimestamp) {
                                balanceHistoryInTimeframe.push({ timestamp: data[0], balance: accountBalanceVariations[i - 1].balance })
                                return
                            }
                            else if (i === (accountBalanceVariations.length - 1)) {
                                balanceHistoryInTimeframe.push({ timestamp: data[0], balance: accountBalanceVariations[i].balance })
                                return
                            }
                        }
                    })
                }
                accountBalanceHistory[timeframe] = balanceHistoryInTimeframe
            })
            balanceHistory[account.index] = accountBalanceHistory
        })
    }
    return balanceHistory
}

/**
 * Gets balance history for all accounts combined in market data timestamps
 *
 * @method getLatestMessages
 *
 * @param {Account} accounts
 * @param {PriceData} [priceData]
 *
 */
export const getWalletBalanceHistory = (accountsBalanceHistory: BalanceHistory): BalanceHistory => {
    let balanceHistory: BalanceHistory = {
        [HistoryDataProps.ONE_HOUR]: [],
        [HistoryDataProps.TWENTY_FOUR_HOURS]: [],
        [HistoryDataProps.SEVEN_DAYS]: [],
        [HistoryDataProps.ONE_MONTH]: [],
    }
    Object.values(accountsBalanceHistory).forEach(accBalanceHistory => {
        Object.entries(accBalanceHistory).forEach(([timeframe, data]) => {
            if (!balanceHistory[timeframe].length) {
                balanceHistory[timeframe] = data
            }
            else {
                balanceHistory[timeframe] = balanceHistory[timeframe].map(({ balance, timestamp }, index) =>
                    ({ timestamp, balance: balance + data[index].balance })
                )
            }
        })
    })
    return balanceHistory
}

/**
 * Sync the accounts
 */
export function syncAccounts() {
    isSyncing.set(true)
    api.syncAccounts({
        onSuccess(syncAccountsResponse) {
            const syncedAccounts = syncAccountsResponse.payload

            updateAccounts(syncedAccounts)

            isSyncing.set(false)
        },
        onError(err) {
            isSyncing.set(false)
            showAppNotification({
                type: 'error',
                message: localize(err.error),
            })
        },
    })
}

export const getAccountMeta = (accountId: string, callback: (
    error: ErrorEventPayload,
    meta?: {
        balance: number
        incoming: number
        outgoing: number
        depositAddress: string
    }
) => void) => {
    api.getBalance(accountId, {
        onSuccess(balanceResponse) {
            api.latestAddress(accountId, {
                onSuccess(latestAddressResponse) {
                    callback(null, {
                        balance: balanceResponse.payload.total,
                        incoming: balanceResponse.payload.incoming,
                        outgoing: balanceResponse.payload.outgoing,
                        depositAddress: latestAddressResponse.payload.address,
                    })
                },
                onError(error) {
                    callback(error)
                },
            })
        },
        onError(error) {
            callback(error)
        },
    })
}

export const prepareAccountInfo = (
    account: BaseAccount,
    meta: {
        balance: number
        incoming: number
        outgoing: number
        depositAddress: string
    }
) => {
    const { id, index, alias } = account
    const { balance, depositAddress } = meta

    const activeCurrency = get(activeProfile)?.settings.currency ?? CurrencyTypes.USD

    return Object.assign<WalletAccount, BaseAccount, Partial<WalletAccount>>({} as WalletAccount, account, {
        id,
        index,
        depositAddress,
        alias,
        rawIotaBalance: balance,
        balance: formatUnit(balance, 2),
        balanceEquiv: `${convertToFiat(
            balance,
            get(currencies)[CurrencyTypes.USD],
            get(exchangeRates)[activeCurrency]
        )} ${activeCurrency}`,
        color: ACCOUNT_COLORS[index % ACCOUNT_COLORS.length],
    })
}