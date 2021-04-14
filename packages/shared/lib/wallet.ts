import { mnemonic } from 'shared/lib/app'
import { convertToFiat, currencies, CurrencyTypes, exchangeRates } from 'shared/lib/currency'
import { stripTrailingSlash } from 'shared/lib/helpers'
import { localize } from 'shared/lib/i18n'
import type { PriceData } from 'shared/lib/marketData'
import { HistoryDataProps } from 'shared/lib/marketData'
import { getOfficialNodes, network } from 'shared/lib/network'
import { showAppNotification, showSystemNotification } from 'shared/lib/notifications'
import { activeProfile, isStrongholdLocked, updateProfile } from 'shared/lib/profile'
import type { Account, Account as BaseAccount, AccountToCreate, Balance, SyncedAccount } from 'shared/lib/typings/account'
import type { Address } from 'shared/lib/typings/address'
import type { Actor } from 'shared/lib/typings/bridge'
import type { BalanceChangeEventPayload, ConfirmationStateChangeEventPayload, ErrorEventPayload, Event, ReattachmentEventPayload, TransactionEventPayload, TransferProgressEventPayload, TransferProgressEventType } from 'shared/lib/typings/events'
import type { Message } from 'shared/lib/typings/message'
import { formatUnit } from 'shared/lib/units'
import { get, writable, Writable } from 'svelte/store'
import type { ClientOptions } from './typings/client'
import type { Duration, NodeInfo, StrongholdStatus } from './typings/wallet'

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
    internalTransfersInProgress: Writable<{
        [key: string]: {
            from: string
            to: string
        }
    }>
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

export type AccountsBalanceHistory = {
    [accountIndex: number]: BalanceHistory
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
    internalTransfersInProgress: writable<{
        [key: string]: {
            from: string
            to: string
        }
    }>({})
})

export const resetWallet = () => {
    const { balanceOverview, accounts, accountsLoaded, internalTransfersInProgress } = get(wallet)
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
    internalTransfersInProgress.set({})
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

export const api: {
    generateMnemonic(callbacks: { onSuccess: (response: Event<string>) => void, onError: (err: ErrorEventPayload) => void })
    storeMnemonic(mnemonic: string, callbacks: { onSuccess: (response: Event<string>) => void, onError: (err: ErrorEventPayload) => void })
    verifyMnemonic(mnemonic: string, callbacks: { onSuccess: (response: Event<string>) => void, onError: (err: ErrorEventPayload) => void })
    getAccounts(callbacks: { onSuccess: (response: Event<Account[]>) => void, onError: (err: ErrorEventPayload) => void })
    getBalance(accountId: string, callbacks: { onSuccess: (response: Event<Balance>) => void, onError: (err: ErrorEventPayload) => void })
    latestAddress(accountId: string, callbacks: { onSuccess: (response: Event<Address>) => void, onError: (err: ErrorEventPayload) => void })
    areLatestAddressesUnused(callbacks: { onSuccess: (response: Event<boolean>) => void, onError: (err: ErrorEventPayload) => void })
    getUnusedAddress(accountId: string, callbacks: { onSuccess: (response: Event<Address>) => void, onError: (err: ErrorEventPayload) => void })
    getStrongholdStatus(callbacks: { onSuccess: (response: Event<StrongholdStatus>) => void, onError: (err: ErrorEventPayload) => void })
    syncAccounts(addressIndex: number, gapLimit: number, callbacks: { onSuccess: (response: Event<SyncedAccount[]>) => void, onError: (err: ErrorEventPayload) => void })
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
    backup(strongholdPath: string, password: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    restoreBackup(strongholdPath: string, password: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    removeAccount(accountId: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    setStoragePassword(newPinCode: string, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    removeStorage(callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    setClientOptions(clientOptions: ClientOptions, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    setStrongholdPasswordClearInterval(interval: Duration, callbacks: { onSuccess: (response: Event<void>) => void, onError: (err: ErrorEventPayload) => void })
    getNodeInfo(accountId: string, url: string | undefined, callbacks: { onSuccess: (response: Event<NodeInfo>) => void, onError: (err: ErrorEventPayload) => void })

    onStrongholdStatusChange(callbacks: { onSuccess: (response: Event<StrongholdStatus>) => void, onError: (err: ErrorEventPayload) => void })
    onNewTransaction(callbacks: { onSuccess: (response: Event<TransactionEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
    onReattachment(callbacks: { onSuccess: (response: Event<ReattachmentEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
    onConfirmationStateChange(callbacks: { onSuccess: (response: Event<ConfirmationStateChangeEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
    onBalanceChange(callbacks: { onSuccess: (response: Event<BalanceChangeEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
    onTransferProgress(callbacks: { onSuccess: (response: Event<TransferProgressEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
} = window['__WALLET_API__']

export const getStoragePath = (appPath: string, profileName: string): string => {
    return `${appPath}/${WALLET_STORAGE_DIRECTORY}/${profileName}`
}

export const initialise = (id: string, storagePath: string): void => {
    if (Object.keys(actors).length > 0) {
        console.error("Initialise called when another actor already initialised")
    }
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
    if (actors[id]) {
        try {
            actors[id].destroy()
        } catch (err) {
            console.error(err)
        } finally {
            delete actors[id]
        }
    }
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
    return recoveryPhrase
}

export const asyncSetStrongholdPassword = (password) => {
    return new Promise<void>((resolve, reject) => {
        api.setStrongholdPassword(password, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })
}

export const asyncStoreMnemonic = (mnemonic) => {
    return new Promise<void>((resolve, reject) => {
        api.storeMnemonic(mnemonic, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })
}

export const asyncVerifyMnemonic = (mnemonic) => {
    return new Promise<void>((resolve, reject) => {
        api.verifyMnemonic(mnemonic, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })
}

export const asyncBackup = (dest: string, password: string) => {
    return new Promise<void>((resolve, reject) => {
        api.backup(dest, password, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })
}

export const asyncSetStoragePassword = (password) => {
    return new Promise<void>((resolve, reject) => {
        api.setStoragePassword(password, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })
}

export const asyncRestoreBackup = (importFilePath, password) => {
    return new Promise<void>((resolve, reject) => {
        api.restoreBackup(importFilePath, password, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })
}

export const asyncCreateAccount = () => {
    return new Promise<void>((resolve, reject) => {
        const officialNodes = getOfficialNodes()
        api.createAccount(
            {
                signerType: { type: 'Stronghold' },
                clientOptions: {
                    nodes: officialNodes,
                    node: officialNodes[Math.floor(Math.random() * officialNodes.length)],
                    network: get(network)
                }
            },
            {
                onSuccess() {
                    resolve()
                },
                onError(err) {
                    reject(err)
                },
            }
        )
    })
}

export const asyncRemoveStorage = () => {
    return new Promise<void>((resolve, reject) => {
        api.removeStorage({
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })
}

export const asyncGetNodeInfo = (accountId, url) => {
    return new Promise<NodeInfo>((resolve, reject) => {
        api.getNodeInfo(accountId, url, {
            onSuccess(response) {
                resolve(response.payload)
            },
            onError(err) {
                reject(err)
            },
        })
    })
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

            if (!get(isSyncing)) {
                // Update account with new message
                saveNewMessage(response.payload.accountId, response.payload.message);
                const notificationMessage = localize('notifications.valueTx')
                    .replace('{{value}}', formatUnit(message.payload.data.essence.data.value))
                    .replace('{{account}}', account.alias);

                showSystemNotification({ type: "info", message: notificationMessage, contextData: { type: "valueTx", accountId: account.id } });
            }
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
            const message = response.payload.message
            const confirmed = response.payload.confirmed;
            const essence = message.payload.data.essence

            let account1
            let account2

            const { internalTransfersInProgress } = get(wallet)
            const transfers = get(internalTransfersInProgress)

            // Are we tracking an internal transfer for this message id
            if (transfers[message.id]) {
                account1 = get(accounts).find((account) => account.id === transfers[message.id].from)
                account2 = get(accounts).find((account) => account.id === transfers[message.id].to)
                internalTransfersInProgress.update((transfers) => {
                    delete transfers[message.id]
                    return transfers
                })
            } else {
                account1 = get(accounts).find((account) => account.id === response.payload.accountId)
            }

            // If this is a confirmation of a regular transfer update the balance overview
            if (confirmed && !essence.data.internal) {
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

            // Update the confirmation state of all messages with this id
            const confirmationChanged = updateAllMessagesState(accounts, message.id, response.payload.confirmed)

            // If the state has changed then display a notification
            if (confirmationChanged) {
                const messageKey = confirmed ? 'confirmed' : 'failed'

                const _notify = (accountTo: string | null = null) => {
                    let notificationMessage

                    if (accountTo) {
                        notificationMessage = localize(`notifications.${messageKey}Internal`)
                            .replace('{{value}}', formatUnit(message.payload.data.essence.data.value))
                            .replace('{{senderAccount}}', account1.alias)
                            .replace('{{receiverAccount}}', accountTo)
                    } else {
                        if (essence.data.internal && confirmed) {
                            // If this is a confirmed internal message but we don't
                            // have the account info it is most likely that someone logged
                            // out before an internal transfer completed so the internalTransfersInProgress
                            // was wiped, display the anonymous account message instead
                            notificationMessage = localize(`notifications.confirmedInternalNoAccounts`)
                                .replace('{{value}}', formatUnit(message.payload.data.essence.data.value))
                        } else {
                            notificationMessage = localize(`notifications.${messageKey}`)
                                .replace('{{value}}', formatUnit(message.payload.data.essence.data.value))
                                .replace('{{account}}', account1.alias)
                        }
                    }

                    showSystemNotification({ type: "info", message: notificationMessage, contextData: { type: messageKey, accountId: account1.id } });
                }

                // If this event is emitted because a message failed, then this message will only exist on the sender account
                // Therefore, show the notification (no need to group).
                if (!confirmed) {
                    _notify()
                } else {
                    // If we have 2 accounts this was an internal transfer
                    if (account1 && account2) {
                        _notify(account2.alias);
                    } else {
                        _notify()
                    }
                }
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

            const balance = overview.balanceRaw - balanceChange.spent + balanceChange.received

            updateBalanceOverview(balance, overview.incomingRaw, overview.outgoingRaw);
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

const updateAllMessagesState = (accounts, messageId, confirmation) => {
    let confirmationHasChanged = false

    accounts.update((storedAccounts) => {
        return storedAccounts.map((storedAccount) => {
            return Object.assign<WalletAccount, Partial<WalletAccount>, Partial<WalletAccount>>({} as WalletAccount, storedAccount, {
                messages: storedAccount.messages.map((_message: Message) => {
                    if (_message.id === messageId) {
                        confirmationHasChanged = _message.confirmed !== confirmation
                        _message.confirmed = confirmation
                    }
                    return _message
                })
            })
        })
    })

    return confirmationHasChanged
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
    address: string,
    receivedBalance: number,
    spentBalance: number
): void => {
    const { accounts } = get(wallet);

    accounts.update((storedAccounts) => {
        return storedAccounts.map((storedAccount) => {
            if (storedAccount.id === accountId) {
                const rawIotaBalance = storedAccount.rawIotaBalance - spentBalance + receivedBalance;

                const activeCurrency = get(activeProfile)?.settings.currency ?? CurrencyTypes.USD;

                return Object.assign<WalletAccount, Partial<WalletAccount>>(storedAccount, {
                    rawIotaBalance,
                    balance: formatUnit(rawIotaBalance, 2),
                    balanceEquiv: `${convertToFiat(
                        rawIotaBalance,
                        get(currencies)[CurrencyTypes.USD],
                        get(exchangeRates)[activeCurrency]
                    )} ${activeCurrency}`,
                    addresses: storedAccount.addresses.map((_address: Address) => {
                        if (_address.address === address) {
                            _address.balance += receivedBalance - spentBalance
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
 * Gets the account messages. Appends account index and sort the message list.
 *
 * @method getAccountMessages
 *
 * @param {WalletAccount} accounts
 *
 * @returns {AccountMessage[]}
 */
export const getAccountMessages = (account: WalletAccount): AccountMessage[] => {
    const messages: {
        [key: string]: AccountMessage
    } = {};

    account.messages.forEach((message) => {
        messages[message.id] = Object.assign<
            AccountMessage,
            Message,
            Partial<AccountMessage>
        >(
            {} as AccountMessage,
            message,
            { account: account.index });
    });

    return Object.values(messages)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

/**
 * Gets a slice of all transactions (on all accounts). Appends account index and sort the message list.
 *
 * @method getTransactions
 *
 * @param {WalletAccount} accounts
 * @param {number} [count]
 *
 * @returns {AccountMessage[]}
 */
export const getTransactions = (accounts: WalletAccount[], count = 10): AccountMessage[] => {
    const messages: {
        [key: string]: AccountMessage
    } = {};

    accounts.forEach((account) => {
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
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
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
    }).sort((a, b) => a.index - b.index)

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
 * @method getAccountsBalanceHistory
 *
 * @param {Account} accounts
 * @param {number} balanceRaw
 * @param {PriceData} [priceData]
 *
 */
export const getAccountsBalanceHistory = (accounts: WalletAccount[], priceData: PriceData): AccountsBalanceHistory => {
    let balanceHistory: AccountsBalanceHistory = {}
    if (priceData && accounts) {
        accounts.forEach((account) => {
            let accountBalanceHistory: BalanceHistory = {
                [HistoryDataProps.ONE_HOUR]: [],
                [HistoryDataProps.TWENTY_FOUR_HOURS]: [],
                [HistoryDataProps.SEVEN_DAYS]: [],
                [HistoryDataProps.ONE_MONTH]: [],
            }
            // Sort messages from last to newest
            let messages = account.messages.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            // Calculate the variations for each account
            var trackedBalance = account.rawIotaBalance;
            let accountBalanceVariations = [{ balance: trackedBalance, timestamp: new Date().toString() }]
            messages.forEach((message) => {
                const essence = message.payload.data.essence.data;

                if (essence.incoming) {
                    trackedBalance -= essence.value;
                } else {
                    trackedBalance += essence.value;
                }
                accountBalanceVariations.push({ balance: trackedBalance, timestamp: message.timestamp })
            })
            // Calculate the balance in each market data timestamp
            let balanceHistoryInTimeframe = []
            Object.entries(priceData[CurrencyTypes.USD]).forEach(([timeframe, data]) => {
                // sort market data from newest to last
                let sortedData = data.slice().sort((a, b) => b[0] - a[0])
                balanceHistoryInTimeframe = []
                // if there are no balance variations
                if (accountBalanceVariations.length === 1) {
                    balanceHistoryInTimeframe = sortedData.map(_data => ({ timestamp: _data[0], balance: trackedBalance }))
                }
                else {
                    let i = 0
                    sortedData.forEach((data) => {
                        let marketTimestamp = new Date(data[0] * 1000).getTime()
                        // find balance for each market data timepstamp
                        for (i; i < accountBalanceVariations.length - 1; i++) {
                            let currentBalanceTimestamp = new Date(accountBalanceVariations[i].timestamp).getTime()
                            let nextBalanceTimestamp = new Date(accountBalanceVariations[i + 1].timestamp).getTime()
                            if (marketTimestamp > nextBalanceTimestamp && marketTimestamp <= currentBalanceTimestamp) {
                                balanceHistoryInTimeframe.push({ timestamp: data[0], balance: accountBalanceVariations[i].balance })
                                return
                            }
                            else if (marketTimestamp <= nextBalanceTimestamp && i === (accountBalanceVariations.length - 2)) {
                                balanceHistoryInTimeframe.push({ timestamp: data[0], balance: 0 })
                                return
                            }
                        }
                    })
                }
                accountBalanceHistory[timeframe] = balanceHistoryInTimeframe.reverse()
            })
            balanceHistory[account.index] = accountBalanceHistory
        })
    }
    return balanceHistory
}

/**
 * Gets balance history for all accounts combined in market data timestamps
 *
 * @method getWalletBalanceHistory
 *
 * @param {Account} accounts
 * @param {PriceData} [priceData]
 *
 */
export const getWalletBalanceHistory = (accountsBalanceHistory: AccountsBalanceHistory): BalanceHistory => {
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
export function syncAccounts(showConfirmation, addressIndex?: number, gapLimit?: number) {
    isSyncing.set(true)
    api.syncAccounts(addressIndex, gapLimit, {
        onSuccess(syncAccountsResponse) {
            const syncedAccounts = syncAccountsResponse.payload

            updateAccounts(syncedAccounts)

            if (showConfirmation) {
                showAppNotification({
                    type: 'info',
                    message: localize('notifications.accountsSynchronized'),
                })
            }

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

export const buildAccountNetworkSettings = () => {
    let activeProfileSettings = get(activeProfile)?.settings

    let automaticNodeSelection = activeProfileSettings?.automaticNodeSelection ?? true
    let includeOfficialNodes = activeProfileSettings?.includeOfficialNodes ?? true
    let disabledNodes = activeProfileSettings?.disabledNodes ?? []

    const { accounts } = get(wallet)
    const actualAccounts = get(accounts)

    let clientOptionNodes = []
    let primaryNodeUrl = ''
    let officialNodes = getOfficialNodes()
    let localPow = true

    if (actualAccounts && actualAccounts.length > 0) {
        const clientOptions = actualAccounts[0].clientOptions
        if (clientOptions) {
            clientOptionNodes = clientOptions.nodes ?? []
            localPow = clientOptions.localPow ?? true

            if (clientOptions.node) {
                primaryNodeUrl = stripTrailingSlash(clientOptions.node.url)
            }
        }
    }

    // If we are in automatic node selection make sure none of the offical nodes
    // are disabled
    if (automaticNodeSelection) {
        officialNodes = officialNodes.map(o => ({ ...o, disabled: false }))
    }

    // First populate the nodes with the official ones if needed
    let nodes = []
    if (includeOfficialNodes || automaticNodeSelection || clientOptionNodes.length === 0) {
        nodes = [...officialNodes]
    }

    // Now go through the nodes from the client options and add
    // any that were not in the official list, setting their custom flag as well
    for (const clientOptionNode of clientOptionNodes) {
        if (!nodes.find(n => n.url == stripTrailingSlash(clientOptionNode.url))) {
            clientOptionNode.isCustom = true
            nodes.push({
                ...clientOptionNode,
                url: stripTrailingSlash(clientOptionNode.url)
            })
        }
    }

    // Iterate through the complete disabled node list and mark any
    // Use this instead of the flag on the client option nodes
    // as we may have been in automatic mode which disables all
    // non official nodes
    for (const disabledNode of disabledNodes) {
        const foundNode = nodes.find(n => n.url === stripTrailingSlash(disabledNode))
        if (foundNode) {
            foundNode.disabled = true
        }
    }

    // If the primary node is not set or its not in the list
    // or in the list and disabled find the
    // first node from the list that is not disabled
    const allEnabled = nodes.filter(n => !n.disabled)
    if (allEnabled.length > 0 && (!primaryNodeUrl || !allEnabled.find(n => n.url === primaryNodeUrl))) {
        primaryNodeUrl = allEnabled[0].url
    }

    return {
        automaticNodeSelection,
        includeOfficialNodes,
        nodes,
        primaryNodeUrl,
        localPow
    }
}

export const updateAccountNetworkSettings = async (automaticNodeSelection, includeOfficialNodes, nodes, primaryNodeUrl, localPow) => {
    updateProfile('settings.automaticNodeSelection', automaticNodeSelection)
    updateProfile('settings.includeOfficialNodes', includeOfficialNodes)

    const disabledNodes = nodes.filter(n => n.disabled).map(n => n.url)
    updateProfile('settings.disabledNodes', disabledNodes)

    let clientNodes = []
    let officialNodes = getOfficialNodes()

    // Get the list of non official nodes
    const nonOfficialNodes = nodes.filter(n => !officialNodes.find(d => d.url === n.url))

    // If we are in automatic node selection make sure none of the offical nodes
    // are disabled
    if (automaticNodeSelection) {
        officialNodes = officialNodes.map(o => ({ ...o, disabled: false }))
    }

    // If we are in automatic mode, or including the official nodes in manual mode
    // or in manual mode and there are no non official nodes
    if (automaticNodeSelection || includeOfficialNodes || nonOfficialNodes.length === 0) {
        clientNodes = [...officialNodes]
    }

    // Now add back the non official nodes, if we are in automatic mode we should
    // disable them, otherwise retain their current disabled state
    if (nonOfficialNodes.length > 0) {
        clientNodes = [...clientNodes, ...nonOfficialNodes.map(o => ({ ...o, disabled: automaticNodeSelection ? true : o.disabled }))]
    }

    // Get all the enabled nodes and make sure the primary url is enabled
    const allEnabled = clientNodes.filter(n => !n.disabled)
    let clientNode = allEnabled.find(n => n.url === primaryNodeUrl)

    if (!clientNode && allEnabled.length > 0) {
        clientNode = allEnabled[0]
    }

    const clientOptions = {
        nodes: clientNodes,
        node: clientNode,
        localPow
    }

    api.setClientOptions(
        clientOptions,
        {
            onSuccess() {
                const { accounts } = get(wallet)

                accounts.update((_accounts) =>
                    _accounts.map((_account) =>
                        Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                            {} as WalletAccount,
                            _account,
                            {
                                clientOptions
                            }
                        )
                    )
                )
            },
            onError(err) {
                showAppNotification({
                    type: 'error',
                    message: localize(err.error),
                })
            },
        }
    )
}
