import { ErrorEventPayload, TransferState } from 'shared/lib/typings/events'
import { Payload } from 'shared/lib/typings/message'
import { formatUnitBestMatch } from 'shared/lib/units'
import { derived, get, writable } from 'svelte/store'
import { mnemonic } from './app'
import { convertToFiat, currencies, exchangeRates, formatCurrency } from './currency'
import { deepCopy } from './helpers'
import { localize } from './i18n'
import { displayNotificationForLedgerProfile } from './ledger'
import { didInitialiseMigrationListeners } from './migration'
import { buildClientOptions } from './network'
import { showAppNotification } from './notifications'
import { Platform } from './platform'
import { activeProfile, isLedgerProfile, updateProfile } from './profile'
import { walletSetupType } from './router'
import { WALLET, WalletApi } from './shell/walletApi'
import { Account, SignerType, SyncAccountOptions, SyncedAccount } from './typings/account'
import { Address } from './typings/address'
import { IActorHandler } from './typings/bridge'
import { CurrencyTypes } from './typings/currency'
import { HistoryDataProps, PriceData } from './typings/market'
import { Message } from './typings/message'
import { RecoveryPhrase } from './typings/mnemonic'
import { NodeAuth, NodeInfo } from './typings/node'
import { ProfileType } from './typings/profile'
import { SetupType } from './typings/routes'
import { AccountMessage, BalanceHistory, BalanceOverview, WalletAccount, WalletState } from './typings/wallet'
import { IWalletApi } from './typings/walletApi'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'shared/tailwind.config.js'
import { setProfileAccount } from 'shared/lib/profile'

const configColors = resolveConfig(tailwindConfig).theme.colors

export enum AccountColors {
    Blue = configColors['blue']['500'],
    LightBlue = configColors['lightblue']['500'],
    Purple = configColors['purple']['500'],
    Turquoise = configColors['turquoise']['500'],
    Green = configColors['green']['500'],
    Yellow = configColors['yellow']['500'],
    Orange = configColors['orange']['500'],
    Red = configColors['red']['500'],
    Pink = configColors['pink']['500'],
}

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
    isFirstSessionSync.set(true)
    isFirstManualSync.set(true)
    isBackgroundSyncing.set(false)
    walletSetupType.set(null)
}

// Created to help selectedAccount reactivity.
// Use it to detected switches on selectedAccount
export const selectedAccountId = writable<string>(null)

export const selectedAccount = derived([selectedAccountId, get(wallet).accounts], ([$selectedAccountId, $accounts]) =>
    $accounts.find((acc) => acc.id === $selectedAccountId)
)
export const setSelectedAccount = (id: string): void => selectedAccountId.set(id)

export const selectedMessage = writable<Message | null>(null)

export const isTransferring = writable<boolean>(false)
export const transferState = writable<TransferState | null>(null)

export const hasGeneratedALedgerReceiveAddress = writable<boolean | null>(false)

export const isSyncing = writable<boolean>(false)
export const isFirstSessionSync = writable<boolean>(true)
export const isFirstManualSync = writable<boolean>(true)
export const isBackgroundSyncing = writable<boolean>(false)

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

                return originalMethod.apply(target, args)
            }
        },
    }
)

export const getWalletDataPath = async (): Promise<string> => {
    const appPath = await Platform.getUserDataPath()
    return `${appPath}/${WALLET_STORAGE_DIRECTORY}/`
}

export const getProfileDataPath = async (profileName: string): Promise<string> => {
    const walletPath = await getWalletDataPath()
    return `${walletPath}${profileName}`
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
                    const preparedAccount = prepareAccountInfo(response.payload, {
                        balance: 0,
                        incoming: 0,
                        outgoing: 0,
                        depositAddress: response.payload.addresses[0].address,
                    }) as WalletAccount
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

export const asyncSyncAccounts = (
    addressIndex?: number,
    gapLimit?: number,
    accountDiscoveryThreshold?: number,
    showErrorNotification = true
): Promise<void> =>
    new Promise<void>((resolve, reject) => {
        isSyncing.set(true)

        api.syncAccounts(addressIndex, gapLimit, accountDiscoveryThreshold, {
            onSuccess(response) {
                const syncedAccounts = response.payload

                syncedAccounts.forEach((account) => {
                    processMigratedTransactions(account.id, account.messages, account.addresses)
                })

                updateAccounts(syncedAccounts)

                isSyncing.set(false)

                resolve()
            },
            onError(err) {
                isSyncing.set(false)

                if (showErrorNotification) {
                    if (get(isLedgerProfile)) {
                        displayNotificationForLedgerProfile('error', true, true, false, false, err)
                    } else {
                        showAppNotification({
                            type: 'error',
                            message: localize(err.error),
                        })
                    }

                    resolve()
                } else {
                    reject(err)
                }
            },
        })
    })

export const asyncSyncAccountOffline = (account: WalletAccount): Promise<void> =>
    new Promise((resolve) => {
        api.syncAccount(account.id, {
            onSuccess(response) {
                getAccountMeta(account.id, (err, meta) => {
                    if (!err) {
                        const _account = prepareAccountInfo(account, meta) as WalletAccount
                        get(wallet)?.accounts.update((_accounts) =>
                            _accounts.map((a) => (a.id === _account.id ? _account : a))
                        )
                        updateProfile(
                            'hiddenAccounts',
                            (get(activeProfile)?.hiddenAccounts || []).filter((id) => id !== _account.id)
                        )
                    }

                    resolve()
                })
            },
            onError(err) {
                resolve()
            },
        })
    })

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
 *
 * @method addMessagesPair
 *
 * @param {Account} account
 *
 * @returns {void}
 */
export function addMessagesPair(account: Account): void {
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
    const { balanceOverview } = get(wallet)

    const activeCurrency = get(activeProfile)?.settings.currency ?? CurrencyTypes.USD

    balanceOverview.update((overview) =>
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
 * Updates balance overview fiat value
 *
 * @method refreshBalanceOverview
 *
 * @returns {void}
 */
export const refreshBalanceOverview = (): void => {
    const { balanceOverview } = get(wallet)
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

    const { newAccounts, existingAccounts } = syncedAccounts.reduce(
        (acc, syncedAccount: SyncedAccount) => {
            if (existingAccountIds.includes(syncedAccount.id)) {
                acc.existingAccounts.push(syncedAccount)
            } else {
                acc.newAccounts.push(syncedAccount)
            }

            return acc
        },
        { newAccounts: [], existingAccounts: [] }
    )

    const updatedStoredAccounts = get(accounts).map((storedAccount) => {
        const syncedAccount = existingAccounts.find((_account) => _account.id === storedAccount.id)

        // Update deposit address
        storedAccount.depositAddress = syncedAccount.depositAddress.address

        // If we have received a new address, simply add it;
        // If we have received an existing address, update the properties.
        for (const addr of syncedAccount.addresses) {
            const addressIndex = storedAccount.addresses.findIndex((a) => a.address === addr.address)
            if (addressIndex < 0) {
                storedAccount.addresses.push(addr)
            } else {
                storedAccount.addresses[addressIndex] = addr
            }
        }

        // If we have received a new message, simply add it;
        // If we have received an existing message, update the properties.
        for (const msg of syncedAccount.messages) {
            const msgIndex = storedAccount.messages.findIndex(
                (m) => m.id === msg.id && getIncomingFlag(m.payload) === getIncomingFlag(msg.payload)
            )
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

                    const account = prepareAccountInfo(
                        Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                            {} as WalletAccount,
                            newAccount,
                            {
                                alias: `${localize('general.account')} ${newAccount.index + 1}`,
                                clientOptions: existingAccounts[0]?.clientOptions,
                                createdAt: new Date().toISOString(),
                                signerType: existingAccounts[0]?.signerType,
                                depositAddress: newAccount.depositAddress.address,
                            }
                        ),
                        meta
                    )

                    _accounts.push(account)
                } else {
                    console.error(err)
                }

                completeCount++
                if (completeCount === newAccounts.length) {
                    const { balanceOverview } = get(wallet)
                    const overview = get(balanceOverview)

                    accounts.update(() => [...updatedStoredAccounts, ..._accounts].sort((a, b) => a.index - b.index))

                    updateBalanceOverview(
                        overview.balanceRaw + totalBalance.balance,
                        overview.incomingRaw + totalBalance.incoming,
                        overview.outgoingRaw + totalBalance.outgoing
                    )
                }
            })
        }
    } else {
        accounts.update(() => updatedStoredAccounts.sort((a, b) => a.index - b.index))
    }
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
 * Gets balance history for each account in market data timestamps
 *
 * @method getAccountBalanceHistory
 *
 * @param {Account} accounts
 * @param {number} balanceRaw
 * @param {PriceData} [priceData]
 *
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

export const getAccountMeta = (
    accountId: string,
    callback: (
        error: ErrorEventPayload,
        meta?: {
            balance: number
            incoming: number
            outgoing: number
            depositAddress: string
        }
    ) => void
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

export const prepareAccountInfo = (
    account: Account,
    meta: {
        balance: number
        incoming: number
        outgoing: number
        depositAddress: string
    }
): unknown => {
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

    messages.forEach((message: Message) => {
        if (message.payload?.type === 'Milestone') {
            const account = get(accounts).find((account) => account.id === accountId)

            if (account) {
                const _activeProfile = get(activeProfile)

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

    const _activeProfile = get(activeProfile)

    if (_activeProfile.migratedTransactions && _activeProfile.migratedTransactions.length) {
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
 * @returns {SyncAccountOptions} The sync options for an account, which contains data for the gap limit and account discovery threshold
 */
export const getSyncAccountOptions = (isManualSync: boolean = false): SyncAccountOptions =>
    isInitialAccountSync()
        ? calculateInitialSyncAccountOptions(get(walletSetupType))
        : calculateRegularSyncAccountOptions(get(activeProfile).type, isManualSync)

/**
 * Determines if the API call for syncing accounts is the initial one
 * @returns {boolean} The boolean value determining if this sync API call is the first ever one
 */
export const isInitialAccountSync = (): boolean => get(walletSetupType) !== null && get(isFirstSessionSync)

const calculateInitialSyncAccountOptions = (setupType: SetupType): SyncAccountOptions => {
    let gapLimit = 1
    let accountDiscoveryThreshold = 0

    switch (setupType) {
        case SetupType.Import:
        case SetupType.Mnemonic:
        case SetupType.Stronghold:
            gapLimit = 25
            accountDiscoveryThreshold = 1
            break
        case SetupType.FireflyLedger:
            gapLimit = 10
            accountDiscoveryThreshold = 1
            break
    }

    return { gapLimit, accountDiscoveryThreshold }
}

const calculateRegularSyncAccountOptions = (profileType: ProfileType, isManualSync: boolean): SyncAccountOptions => {
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
            gapLimit = 1
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
