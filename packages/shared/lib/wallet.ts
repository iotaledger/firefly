import { writable, Writable, get } from 'svelte/store'
import type { Actor } from './typings/bridge'
import type { Address } from './typings/address'
import type { Message } from './typings/message'
import type { Account as BaseAccount } from './typings/account'
import type { Event, TransactionEventPayload, ConfirmationStateChangeEventPayload, BalanceChangeEventPayload } from './typings/events'
import { mnemonic } from 'shared/lib/app'
import { formatUnit } from 'shared/lib/units'
import { convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
import { activeProfile, updateProfile } from 'shared/lib/profile'
import { showSystemNotification } from 'shared/lib/notifications'
import { _ } from 'shared/lib/i18n'
import { persistent } from 'shared/lib/helpers'
import type { SyncedAccount } from './typings/account'

export const WALLET_STORAGE_DIRECTORY = '__storage__'

interface Account extends BaseAccount {
    depositAddress: Address;
    rawIotaBalance: number;
    balance: string;
    balanceEquiv: string;
    color: string;
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
    accounts: Writable<Account[]>
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
    accounts: writable<Account[]>([]),
})

export const resetWallet = () => {
    const { balanceOverview, accounts } = get(wallet)
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
    selectedAccountId.set(null)
    selectedMessage.set(null)
    loggedIn.set(false)
}

export const selectedAccountId = writable<string | null>(null)

export const selectedMessage = writable<Message | null>(null)

export const loggedIn = persistent<boolean>('loggedIn', false)

export const api = window['__WALLET_API__']

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

export const verifyRecoveryPhrase = (phrase): Promise<void> =>
    new Promise((resolve, reject) => {
        api.verifyMnemonic(phrase, {
            onSuccess(response) {
                resolve(response)
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
        onSuccess(response: Event<TransactionEventPayload>) {
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
        onSuccess(response: Event<ConfirmationStateChangeEventPayload>) {
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
        onSuccess(response: Event<BalanceChangeEventPayload>) {
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

                return Object.assign({}, storedAccount, {
                    rawIotaBalance,
                    balance: formatUnit(rawIotaBalance, 0),
                    balanceEquiv: `${convertToFiat(
                        rawIotaBalance,
                        get(currencies)[CurrencyTypes.USD],
                        get(exchangeRates)[get(activeProfile).settings.currency]
                    )} ${get(activeProfile).settings.currency}`,
                    addresses: storedAccount.addresses.map((_address: Address) => {
                        if (_address.address === address.address) {
                            return Object.assign({}, _address, address)
                        }

                        return _address
                    })
                })
            }
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
        return storedAccounts.map((storedAccount: Account) => {
            if (storedAccount.id === accountId) {
                return Object.assign({}, storedAccount, {
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
 * @param {Account} accounts
 * @param {number} [count]
 *
 * @returns {Message[]}
 */
export const getLatestMessages = (accounts: Account[], count = 10): Message[] => {
    const messages: Message[] = accounts.reduce(
        (messages, account) =>
            messages.concat(
                account.messages.map((message, idx) =>
                    Object.assign({}, message, {
                        account: account.index,
                        internal: idx % 2 !== 0,
                    })
                )
            ),
        []
    )

    return messages
        .slice()
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
        return Object.assign({}, overview, {
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
    const _update = (existingPayload, newPayload, prop) => {
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

    const { accounts } = get(wallet)

    accounts.update((storedAccounts) => {
        return storedAccounts.map((storedAccount) => {
            const syncedAccount = syncedAccounts.find((_account) => _account.id === storedAccount.id)

            return Object.assign({}, storedAccount, {
                // Update deposit address
                depositAddress: syncedAccount.depositAddress.address,
                // If we have received a new address, simply add it;
                // If we have received an existing address, update the properties.
                addresses: _update(storedAccount.addresses, syncedAccount.addresses, 'address'),
                messages: _update(storedAccount.messages, syncedAccount.messages, 'id'),
            })
        })
    })
};
