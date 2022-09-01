import { localize } from '@core/i18n'
import { displayErrorEventToUser } from '@lib/errors'
import { setProfileAccount } from 'shared/lib/profile'

import type {
    ErrorEventPayload,
    Event,
    GeneratingRemainderDepositAddressEvent,
    PreparedTransactionEvent,
    TransactionEventData,
    TransferProgressEventData,
    TransferState,
} from 'shared/lib/typings/events'
import { Payload } from 'shared/lib/typings/message'
import { formatUnitBestMatch } from 'shared/lib/units'
import { derived, get, Writable, writable } from 'svelte/store'
import { mnemonic } from './app'
import { convertToFiat, currencies, exchangeRates, formatCurrency } from './currency'
import { deepCopy } from './helpers'
import { didInitialiseMigrationListeners } from './migration'
import { buildClientOptions, getDefaultClientOptions } from './network'
import { showAppNotification } from './notifications'
// PARTICIPATION
import { Platform } from './platform'
import { activeProfile, updateProfile } from './profile'
import { WALLET, WalletApi } from './shell/walletApi'
import { Account, AccountMetadata, AccountSyncOptions, Balance, SignerType, SyncedAccount } from './typings/account'
import { Address } from './typings/address'
import { IActorHandler } from './typings/bridge'
import { CurrencyTypes } from './typings/currency'
import { HistoryDataProps, PriceData } from './typings/market'
import { Message } from './typings/message'
import { RecoveryPhrase } from './typings/mnemonic'
import { NodeAuth, NodeInfo } from './typings/node'
import { ProfileType } from './typings/profile'
import { SetupType } from './typings/setup'
import { AccountMessage, BalanceHistory, BalanceOverview, WalletAccount, WalletState } from './typings/wallet'
import { IWalletApi } from './typings/walletApi'

export const haveStakingResultsCached = writable<boolean>(null)

export const MAX_ACCOUNT_NAME_LENGTH = 20
export const MAX_PASSWORD_LENGTH = 256

/**
 * A number representing the threshold for what is considered dust, which is 1Mi or 1,000,000i.
 */
export const DUST_THRESHOLD: number = 1_000_000

// Setting to 0 removes auto lock. We must lock Stronghold manually.
export const STRONGHOLD_PASSWORD_CLEAR_INTERVAL_SECS = 0

export const WALLET_STORAGE_DIRECTORY = '__storage__'

interface ActorState {
    [id: string]: IActorHandler
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
    }>({}),
})

export const resetWallet = (): void => {
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
    setSelectedAccount(null)
    selectedMessage.set(null)
    isTransferring.set(false)
    transferState.set(null)
    hasGeneratedALedgerReceiveAddress.set(false)
    isSyncing.set(null)
    accountSyncingQueueStore.set(null)
    isFirstSessionSync.set(true)
    isFirstManualSync.set(true)
    isBackgroundSyncing.set(false)
    walletSetupType.set(null)
    haveStakingResultsCached.set(null)
}

// Created to help selectedAccount reactivity.
// Use it to detected switches on selectedAccount
export const selectedAccountIdStore = writable<string | null>(null)

export const selectedAccountStore = derived(
    [selectedAccountIdStore, get(wallet).accounts],
    ([$selectedAccountId, $accounts]) => $accounts.find((acc) => acc.id === $selectedAccountId)
)
export const setSelectedAccount = (id: string): void => selectedAccountIdStore.set(id)

export const walletSetupType = writable<SetupType>(null)
export const selectedMessage = writable<Message | null>(null)

export const isTransferring = writable<boolean>(false)
export const transferState = writable<TransferState | null>(null)

export const hasGeneratedALedgerReceiveAddress = writable<boolean | null>(false)

export const isSyncing = writable<boolean>(false)
export const isFirstSessionSync = writable<boolean>(true)
export const isFirstManualSync = writable<boolean>(true)
export const isBackgroundSyncing = writable<boolean>(false)

export const accountSyncingQueueStore = writable<WalletAccount[] | null>(null)
export const currentSyncingAccountStore = writable<WalletAccount>(null)

export const api: IWalletApi = new Proxy(
    { ...WalletApi },
    {
        get: (target, propKey) => {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const _handleCallbackError = (err: any) => {
                const title = `Callback Error ${propKey.toString()}`

                console.error(title, err)
                void Platform.unhandledException(title, { message: err?.message, stack: err?.stack })
            }

            /* eslint-disable @typescript-eslint/no-explicit-any */
            const _handleCallbackResult = (args: any[], idx: number, result: 'onSuccess' | 'onError'): any[] => {
                const originalResultFn = args[idx][result]

                args[idx][result] = (payload) => {
                    try {
                        originalResultFn(payload)
                    } catch (err) {
                        _handleCallbackError(err)
                    }
                }

                return args
            }

            const originalMethod = target[propKey]

            return (...args) => {
                for (let i = args.length - 1; i >= 0; i--) {
                    if (args[i]?.onSuccess) {
                        args = _handleCallbackResult(args, i, 'onSuccess')
                    } else if (args[i]?.onError) {
                        args = _handleCallbackResult(args, i, 'onError')
                    }
                }

                return originalMethod?.apply(target, args)
            }
        },
    }
)

export const getWalletDataPath = async (): Promise<string> => {
    const appPath = await Platform.getUserDataPath()
    return `${appPath}/${WALLET_STORAGE_DIRECTORY}/`
}

export const getProfileDataPath = async (id: string): Promise<string> => {
    const walletPath = await getWalletDataPath()
    return `${walletPath}${id}`
}

/**
 * Initialise the actor system with the Rust wallet.rs bindings.
 *
 * @method initialise
 *
 * @param {string} id The identifier to use for the wallet actor system.
 * @param {string} storagePath The storage directory to use for profile data.
 * @param {boolean} sendCrashReports Determines whether crash reports should be sent from the wallet actor.
 * @param {string} machineId Machine ID for crash reporting
 *
 * CAUTION: Only use the app settings from startup as the wallet actor is initialized dynamically while the
 * Electron app is not.
 */
export const initialise = (id: string, storagePath: string, sendCrashReports: boolean, machineId: string): void => {
    if (Object.keys(actors).length > 0) {
        console.error('Initialise called when another actor already initialised')
    }

    actors[id] = WALLET.init(id, storagePath, sendCrashReports, machineId)
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
    didInitialiseMigrationListeners.set(false)
    actors[id].removeEventListeners()
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
export const generateRecoveryPhrase = (): Promise<RecoveryPhrase> =>
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

export const requestMnemonic = async (): Promise<RecoveryPhrase> => {
    const recoveryPhrase = await generateRecoveryPhrase()
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
export const asyncGetLegacySeedChecksum = (seed: string): Promise<string> =>
    new Promise<string>((resolve, reject) => {
        api.getLegacySeedChecksum(seed, {
            onSuccess(response) {
                resolve(response.payload)
            },
            onError(err) {
                reject(err)
            },
        })
    })

export const asyncSetStrongholdPassword = (password: string): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        api.setStrongholdPassword(password, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })

export const asyncChangeStrongholdPassword = (currentPassword: string, newPassword: string): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        api.changeStrongholdPassword(currentPassword, newPassword, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })

export const asyncStoreMnemonic = (mnemonic: string): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        api.storeMnemonic(mnemonic, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })

export const asyncVerifyMnemonic = (mnemonic: string): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        api.verifyMnemonic(mnemonic, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })

export const asyncBackup = (dest: string, password: string): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        api.backup(dest, password, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })

export const asyncSetStoragePassword = (password: string): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        api.setStoragePassword(password, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })

export const asyncRestoreBackup = (importFilePath: string, password: string): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        api.restoreBackup(importFilePath, password, {
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })

export const asyncCreateAccount = (alias?: string, color?: string): Promise<WalletAccount> =>
    new Promise<WalletAccount>((resolve, reject) => {
        const accounts = get(get(wallet)?.accounts)
        api.createAccount(
            {
                alias: alias || `${localize('general.account')} ${accounts.length + 1}`,
                signerType: getSignerType(get(activeProfile)?.type),
                clientOptions: accounts.length
                    ? accounts[0]?.clientOptions
                    : buildClientOptions(get(activeProfile)?.settings.networkConfig),
            },
            {
                onSuccess(response) {
                    const preparedAccount = formatAccountWithMetadata(response.payload, {
                        balance: 0,
                        incoming: 0,
                        outgoing: 0,
                        depositAddress: response.payload.addresses[0].address,
                    })
                    get(wallet)?.accounts.update((_accounts) => [..._accounts, preparedAccount])

                    setProfileAccount(get(activeProfile), { id: preparedAccount.id, color })

                    resolve(preparedAccount)
                },
                onError(err) {
                    reject(err)
                },
            }
        )
    })

const getSignerType = (profileType: ProfileType): SignerType | undefined => {
    if (!profileType) return undefined

    switch (profileType) {
        case ProfileType.Software:
            return { type: 'Stronghold' }
        case ProfileType.Ledger:
            return { type: 'LedgerNano' }
        case ProfileType.LedgerSimulator:
            return { type: 'LedgerNanoSimulator' }
    }
}

export const asyncRemoveWalletAccount = (accountId: string): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        api.removeAccount(accountId, {
            onSuccess() {
                /**
                 * CAUTION: If an account is successfully removed in wallet.rs then it should also be
                 * removed in the Firefly store. This is "inefficient" (esp. for batch deletes) but it
                 * at least ensures data integrity / consistency between Firefly and the backend.
                 */
                get(wallet).accounts.update((_accounts) => _accounts.filter((wa) => wa.id !== accountId))

                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })

export const asyncRemoveWalletAccounts = (accountIds: string[]): Promise<void[]> =>
    Promise.all(accountIds.map((id) => asyncRemoveWalletAccount(id)))

export const asyncDeleteStorage = (): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        api.deleteStorage({
            onSuccess() {
                resolve()
            },
            onError(err) {
                reject(err)
            },
        })
    })

export function initializeAccountSyncingQueue(): void {
    const accounts = get(get(wallet).accounts)
    if (!accounts || accounts.length <= 0) return

    const selectedAccount = get(selectedAccountStore)
    if (!selectedAccount) return

    accountSyncingQueueStore.set([selectedAccount, ...accounts.filter((account) => account.id !== selectedAccount.id)])
}

export function updateAccountSyncingQueue(account: WalletAccount): void {
    const accountSyncingQueue = get(accountSyncingQueueStore)
    if (!account || !accountSyncingQueue) return

    // It can be assumed that if the account is not currently in the queue then it has already been synced.
    const isAccountInSyncingQueue = accountSyncingQueue?.some((_account) => _account.id === account.id)
    if (!isAccountInSyncingQueue) return

    // If the account is already first in the queue then no need to update the queue.
    const accountIndexInSyncingQueue = get(accountSyncingQueueStore).findIndex((_account) => _account.id === account.id)
    if (accountIndexInSyncingQueue === 0) return

    accountSyncingQueueStore.update((accountSyncingQueue) =>
        accountSyncingQueue.sort((a: WalletAccount, b: WalletAccount) =>
            a.id === account.id ? -1 : b.id === account.id ? 1 : 0
        )
    )
}

export async function processAccountSyncingQueue(): Promise<void> {
    const accountSyncingQueue = get(accountSyncingQueueStore)
    if (!accountSyncingQueue || accountSyncingQueue.length <= 0) return

    try {
        if (get(currentSyncingAccountStore)) return

        const accountToSync = accountSyncingQueue.shift()
        currentSyncingAccountStore.set(accountToSync)

        await asyncSyncAccount(accountToSync)

        currentSyncingAccountStore.set(null)
        accountSyncingQueueStore.set(accountSyncingQueue)
    } catch (err) {
        console.error(err)
    }
}

export function asyncSyncAccount(account: WalletAccount, showErrorNotification: boolean = true): Promise<void> {
    return new Promise((resolve, reject) => {
        currentSyncingAccountStore.set(account)

        const { gapLimit } = getAccountSyncOptions()

        api.syncAccount(
            account.id,
            { gapLimit },
            {
                onSuccess(response: Event<SyncedAccount>) {
                    const syncedAccount = response.payload
                    processMigratedTransactions(syncedAccount.id, syncedAccount.messages, syncedAccount.addresses)

                    void updateAccount(get(wallet).accounts, syncedAccount)
                        .then(() => {
                            currentSyncingAccountStore.set(null)
                        })
                        .catch((err) => {
                            currentSyncingAccountStore.set(null)

                            console.error(err)
                            reject(err)
                        })

                    resolve()
                },
                onError(err: ErrorEventPayload) {
                    currentSyncingAccountStore.set(null)

                    if (showErrorNotification) {
                        displayErrorEventToUser(err)
                    }

                    console.error(err)
                    reject(err)
                },
            }
        )
    })
}

export const asyncSyncAccounts = (
    addressIndex?: number,
    gapLimit?: number,
    accountDiscoveryThreshold?: number,
    showErrorNotification = true
): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        isSyncing.set(true)

        api.syncAccounts(addressIndex, gapLimit, accountDiscoveryThreshold, {
            onSuccess(response: Event<SyncedAccount[]>) {
                const syncedAccounts = response.payload

                syncedAccounts.forEach((account) => {
                    processMigratedTransactions(account.id, account.messages, account.addresses)
                })

                void updateAccounts(syncedAccounts)
                    .then(() => {
                        isSyncing.set(false)
                    })
                    .catch((err) => {
                        isSyncing.set(false)

                        console.error(err)
                        reject(err)
                    })

                resolve()
            },
            onError(err: ErrorEventPayload) {
                isSyncing.set(false)

                if (showErrorNotification) {
                    displayErrorEventToUser(err)
                }

                console.error(err)
                reject(err)
            },
        })
    })

export function asyncSetAlias(accountId: string, alias: string): Promise<void> {
    if (!accountId || !alias) return

    return new Promise((resolve, reject) => {
        api.setAlias(accountId, alias, {
            onSuccess(response: Event<void>) {
                resolve()
            },
            onError(err: ErrorEventPayload) {
                console.error(err)
                reject(err)
            },
        })
    })
}

export const asyncGetNodeInfo = (accountId: string, url?: string, auth?: NodeAuth): Promise<NodeInfo> => {
    if (!url || (!url && !auth)) {
        const node = get(activeProfile)?.settings?.networkConfig?.nodes.find((n) => n.isPrimary)

        url = node?.url
        auth = node?.auth
    }

    return new Promise<NodeInfo>((resolve, reject) => {
        api.getNodeInfo(accountId, url, auth, {
            onSuccess(response) {
                resolve(response.payload)
            },
            onError(err) {
                reject(err)
            },
        })
    })
}

export const asyncStopBackgroundSync = (): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        api.stopBackgroundSync({
            onSuccess() {
                isBackgroundSyncing.set(false)
                resolve()
            },
            onError(err) {
                showAppNotification({
                    type: 'error',
                    message: localize('error.global.generic'),
                })
                reject()
            },
        })
    })

/**
 * NOTE: This method mutates account object
 * Creates a message pair for internal messages and adds it to the account messages
 */
export function aggregateAccountActivity(account: Account): void {
    // Only keep messages with a payload
    account.messages = account.messages.filter((m) => m.payload)

    // The wallet only returns one side of internal transfers
    // to the same account, so create the other side by first finding
    // the internal messages
    const internalMessages = account.messages.filter((m) => getInternalFlag(m.payload))

    for (const internalMessage of internalMessages) {
        // Check if the message sends to another address in the same account
        const isSelf = isSelfTransaction(internalMessage.payload, account)

        if (isSelf && !isParticipationPayload(internalMessage.payload)) {
            // It's a transfer between two addresses in the same account
            // Try and find the other side of the pair where the message id
            // would be the same and the incoming flag the opposite
            const internalIncoming = getIncomingFlag(internalMessage.payload)
            let pair: Message = internalMessages.find(
                (m) => m.id === internalMessage.id && getIncomingFlag(m.payload) !== internalIncoming
            )

            // Can't find the other side of the pair so clone the original
            // reverse its incoming flag and store it
            if (!pair) {
                pair = deepCopy(internalMessage) as Message
                // Reverse the incoming flag for the other side of the pair
                setIncomingFlag(pair.payload, !getIncomingFlag(pair.payload))
                account.messages.push(pair)
            }
        }
    }
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

    accounts.update((storedAccounts) =>
        storedAccounts.map((storedAccount: WalletAccount) => {
            if (storedAccount.id === accountId) {
                const hasMessage = storedAccount.messages.some(
                    (m) => m.id === message.id && getIncomingFlag(m.payload) === messageIncoming
                )

                if (!hasMessage) {
                    storedAccount.messages.push(message)
                }
            }

            return storedAccount
        })
    )
}

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

    accounts.update((storedAccounts) =>
        storedAccounts.map((storedAccount: WalletAccount) => {
            if (storedAccount.id === accountId) {
                return Object.assign<WalletAccount, Partial<WalletAccount>, Partial<WalletAccount>>(
                    {} as WalletAccount,
                    storedAccount,
                    {
                        messages: storedAccount.messages.map((_message) => {
                            if (_message.id === messageId && getIncomingFlag(_message.payload) === messageIncoming) {
                                return newMessage
                            }

                            return _message
                        }),
                    }
                )
            }

            return storedAccount
        })
    )
}

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
    } = {}

    account.messages.forEach((message) => {
        let extraId = ''
        if (message.payload?.type === 'Transaction') {
            extraId = getIncomingFlag(message.payload) ? 'in' : 'out'
        }
        messages[message.id + extraId] = {
            ...message,
            account: account.index,
        }
    })

    return Object.values(messages).sort((a, b) => {
        if (a.id === b.id && a.payload?.type == 'Transaction') {
            return getIncomingFlag(a.payload) ? -1 : 1
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
}

/**
 * Updates the balance overview store.
 */
export const updateBalanceOverview = (balance: number, incoming: number, outgoing: number): void => {
    const balanceOverviewStore = get(wallet).balanceOverview
    if (!balanceOverviewStore) return

    const activeCurrency = get(activeProfile)?.settings.currency ?? CurrencyTypes.USD

    balanceOverviewStore.update((overview) =>
        Object.assign<BalanceOverview, BalanceOverview, Partial<BalanceOverview>>({} as BalanceOverview, overview, {
            incoming: formatUnitBestMatch(incoming, true, 3),
            incomingRaw: incoming,
            outgoing: formatUnitBestMatch(outgoing, true, 3),
            outgoingRaw: outgoing,
            balance: formatUnitBestMatch(balance, true, 3),
            balanceRaw: balance,
            balanceFiat: formatCurrency(
                convertToFiat(balance, get(currencies)[CurrencyTypes.USD], get(exchangeRates)[activeCurrency])
            ),
        })
    )
}

/**
 * Refreshes the balance overview store by updating it with its current values.
 */
export const refreshBalanceOverview = (): void => {
    const { balanceOverview } = get(wallet)
    const bo = get(balanceOverview)
    updateBalanceOverview(bo.balanceRaw, bo.incomingRaw, bo.outgoingRaw)
}

function combineAccountAddresses(oldAccountAddresses: Address[], newAccountAddresses: Address[]): Address[] {
    const combinedAccountAddresses: Address[] = oldAccountAddresses

    for (const newAccountAddress of newAccountAddresses) {
        const addressIndex = oldAccountAddresses.findIndex(
            (oldAccountAddress) => oldAccountAddress.address === newAccountAddress.address
        )
        if (addressIndex < 0) {
            combinedAccountAddresses.push(newAccountAddress)
        } else {
            combinedAccountAddresses[addressIndex] = newAccountAddress
        }
    }

    return combinedAccountAddresses
}

function combineAccountMessages(oldAccountMessages: Message[], newAccountMessages: Message[]): Message[] {
    const combinedAccountMessages: Message[] = oldAccountMessages

    for (const message of newAccountMessages) {
        const messageIndex = newAccountMessages.findIndex(
            (m) => m.id === message.id && getIncomingFlag(m.payload) === getIncomingFlag(message.payload)
        )
        if (messageIndex < 0) {
            combinedAccountMessages.push(message)
        } else {
            combinedAccountMessages[messageIndex] = message
        }
    }

    return combinedAccountMessages
}

function updateStoredAccount(
    accountsStore: Writable<WalletAccount[]>,
    storedAccount: WalletAccount,
    syncedAccount: SyncedAccount
): void {
    if (!accountsStore || !get(accountsStore) || !storedAccount || !syncedAccount) return

    const newAccount = <WalletAccount>{}

    newAccount.depositAddress = syncedAccount.depositAddress.address
    newAccount.addresses = combineAccountAddresses(storedAccount.addresses, syncedAccount.addresses)
    newAccount.messages = combineAccountMessages(storedAccount.messages, syncedAccount.messages)

    accountsStore.update((accounts) =>
        accounts.map((account) => (account.id === storedAccount.id ? { ...account, ...newAccount } : account))
    )
}

async function updateNewAccount(accountsStore: Writable<WalletAccount[]>, syncedAccount: SyncedAccount): Promise<void> {
    const accounts = get(accountsStore)
    if (!accountsStore || !accounts || accounts.length <= 0 || !syncedAccount) return

    const accountMetadata = await asyncGetAccountMetadata(syncedAccount.id)
    const newAccount = formatAccountWithMetadata(
        Object.assign<WalletAccount, SyncedAccount, Partial<WalletAccount>>({} as WalletAccount, syncedAccount, {
            alias: `${localize('general.account')} ${syncedAccount.index + 1}`,
            clientOptions: getDefaultClientOptions(),
            createdAt: new Date().toISOString(),
            signerType: accounts[0]?.signerType,
            depositAddress: syncedAccount.depositAddress.address,
        }),
        accountMetadata
    )

    await asyncSetAlias(newAccount?.id, newAccount?.alias)

    accountsStore.update((_accounts) => _accounts.concat([newAccount]))
}

/**
 * Updates the accounts store with data from a freshly synced account.
 */
export async function updateAccount(
    accountsStore: Writable<WalletAccount[]>,
    syncedAccount: SyncedAccount
): Promise<void> {
    if (!accountsStore || !get(accountsStore) || !syncedAccount) return

    const accountToUpdate = get(accountsStore).find((a) => a.id === syncedAccount.id)
    if (accountToUpdate) {
        updateStoredAccount(accountsStore, accountToUpdate, syncedAccount)
    } else {
        await updateNewAccount(accountsStore, syncedAccount)
    }
}

/**
 * Updates the accounts store with data from freshly synced accounts.
 */
export async function updateAccounts(syncedAccounts: SyncedAccount[]): Promise<void[]> {
    if (!syncedAccounts || syncedAccounts.length <= 0) return

    const { accounts } = get(wallet)
    if (!accounts) return

    const totalBalanceOverview = <BalanceOverview>{ balanceRaw: 0, incomingRaw: 0, outgoingRaw: 0 }
    await Promise.all(
        syncedAccounts.map(async (syncedAccount) => {
            const accountMetadata = await asyncGetAccountMetadata(syncedAccount.id)
            totalBalanceOverview.balanceRaw += accountMetadata.balance
            totalBalanceOverview.incomingRaw += accountMetadata.incoming
            totalBalanceOverview.outgoingRaw += accountMetadata.outgoing

            return updateAccount(accounts, syncedAccount)
        })
    )
    updateBalanceOverview(
        totalBalanceOverview.balanceRaw,
        totalBalanceOverview.incomingRaw,
        totalBalanceOverview.outgoingRaw
    )
}

/**
 * Updates an account balance with fiat conversions.
 */
export const updateAccountsBalanceEquiv = (): void => {
    const { accounts } = get(wallet)

    const activeCurrency = get(activeProfile)?.settings.currency ?? CurrencyTypes.USD

    accounts.update((storedAccounts) => {
        for (const storedAccount of storedAccounts) {
            storedAccount.balance = formatUnitBestMatch(storedAccount.rawIotaBalance, true, 3)
            storedAccount.balanceEquiv = formatCurrency(
                convertToFiat(
                    storedAccount.rawIotaBalance,
                    get(currencies)[CurrencyTypes.USD],
                    get(exchangeRates)[activeCurrency]
                )
            )
        }
        return storedAccounts
    })
}

/**
 * Gets balance history for each account in market data timestamps.
 */
export const getAccountBalanceHistory = (account: WalletAccount, priceData: PriceData): BalanceHistory => {
    const balanceHistory: BalanceHistory = {
        [HistoryDataProps.ONE_HOUR]: [],
        [HistoryDataProps.TWENTY_FOUR_HOURS]: [],
        [HistoryDataProps.SEVEN_DAYS]: [],
        [HistoryDataProps.ONE_MONTH]: [],
    }
    if (priceData) {
        const messages: Message[] =
            account?.messages
                ?.slice()
                ?.filter((message) => message.payload && !isSelfTransaction(message.payload, account)) // Remove self transactions and messages with no payload
                ?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) ?? [] // Sort messages from last to newest
        // Calculate the variations for each account
        let trackedBalance = account.rawIotaBalance
        const accountBalanceVariations = [{ balance: trackedBalance, timestamp: new Date().toString() }]
        messages.forEach((message) => {
            const essence = message.payload.type === 'Transaction' && message.payload.data.essence.data

            if (essence && essence.incoming) {
                trackedBalance -= essence.value || 0
            } else {
                trackedBalance += essence.value || 0
            }
            accountBalanceVariations.push({ balance: trackedBalance, timestamp: message.timestamp })
        })
        // Calculate the balance in each market data timestamp
        let balanceHistoryInTimeframe = []
        Object.entries(priceData[CurrencyTypes.USD]).forEach(([timeframe, data]) => {
            // sort market data from newest to last
            const sortedData = data.slice().sort((a, b) => b[0] - a[0])
            balanceHistoryInTimeframe = []
            // if there are no balance variations
            if (accountBalanceVariations.length === 1) {
                balanceHistoryInTimeframe = sortedData.map((_data) => ({
                    timestamp: _data[0],
                    balance: trackedBalance,
                }))
            } else {
                let i = 0
                sortedData.forEach((data) => {
                    const marketTimestamp = new Date(data[0] * 1000).getTime()
                    // find balance for each market data timepstamp
                    for (i; i < accountBalanceVariations.length - 1; i++) {
                        const currentBalanceTimestamp = new Date(accountBalanceVariations[i].timestamp).getTime()
                        const nextBalanceTimestamp = new Date(accountBalanceVariations[i + 1].timestamp).getTime()
                        if (marketTimestamp > nextBalanceTimestamp && marketTimestamp <= currentBalanceTimestamp) {
                            balanceHistoryInTimeframe.push({
                                timestamp: data[0],
                                balance: accountBalanceVariations[i].balance,
                            })
                            return
                        } else if (
                            marketTimestamp <= nextBalanceTimestamp &&
                            i === accountBalanceVariations.length - 2
                        ) {
                            balanceHistoryInTimeframe.push({ timestamp: data[0], balance: 0 })
                            return
                        }
                    }
                })
            }
            balanceHistory[timeframe] = balanceHistoryInTimeframe.reverse()
        })
    }
    return balanceHistory
}

/**
 * Retrieves the list of accounts belonging to a profile.
 */
export function asyncGetAccounts(): Promise<Account[]> {
    return new Promise((resolve, reject) => {
        api.getAccounts({
            onSuccess(response: Event<Account[]>) {
                resolve(response.payload)
            },
            onError(err) {
                console.error(err)
                reject(err)
            },
        })
    })
}

/**
 * Retrieves the metadata (i.e. balance information and deposit address) from an account.
 */
export function asyncGetAccountMetadata(accountId: string): Promise<AccountMetadata> {
    return new Promise((resolve, reject) => {
        api.getBalance(accountId, {
            onSuccess(balanceResponse: Event<Balance>) {
                api.latestAddress(accountId, {
                    onSuccess(latestAddressResponse: Event<Address>) {
                        resolve({
                            balance: balanceResponse.payload.total,
                            incoming: balanceResponse.payload.incoming,
                            outgoing: balanceResponse.payload.outgoing,
                            depositAddress: latestAddressResponse.payload.address,
                        })
                    },
                    onError(err: ErrorEventPayload) {
                        reject(err)
                    },
                })
            },
            onError(err: ErrorEventPayload) {
                reject(err)
            },
        })
    })
}

export const getAccountMetadataWithCallback = (
    accountId: string,
    callback: (error: ErrorEventPayload, metadata?: AccountMetadata) => void
): void => {
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

// process migration transactions
// aggregate messages pairs / transactions
// prepare as WalletAccount
// update specific account in the store
// update the balance overview accordingly
// begin account sync

export async function processLoadedAccounts(accounts: Account[]): Promise<void> {
    if (!accounts || accounts.length <= 0) return

    const accountsStore = get(wallet).accounts
    if (!accountsStore || !get(accountsStore)) return

    const totalBalanceOverview = <BalanceOverview>{ balanceRaw: 0, incomingRaw: 0, outgoingRaw: 0 }
    await Promise.all(
        accounts.map(async (account) => {
            aggregateAccountActivity(account)
            processMigratedTransactions(account.id, account.messages, account.addresses)

            const accountMetadata = await asyncGetAccountMetadata(account.id)
            const preparedAccount = formatAccountWithMetadata(account, accountMetadata)
            // we first need to check if the store is already populated with this account
            const indexExistingAccountInStore = get(accountsStore).findIndex(
                (_account) => _account.id === preparedAccount.id
            )
            if (indexExistingAccountInStore !== -1) {
                accountsStore.update((_accounts) => _accounts.splice(indexExistingAccountInStore, 1, preparedAccount))
            } else {
                accountsStore.update((_accounts) => _accounts.concat([preparedAccount]))
            }
            totalBalanceOverview.balanceRaw += accountMetadata.balance
            totalBalanceOverview.incomingRaw += accountMetadata.incoming
            totalBalanceOverview.outgoingRaw += accountMetadata.outgoing
        })
    )
    updateBalanceOverview(
        totalBalanceOverview.balanceRaw,
        totalBalanceOverview.incomingRaw,
        totalBalanceOverview.outgoingRaw
    )
}

/**
 * Prepares a base account object with extra metadata.
 */
export const formatAccountWithMetadata = (account: Account, meta: AccountMetadata): WalletAccount => {
    const { id, index, alias, signerType } = account
    const { balance, depositAddress } = meta

    const activeCurrency = get(activeProfile)?.settings.currency ?? CurrencyTypes.USD

    return Object.assign<WalletAccount, Account, Partial<WalletAccount>>({} as WalletAccount, account, {
        id,
        index,
        depositAddress,
        alias,
        rawIotaBalance: balance,
        signerType,
        balance: formatUnitBestMatch(balance, true, 3),
        balanceEquiv: formatCurrency(
            convertToFiat(balance, get(currencies)[CurrencyTypes.USD], get(exchangeRates)[activeCurrency])
        ),
    })
}

export const processMigratedTransactions = (accountId: string, messages: Message[], addresses: Address[]): void => {
    const { accounts } = get(wallet)
    const _activeProfile = get(activeProfile)
    // Patch: in mobile we have a race condition where get(accounts) is not yet populated, so we also look into active profile
    const _accounts = get(accounts) ?? _activeProfile?.accounts ?? []
    const account = _accounts?.find((account) => account.id === accountId)
    messages.forEach((message: Message) => {
        if (message.payload?.type === 'Milestone') {
            if (account) {
                if (
                    _activeProfile &&
                    _activeProfile.migratedTransactions &&
                    _activeProfile.migratedTransactions.length
                ) {
                    const { funds } = message.payload.data.essence.receipt.data

                    const tailTransactionHashes = funds.map((fund) => fund.tailTransactionHash)

                    const updatedMigratedTransactions = _activeProfile.migratedTransactions.filter(
                        (transaction) => !tailTransactionHashes.includes(transaction.tailTransactionHash)
                    )
                    updateProfile('migratedTransactions', updatedMigratedTransactions)
                }
            }
        }
    })

    if (_activeProfile?.migratedTransactions && _activeProfile?.migratedTransactions.length) {
        // For pre-snapshot migrations, there will be no messages
        addresses.forEach((address) => {
            const { outputs } = address

            if (Object.values(outputs).some((output) => output.messageId === '0'.repeat(64))) {
                updateProfile('migratedTransactions', [])
            }
        })
    }
}

/**
 * Gets indexation string
 *
 * @method getIndexationString
 *
 * @param {Payload} payload
 *
 * @returns {undefined | string}
 */
export const getIndexationString = (payload: Payload): string | undefined => {
    if (payload && payload.type === 'Transaction') {
        const indexationPayload = payload.data.essence.data.payload?.data
        if (!indexationPayload) return undefined

        return String.fromCharCode(...indexationPayload?.index)
    }
}

/**
 * Checks if indexation string corresponds to participation
 *
 * @method isParticipationPayload
 *
 * @param {Payload} payload
 *
 * @returns {boolean}
 */
export const isParticipationPayload = (payload: Payload): boolean => getIndexationString(payload) === 'PARTICIPATE'

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
    const accountAddresses = account?.addresses?.map((add) => add.address) ?? []
    if (payload && accountAddresses.length) {
        const getReceiverAddresses = () => {
            if (payload.type === 'Transaction') {
                return receiverAddressesFromTransactionPayload(payload)
            } else if (payload.type === 'Milestone') {
                return receiverAddressesFromMilestonePayload(payload)
            }

            return null
        }

        const senderAddress: string = sendAddressFromTransactionPayload(payload)

        const receiverAddresses: string[] = getReceiverAddresses()

        const transactionAddresses = [senderAddress, ...receiverAddresses]
        return (
            senderAddress &&
            receiverAddresses.length &&
            transactionAddresses.every((txAddress) => accountAddresses.indexOf(txAddress) !== -1)
        )
    }
    return false
}

/**
 * Get the sender address from a transaction payload.
 */
export const sendAddressFromTransactionPayload = (payload: Payload): string => {
    if (payload?.type === 'Transaction') {
        return (
            payload?.data?.essence?.data?.inputs?.find((input) => /utxo/i.test(input?.type))?.data?.metadata?.address ??
            null
        )
    }

    return null
}

/**
 * Get the receiver addresses from a transaction payload.
 */
export const receiverAddressesFromTransactionPayload = (payload: Payload): string[] => {
    if (payload?.type === 'Transaction') {
        return payload?.data?.essence?.data?.outputs?.map((output) => output?.data?.address) ?? []
    }

    return []
}

/**
 * Get the receiver addresses from a milestone payload.
 */
export const receiverAddressesFromMilestonePayload = (payload: Payload): string[] => {
    if (payload?.type === 'Milestone') {
        return payload?.data?.essence?.receipt?.data?.funds?.map((receiptFunds) => receiptFunds?.output?.address) ?? []
    }

    return []
}

/**
 * Get the value of a milestone message
 * @returns
 */
export const getMilestoneMessageValue = (payload: Payload, accounts: WalletAccount[]): number => {
    if (payload?.type === 'Milestone') {
        const { funds } = payload.data.essence.receipt.data

        const addresses = []

        accounts.forEach((account) => {
            account.addresses.forEach((address) => addresses.push(address.address))
        })

        const totalValue = funds
            .filter((fund) => addresses.includes(fund.output.address))
            .reduce((acc, fund) => acc + fund.output.amount, 0)

        return totalValue
    }

    return 0
}

/**
 * Get incoming flag from message
 * @returns
 */
export const getIncomingFlag = (payload: Payload): boolean | undefined => {
    if (payload?.type === 'Transaction') {
        return payload.data.essence.data.incoming
    }

    return undefined
}

/**
 * Set incoming flag on the message
 * @returns
 */
export const setIncomingFlag = (payload: Payload, incoming: boolean): void => {
    if (payload?.type === 'Transaction') {
        payload.data.essence.data.incoming = incoming
    }
}

/**
 * Get internal flag from message
 * @returns
 */
export const getInternalFlag = (payload: Payload): boolean | undefined => {
    if (payload?.type === 'Transaction') {
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
export const findAccountWithAnyAddress = (
    addresses: string[],
    excludeFirst?: WalletAccount
): WalletAccount | undefined => {
    if (!addresses || addresses.length === 0) {
        return
    }
    const accounts = get(get(wallet).accounts)

    let res = accounts.filter((acc) => acc.addresses.some((add) => addresses.includes(add.address)))

    if (res.length > 0) {
        if (excludeFirst) {
            const initialLen = res.length
            res = res.filter((a) => a.id !== excludeFirst.id)
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

/**
 * Get the sync options for an account
 * @param {boolean} isManualSync A boolean value indicating if a user (via the UI) invoked this function
 * @returns {AccountSyncOptions} The sync options for an account, which contains data for the gap limit and account discovery threshold
 */
export const getAccountSyncOptions = (isManualSync: boolean = false): AccountSyncOptions =>
    isInitialAccountSync()
        ? calculateInitialAccountSyncOptions(get(walletSetupType))
        : calculateRegularAccountSyncOptions(get(activeProfile).type, isManualSync)

/**
 * Determines if the API call for syncing accounts is the initial one
 * @returns {boolean} The boolean value determining if this sync API call is the first ever one
 */
export const isInitialAccountSync = (): boolean => get(walletSetupType) !== null && get(isFirstSessionSync)

const calculateInitialAccountSyncOptions = (setupType: SetupType): AccountSyncOptions => {
    let gapLimit = 1
    let accountDiscoveryThreshold = 0

    switch (setupType) {
        case SetupType.Import:
        case SetupType.Mnemonic:
        case SetupType.Stronghold:
            gapLimit = 25
            accountDiscoveryThreshold = 2
            break
        case SetupType.FireflyLedger:
            gapLimit = 10
            accountDiscoveryThreshold = 2
            break
    }

    return { gapLimit, accountDiscoveryThreshold }
}

const calculateRegularAccountSyncOptions = (profileType: ProfileType, isManualSync: boolean): AccountSyncOptions => {
    let gapLimit = 1
    let accountDiscoveryThreshold = 0
    const _isFirstSessionSync = get(isFirstSessionSync)

    switch (profileType) {
        case ProfileType.Software:
            gapLimit = _isFirstSessionSync ? 10 : 1
            break
        case ProfileType.Ledger:
        case ProfileType.LedgerSimulator:
        default:
            gapLimit = 0
            break
    }

    accountDiscoveryThreshold = isManualSync && _isFirstSessionSync ? 1 : 0

    return { gapLimit, accountDiscoveryThreshold }
}

/**
 * Determines whether an account has any pending transactions.
 *
 * @method hasPendingTransactions
 *
 * @param {WalletAccount} account
 *
 * @returns {boolean}
 */
export const hasPendingTransactions = (account: WalletAccount): boolean => {
    if (!account) return false

    return account?.messages.some((m) => !m.confirmed)
}

/**
 * Determines whether an account has any valid pending transactions i.e. transactions that can confirm.
 *
 * @method hasValidPendingTransactions
 *
 * @param {WalletAccount} account
 *
 * @returns {boolean}
 */
export const hasValidPendingTransactions = (account: WalletAccount): boolean => {
    if (!account) return false
    const pendingMessages = account?.messages.filter((m) => !m.confirmed)
    const pendingInputs = pendingMessages.flatMap((msg) => {
        if (msg.payload?.type === 'Transaction') {
            return msg.payload?.data?.essence?.data?.inputs
        }
        return []
    })
    const unspentOutputs = account?.addresses.filter((a) => a.balance > 0).flatMap((a) => Object.values(a.outputs))

    return pendingInputs.some((i) => unspentOutputs.some((o) => o.transactionId === i.data?.metadata?.transactionId))
}

/**
 * Handles transaction event data, converting TransferProgressEventData into TransactionEventData
 *
 * @method handleTransactionEventData
 *
 * @param {TransferProgressEventData} eventData
 *
 * @returns {TransactionEventData}
 */
export const handleTransactionEventData = (eventData: TransferProgressEventData): TransactionEventData => {
    if (!eventData) return {}

    const remainderData = eventData as GeneratingRemainderDepositAddressEvent
    if (remainderData?.address) return { remainderAddress: remainderData?.address }

    const txData = eventData as PreparedTransactionEvent
    if (!(txData?.inputs && txData?.outputs) || txData?.inputs.length <= 0 || txData?.outputs.length <= 0) return {}

    const numOutputs = txData.outputs.length
    if (numOutputs === 1) {
        return {
            toAddress: txData.outputs[0].address,
            toAmount: txData.outputs[0].amount,
        }
    } else if (numOutputs > 1) {
        return {
            toAddress: txData.outputs[0].address,
            toAmount: txData.outputs[0].amount,

            remainderAddress: txData.outputs[numOutputs - 1].address,
            remainderAmount: txData.outputs[numOutputs - 1].amount,
        }
    } else {
        return txData
    }
}
