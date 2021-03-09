import { mnemonic } from 'shared/lib/app'
import { convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
import { persistent } from 'shared/lib/helpers'
import { _ } from 'shared/lib/i18n'
import type { HistoryData, PriceData } from 'shared/lib/marketData'
import { HistoryDataProps } from 'shared/lib/marketData'
import { showSystemNotification } from 'shared/lib/notifications'
import { activeProfile, updateProfile } from 'shared/lib/profile'
import { formatUnit } from 'shared/lib/units'
import { get, writable, Writable } from 'svelte/store'
import type { Account, SyncedAccount } from './typings/account'
import type { Address } from './typings/address'
import type { Actor } from './typings/bridge'
import type { TransferProgressEventType } from './typings/events'
import type { Input, Message, Output } from './typings/message'
import type { ApiClient } from './walletApi'

export const MAX_ACCOUNT_NAME_LENGTH = 20

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
    loggedIn.set(false)
}

export const selectedAccountId = writable<string | null>(null)

export const selectedMessage = writable<Message | null>(null)

export const isTransferring = writable<boolean>(false)
export const transferState = writable<TransferProgressEventType | "Complete" | null>(null)

export const isSyncing = writable<boolean>(false)

export const loggedIn = persistent<boolean>('loggedIn', false)

export const api: ApiClient = window['__WALLET_API__']

export const getStoragePath = (appPath: string, profileName: string): string => {
    return `${appPath}/${WALLET_STORAGE_DIRECTORY}/${profileName}`
}

export const initialise = (id: string, storagePath: string): void => {
    const actor: Actor = window['__WALLET_INIT__'].run(id, storagePath)

    actors[id] = actor
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
            updateProfile('isStrongholdLocked', response.payload.snapshot.status === 'Locked')
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
            if (get(activeProfile).settings.notifications) {
                const accounts = get(wallet).accounts
                const account = get(accounts).find((account) => account.id === response.payload.accountId)
                const message = response.payload.message

                const locale = get(_) as (string) => string
                const notificationMessage = locale('notifications.valueTx')
                    .replace('{{value}}', message.value.toString())
                    .replace('{{account}}', account.alias)

                showSystemNotification({ type: "info", message: notificationMessage })
            }

            // Update account with new message
            saveNewMessage(response.payload.accountId, response.payload.message);
        },
        onError(error) {
            console.error(error)
        },
    })

    api.onConfirmationStateChange({
        onSuccess(response) {
            if (get(activeProfile).settings.notifications) {
                const accounts = get(wallet).accounts
                const account = get(accounts).find((account) => account.id === response.payload.accountId)
                const message = response.payload.message
                const messageKey = response.payload.confirmed ? 'confirmed' : 'failed'

                const locale = get(_) as (string) => string
                const notificationMessage = locale(`notifications.${messageKey}`)
                    .replace('{{value}}', message.value.toString())
                    .replace('{{account}}', account.alias)

                showSystemNotification({ type: "info", message: notificationMessage })
            }
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
            const { payload: { accountId, address, balanceChange } } = response;

            updateAccountAfterBalanceChange(accountId, address, balanceChange.received, balanceChange.spent)

            const { balanceOverview } = get(wallet);
            const overview = get(balanceOverview);

            const incoming = overview.incomingRaw + balanceChange.received;
            const outgoing = overview.outgoingRaw + balanceChange.spent;
            const balance = overview.balanceRaw - balanceChange.spent + balanceChange.received

            updateBalanceOverview(balance, incoming, outgoing);

        },
        onError(error) {
            console.error(error)
        },
    })

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

                return Object.assign<WalletAccount, Partial<WalletAccount>, Partial<WalletAccount>>({} as WalletAccount, storedAccount, {
                    rawIotaBalance,
                    balance: formatUnit(rawIotaBalance, 1),
                    balanceEquiv: `${convertToFiat(
                        rawIotaBalance,
                        get(currencies)[CurrencyTypes.USD],
                        get(exchangeRates)[get(activeProfile).settings.currency]
                    )} ${get(activeProfile).settings.currency}`,
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
            messages[message.id] = Object.assign<
                AccountMessage,
                Message,
                Partial<AccountMessage>
            >(
                {} as AccountMessage,
                message,
                { account: account.index });
        })
    });

    return Object.values(messages)
        .map(
            (message) => {
                const outputs = message.payload.data.essence.data.outputs;
                const inputs = message.payload.data.essence.data.inputs

                return Object.assign(
                    {},
                    message,
                    {
                        internal: outputs.length && outputs.every(
                            (output: Output) => addresses.includes(output.data.address)
                        ) && inputs.length && inputs.every(
                            (input: Input) => input.data.metadata ? addresses.includes(input.data.metadata.address) : false
                        )
                    })
            }
        )
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
                get(exchangeRates)[get(activeProfile).settings.currency]
            )} ${get(activeProfile).settings.currency}`,
        });
    });
};

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

    accounts.update((storedAccounts) => {
        return storedAccounts.map((storedAccount) => {
            const syncedAccount = syncedAccounts.find((_account) => _account.id === storedAccount.id)

            return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>({} as WalletAccount, storedAccount, {
                // Update deposit address
                depositAddress: syncedAccount.depositAddress.address,
                // If we have received a new address, simply add it;
                // If we have received an existing address, update the properties.
                addresses: mergeProps(storedAccount.addresses, syncedAccount.addresses, 'address'),
                messages: mergeProps(storedAccount.messages, syncedAccount.messages, 'id'),
            })
        })
    })
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
                if (message.incoming) {
                    balanceSoFar += message.value;
                } else {
                    balanceSoFar -= message.value;
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
