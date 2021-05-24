import { mnemonic } from 'shared/lib/app'
import { convertToFiat, currencies, CurrencyTypes, exchangeRates, formatCurrency } from 'shared/lib/currency'
import { stripTrailingSlash } from 'shared/lib/helpers'
import { localize } from 'shared/lib/i18n'
import type { PriceData } from 'shared/lib/marketData'
import { HistoryDataProps } from 'shared/lib/marketData'
import { getOfficialNetwork, getOfficialNodes } from 'shared/lib/network'
import { showAppNotification, showSystemNotification } from 'shared/lib/notifications'
import { activeProfile, isStrongholdLocked, updateProfile } from 'shared/lib/profile'
import type { Account as BaseAccount, AccountToCreate, Balance } from 'shared/lib/typings/account'
import type {
    BalanceChangeEventPayload,
    ConfirmationStateChangeEventPayload,
    ErrorEventPayload,
    Event,
    MigrationProgressEventPayload,
    ReattachmentEventPayload,
    TransactionEventPayload,
    TransferProgressEventPayload
} from 'shared/lib/typings/events'
import type { Payload, Transaction } from 'shared/lib/typings/message'
import type { MigrationBundle, MigrationData, SendMigrationBundleResponse } from 'shared/lib/typings/migration'
import { formatUnitBestMatch } from 'shared/lib/units'
import { get, writable, Writable } from 'svelte/store'
import type { Account, SyncedAccount } from './typings/account'
import type { Address } from './typings/address'
import type { Actor } from './typings/bridge'
import type { ClientOptions } from './typings/client'
import type { TransferProgressEventType } from './typings/events'
import type { Message } from './typings/message'
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
        balanceFiat: '$ 0.00',
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
        balanceFiat: '$ 0.00',
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
    syncAccounts(addressIndex: number, gapLimit: number, accountDiscoveryThreshold: number, callbacks: { onSuccess: (response: Event<SyncedAccount[]>) => void, onError: (err: ErrorEventPayload) => void })
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

    // Legacy seed APIs
    getLegacySeedChecksum(seed: string, callbacks: { onSuccess: (response: Event<string>) => void, onError: (err: ErrorEventPayload) => void })


    onStrongholdStatusChange(callbacks: { onSuccess: (response: Event<StrongholdStatus>) => void, onError: (err: ErrorEventPayload) => void })
    onNewTransaction(callbacks: { onSuccess: (response: Event<TransactionEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
    onReattachment(callbacks: { onSuccess: (response: Event<ReattachmentEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
    onConfirmationStateChange(callbacks: { onSuccess: (response: Event<ConfirmationStateChangeEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
    onBalanceChange(callbacks: { onSuccess: (response: Event<BalanceChangeEventPayload>) => void, onError: (err: ErrorEventPayload) => void })
    onTransferProgress(callbacks: { onSuccess: (response: Event<TransferProgressEventPayload>) => void, onError: (err: ErrorEventPayload) => void }),
    onMigrationProgress(callbacks: { onSuccess: (response: Event<MigrationProgressEventPayload>) => void, onError: (err: ErrorEventPayload) => void }),

    // Migration
    getMigrationData(
        seed: string,
        nodes: string[],
        securityLevel: number,
        initialAddressIndex: number,
        permanode: string | undefined,
        callbacks: { onSuccess: (response: Event<MigrationData>) => void, onError: (err: ErrorEventPayload) => void }
    ),
    createMigrationBundle(
        seed: string,
        inputAddressIndexes: number[],
        mine: boolean,
        timeoutSeconds: number,
        offset: number,
        logFilePath: string,
        callbacks: { onSuccess: (response: Event<MigrationBundle>) => void, onError: (err: ErrorEventPayload) => void }
    ),
    sendMigrationBundle(
        node: string[],
        bundleHash: string,
        mwm: number,
        callbacks: { onSuccess: (response: Event<SendMigrationBundleResponse>) => void, onError: (err: ErrorEventPayload) => void }
    ),
} = window['__WALLET_API__']

export const getWalletStoragePath = (appPath: string): string => {
    return `${appPath}/${WALLET_STORAGE_DIRECTORY}/`
}

export const getStoragePath = (appPath: string, profileName: string): string => {
    return `${getWalletStoragePath(appPath)}${profileName}`
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

/**
 * Get legacy seed checksum
 * 
 * @method asyncGetLegacySeedChecksum
 * 
 * @param {string} seed
 *  
 * @returns {Promise<Event<string>>}
 */
export const asyncGetLegacySeedChecksum = (seed: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        api.getLegacySeedChecksum(seed, {
            onSuccess(response) {
                resolve(response.payload)
            },
            onError(err) {
                reject(err)
            },
        })
    })
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

export const asyncChangeStrongholdPassword = (currentPassword, newPassword) => {
    return new Promise<void>((resolve, reject) => {
        api.changeStrongholdPassword(currentPassword, newPassword, {
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
        const officialNetwork = getOfficialNetwork()
        api.createAccount(
            {
                signerType: { type: 'Stronghold' },
                clientOptions: {
                    nodes: officialNodes,
                    node: officialNodes[Math.floor(Math.random() * officialNodes.length)],
                    network: officialNetwork
                },
                alias: `${localize('general.account')} 1`
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

export const asyncSyncAccounts = (addressIndex?, gapLimit?, accountDiscoveryThreshold?, showErrorNotification = true) => {
    return new Promise<void>((resolve, reject) => {
        isSyncing.set(true)

        api.syncAccounts(addressIndex, gapLimit, accountDiscoveryThreshold, {
            onSuccess(response) {
                const syncedAccounts = response.payload

                const firstAccount = syncedAccounts.find(account => account.index === 0)

                processMigratedTransactions(firstAccount.id, firstAccount.messages, firstAccount.addresses)

                updateAccounts(syncedAccounts)

                isSyncing.set(false)

                resolve()
            },
            onError(err) {
                isSyncing.set(false)

                if (showErrorNotification) {
                    showAppNotification({
                        type: 'error',
                        message: localize(err.error),
                    })
                    resolve()
                } else {
                    reject(err)
                }
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

            if (message.payload.type === 'Transaction') {
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

                // Update account with new message
                saveNewMessage(response.payload.accountId, response.payload.message);

                const notificationMessage = localize('notifications.valueTx')
                    .replace('{{value}}', formatUnitBestMatch(message.payload.data.essence.data.value, true, 3))
                    .replace('{{account}}', account.alias);

                showSystemNotification({ type: "info", message: notificationMessage, contextData: { type: "valueTx", accountId: account.id } });
            } else if (message.payload.type === 'Milestone') {
                // Update account with new message
                saveNewMessage(response.payload.accountId, response.payload.message);
                processMigratedTransactions(response.payload.accountId, [response.payload.message],

                    // New transaction will only emit an event for fluid migrations
                    [])
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

            if (message.payload.type === 'Transaction') {
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
                // but only for transactions not migrations
                if (confirmationChanged && message.payload.type === 'Transaction') {
                    const tx = message.payload as Transaction
                    const messageKey = confirmed ? 'confirmed' : 'failed'

                    const _notify = (accountTo: string | null = null) => {
                        let notificationMessage

                        if (accountTo) {
                            notificationMessage = localize(`notifications.${messageKey}Internal`)
                                .replace('{{value}}', formatUnitBestMatch(tx.data.essence.data.value, true, 3))
                                .replace('{{senderAccount}}', account1.alias)
                                .replace('{{receiverAccount}}', accountTo)
                        } else {
                            if (essence.data.internal && confirmed) {
                                // If this is a confirmed internal message but we don't
                                // have the account info it is most likely that someone logged
                                // out before an internal transfer completed so the internalTransfersInProgress
                                // was wiped, display the anonymous account message instead
                                notificationMessage = localize(`notifications.confirmedInternalNoAccounts`)
                                    .replace('{{value}}', formatUnitBestMatch(tx.data.essence.data.value, true, 3))
                            } else {
                                notificationMessage = localize(`notifications.${messageKey}`)
                                    .replace('{{value}}', formatUnitBestMatch(tx.data.essence.data.value, true, 3))
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
            const { payload: { accountId, address, balanceChange, messageId } } = response;

            updateAccountAfterBalanceChange(accountId, address, balanceChange.received, balanceChange.spent)

            const { balanceOverview } = get(wallet);
            const overview = get(balanceOverview);

            const balance = overview.balanceRaw - balanceChange.spent + balanceChange.received

            updateBalanceOverview(balance, overview.incomingRaw, overview.outgoingRaw);

            // Migration
            if (messageId === '0'.repeat(64)) {
                updateProfile(
                    'migratedTransactions',
                    []
                )
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

                let updatedAddress = false
                const updatedAccount = Object.assign<WalletAccount, Partial<WalletAccount>>(storedAccount, {
                    rawIotaBalance,
                    balance: formatUnitBestMatch(rawIotaBalance, true, 3),
                    balanceEquiv: formatCurrency(convertToFiat(
                        rawIotaBalance,
                        get(currencies)[CurrencyTypes.USD],
                        get(exchangeRates)[activeCurrency]
                    )),
                    addresses: storedAccount.addresses.map((_address: Address) => {
                        if (_address.address === address) {
                            _address.balance += receivedBalance - spentBalance
                            updatedAddress = true
                        }

                        return _address
                    })
                })

                // The address could not be found in our current list of addresses
                // call getAccounts to fill in the missing information
                if (!updatedAddress) {
                    api.getAccounts({
                        onSuccess(accountsResponse) {
                            const ac = accountsResponse.payload.find((a) => a.id === accountId)
                            if (ac) {
                                const addr = ac.addresses.find(ad => ad.address === address)
                                if (addr) {
                                    updatedAccount.addresses.push(addr)
                                }
                            }
                        },
                        onError(err) {
                            // Not much we can do with an error here
                            console.error(err)
                        },
                    })
                }

                return updatedAccount
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

    const messageIncoming = getIncomingFlag(message.payload)

    accounts.update((storedAccounts) => {
        return storedAccounts.map((storedAccount: WalletAccount) => {
            if (storedAccount.id === accountId) {
                const hasMessage = storedAccount.messages.some(m => m.id === message.id && getIncomingFlag(m.payload) === messageIncoming)

                if (!hasMessage) {
                    storedAccount.messages.push(message)
                }
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

    const messageIncoming = getIncomingFlag(newMessage.payload)

    accounts.update((storedAccounts) => {
        return storedAccounts.map((storedAccount: WalletAccount) => {
            if (storedAccount.id === accountId) {
                return Object.assign<WalletAccount, Partial<WalletAccount>, Partial<WalletAccount>>({} as WalletAccount, storedAccount, {
                    messages: storedAccount.messages.map((_message) => {
                        if (_message.id === messageId && getIncomingFlag(_message.payload) === messageIncoming) {
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
        let extraId = ''
        if (message.payload?.type === "Transaction") {
            extraId = getIncomingFlag(message.payload) ? 'in' : 'out'
        }
        messages[message.id + extraId] = {
            ...message,
            account: account.index
        }
    })

    return Object.values(messages)
        .sort((a, b) => {
            if (a.id === b.id && a.payload?.type == "Transaction") {
                return getIncomingFlag(a.payload) ? -1 : 1
            }
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        })
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
            let extraId = ''
            if (message.payload?.type === "Transaction") {
                extraId = getIncomingFlag(message.payload) ? 'in' : 'out'
            }
            messages[account.index + message.id + extraId] = {
                ...message,
                account: account.index
            }
        })
    });

    return Object.values(messages)
        .sort((a, b) => {
            if (a.id === b.id && a.payload.type == "Transaction") {
                return getIncomingFlag(a.payload) ? -1 : 1
            }
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
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
            incoming: formatUnitBestMatch(incoming, true, 3),
            incomingRaw: incoming,
            outgoing: formatUnitBestMatch(outgoing, true, 3),
            outgoingRaw: outgoing,
            balance: formatUnitBestMatch(balance, true, 3),
            balanceRaw: balance,
            balanceFiat: formatCurrency(convertToFiat(
                balance,
                get(currencies)[CurrencyTypes.USD],
                get(exchangeRates)[activeCurrency]
            )),
        });
    });
};

/**
 * Updates balance overview fiat value
 *
 * @method refreshBalanceOverview
 *
 * @returns {void}
 */
export const refreshBalanceOverview = (): void => {
    const { balanceOverview } = get(wallet);
    const bo = get(balanceOverview)
    updateBalanceOverview(bo.balanceRaw, bo.incomingRaw, bo.outgoingRaw)
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

        // Update deposit address
        storedAccount.depositAddress = syncedAccount.depositAddress.address

        // If we have received a new address, simply add it;
        // If we have received an existing address, update the properties.
        for (const addr of syncedAccount.addresses) {
            const addressIndex = storedAccount.addresses.findIndex(a => a.address === addr.address)
            if (addressIndex < 0) {
                storedAccount.addresses.push(addr)
            } else {
                storedAccount.addresses[addressIndex] = addr
            }
        }

        // If we have received a new message, simply add it;
        // If we have received an existing message, update the properties.
        for (const msg of syncedAccount.messages) {
            const msgIndex = storedAccount.messages.findIndex(m => m.id === msg.id && getIncomingFlag(m.payload) === getIncomingFlag(msg.payload))
            if (msgIndex < 0) {
                storedAccount.messages.push(msg)
            } else {
                storedAccount.messages[msgIndex] = msg
            }
        }

        return storedAccount
    })

    if (newAccounts.length) {
        const totalBalance = {
            balance: 0,
            incoming: 0,
            outgoing: 0,
        }

        const _accounts = []
        let completeCount = 0

        for (const newAccount of newAccounts) {
            getAccountMeta(newAccount.id, (err, meta) => {
                if (!err) {
                    totalBalance.balance += meta.balance
                    totalBalance.incoming += meta.incoming
                    totalBalance.outgoing += meta.outgoing

                    const account = prepareAccountInfo(Object.assign<
                        WalletAccount, WalletAccount, Partial<WalletAccount>
                    >({} as WalletAccount, newAccount, {
                        alias: `${localize('general.account')} ${newAccount.index + 1}`,
                        clientOptions: existingAccounts[0].clientOptions,
                        createdAt: new Date().toISOString(),
                        signerType: existingAccounts[0].signerType,
                        depositAddress: newAccount.depositAddress.address
                    }), meta)

                    _accounts.push(account)
                } else {
                    console.error(err)
                }

                completeCount++
                if (completeCount === newAccounts.length) {
                    const { balanceOverview } = get(wallet);
                    const overview = get(balanceOverview);

                    accounts.update(() => {
                        return [...updatedStoredAccounts, ..._accounts].sort((a, b) => a.index - b.index)
                    })

                    updateBalanceOverview(
                        overview.balanceRaw + totalBalance.balance,
                        overview.incomingRaw + totalBalance.incoming,
                        overview.outgoingRaw + totalBalance.outgoing
                    )
                }

            })
        }
    } else {
        accounts.update(() => updatedStoredAccounts.sort((a, b) => a.index - b.index));
    }
};

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
        for (const storedAccount of storedAccounts) {
            storedAccount.balance = formatUnitBestMatch(storedAccount.rawIotaBalance, true, 3)
            storedAccount.balanceEquiv = formatCurrency(convertToFiat(
                storedAccount.rawIotaBalance,
                get(currencies)[CurrencyTypes.USD],
                get(exchangeRates)[activeCurrency]
            ))
        }
        return storedAccounts
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
            let messages: Message[] = account?.messages?.slice()
                ?.filter((message) => message.payload && !isSelfTransaction(message.payload, account)) // Remove self transactions and messages with no payload
                ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) ?? [] // Sort messages from last to newest
            // Calculate the variations for each account
            var trackedBalance = account.rawIotaBalance;
            let accountBalanceVariations = [{ balance: trackedBalance, timestamp: new Date().toString() }]
            messages.forEach((message) => {
                const essence = message.payload.type === 'Transaction' &&
                    message.payload.data.essence.data

                if (essence && essence.incoming) {
                    trackedBalance -= essence.value || 0;
                } else {
                    trackedBalance += essence.value || 0;
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
    const { id, index, alias, signerType } = account
    const { balance, depositAddress } = meta

    const activeCurrency = get(activeProfile)?.settings.currency ?? CurrencyTypes.USD

    return Object.assign<WalletAccount, BaseAccount, Partial<WalletAccount>>({} as WalletAccount, account, {
        id,
        index,
        depositAddress,
        alias,
        rawIotaBalance: balance,
        signerType,
        balance: formatUnitBestMatch(balance, true, 3),
        balanceEquiv: formatCurrency(convertToFiat(
            balance,
            get(currencies)[CurrencyTypes.USD],
            get(exchangeRates)[activeCurrency]
        )),
        color: ACCOUNT_COLORS[index % ACCOUNT_COLORS.length],
    })
}

export const processMigratedTransactions = (accountId: string, messages: Message[], addresses: Address[]): void => {
    const accounts = get(wallet).accounts

    messages.forEach((message: Message) => {
        if (message.payload?.type === 'Milestone') {
            const account = get(accounts).find((account) => account.id === accountId);

            // Only check migrated messages for first account as the migrated messages are sent there
            if (account && account.index === 0) {
                const _activeProfile = get(activeProfile)

                if (_activeProfile.migratedTransactions && _activeProfile.migratedTransactions.length) {
                    const funds = message.payload.data.essence.receipt.data.funds;

                    const tailTransactionHashes = funds.map((fund) => fund.tailTransactionHash)

                    const updatedMigratedTransactions = _activeProfile.migratedTransactions.filter((transaction) => !tailTransactionHashes.includes(transaction.tailTransactionHash))

                    updateProfile(
                        'migratedTransactions',
                        updatedMigratedTransactions
                    )
                }
            }
        }
    })

    const _activeProfile = get(activeProfile)

    if (_activeProfile.migratedTransactions && _activeProfile.migratedTransactions.length) {
        // For pre-snapshot migrations, there will be no messages
        addresses.forEach((address) => {
            const outputs = address.outputs;

            if (Object.values(outputs).some((output) => output.messageId === '0'.repeat(64))) {
                updateProfile(
                    'migratedTransactions',
                    []
                )
            }
        })
    }

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
                const shouldHideErrorNotification =
                    err && err.type === 'ClientError' && err.error === 'error.node.chrysalisNodeInactive'

                if (!shouldHideErrorNotification) {
                    showAppNotification({
                        type: 'error',
                        message: localize(err.error),
                    })
                }

            },
        }
    )
}

/**
 * Check if a message was emitted and received by the provided account
 *
 * @method getWalletBalanceHistory
 *
 * @param {Payload} payload
 * @param {WalletAccount} account
 *
 */
export const isSelfTransaction = (payload: Payload, account: Account): boolean => {
    const accountAddresses = account?.addresses?.map(add => add.address) ?? []
    if (payload && accountAddresses.length) {
        const getReceiverAddresses = () => {
            if (payload.type === 'Transaction') {
                return receiverAddressesFromTransactionPayload(payload)
            } else if (payload.type === 'Milestone') {
                return receiverAddressesFromMilestonePayload(payload)
            }

            return null;
        }

        const senderAddress: string = sendAddressFromTransactionPayload(payload)

        const receiverAddresses: string[] = getReceiverAddresses()

        const transactionAddresses = [senderAddress, ...receiverAddresses]
        return senderAddress && receiverAddresses.length && transactionAddresses.every((txAddress) => accountAddresses.indexOf(txAddress) !== -1)
    }
    return false
}

/**
 * Get the sender address from a transaction payload.
 */
export const sendAddressFromTransactionPayload = (payload: Payload): string => {
    if (payload?.type === "Transaction") {
        return payload?.data?.essence?.data?.inputs?.find((input) => /utxo/i.test(input?.type))?.data?.metadata?.address ?? null
    }

    return null
}

/**
 * Get the receiver addresses from a transaction payload.
 */
export const receiverAddressesFromTransactionPayload = (payload: Payload): string[] => {
    if (payload?.type === "Transaction") {
        return payload?.data?.essence?.data?.outputs
            ?.map((output) => output?.data?.address) ?? []
    }

    return []
}

/**
 * Get the receiver addresses from a milestone payload.
 */
export const receiverAddressesFromMilestonePayload = (payload: Payload): string[] => {
    if (payload?.type === "Milestone") {
        return payload?.data?.essence?.receipt?.data?.funds
            ?.map((receiptFunds) => receiptFunds?.output?.address) ?? []
    }

    return []
}

/**
 * Get the value of a milestone message
 * @returns 
 */
export const getMilestoneMessageValue = (payload: Payload, accounts) => {
    if (payload?.type === "Milestone") {
        const funds = payload.data.essence.receipt.data.funds

        const firstAccount = accounts.find((acc) => acc.index === 0)
        const firstAccountAddresses = firstAccount.addresses.map((address) => address.address)

        const totalValue = funds
            .filter((fund) => firstAccountAddresses.includes(fund.output.address))
            .reduce((acc, fund) => acc + fund.output.amount, 0)

        return totalValue
    }

    return 0
}

/**
 * Get incoming flag from message
 * @returns 
 */
export const getIncomingFlag = (payload: Payload) => {
    if (payload?.type === "Transaction") {
        return payload.data.essence.data.incoming
    }

    return undefined
}

/**
 * Set incoming flag on the message
 * @returns 
 */
export const setIncomingFlag = (payload: Payload, incoming: boolean) => {
    if (payload?.type === "Transaction") {
        payload.data.essence.data.incoming = incoming
    }
}

/**
* Get internal flag from message
* @returns 
*/
export const getInternalFlag = (payload: Payload) => {
    if (payload?.type === "Transaction") {
        return payload.data.essence.data.internal
    }

    return undefined
}

/**
 * Find an address in one of our accounts
 * @param address The address to find
 * @returns The wallet account matching the address or undefined if not found
 */
export const findAccountWithAddress = (address: string): WalletAccount | undefined => {
    if (!address) {
        return
    }
    const accounts = get(get(wallet).accounts)
    return accounts.find((acc) => acc.addresses.some((add) => address === add.address))
}

/**
 * Find an address in one of our accounts
 * @param addresses The addresses to find
 * @param excludeFirst A wallet to exclude on first pass
 * @returns The wallet account matching the address or undefined if not found
 */
export const findAccountWithAnyAddress = (addresses: string[], excludeFirst?: WalletAccount): WalletAccount | undefined => {
    if (!addresses || addresses.length === 0) {
        return
    }
    let accounts = get(get(wallet).accounts)

    let res = accounts.filter((acc) => acc.addresses.some((add) => addresses.includes(add.address)))

    if (res.length > 0) {
        if (excludeFirst) {
            const initialLen = res.length
            res = res.filter(a => a.id !== excludeFirst.id)
            // If the length changed we removed it, so put it back
            // at the end
            if (res.length !== initialLen) {
                res.push(excludeFirst)
            }
        }

        if (res.length > 0) {
            return res[0]
        }
    }
}
