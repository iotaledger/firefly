<script lang="typescript">
    import { AccountActionsModal, DashboardPane, Drawer } from 'shared/components'
    import { clearSendParams, loggedIn, mobile, sendParams } from 'shared/lib/app'
    import { deepLinkRequestActive } from 'shared/lib/deepLinking/deepLinking'
    import { deepCopy } from 'shared/lib/helpers'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { addProfileCurrencyPriceData, priceData } from 'shared/lib/market'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import {
        activeProfile,
        getColor,
        isLedgerProfile,
        isSoftwareProfile,
        isStrongholdLocked,
        setMissingProfileType,
    } from 'shared/lib/profile'
    import { accountRoute, walletRoute } from 'shared/lib/router'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { AccountIdentifier } from 'shared/lib/typings/account'
    import { LedgerErrorType, TransferProgressEventType } from 'shared/lib/typings/events'
    import type { Locale } from 'shared/lib/typings/i18n'
    import type { Message, Transaction } from 'shared/lib/typings/message'
    import type { MigratedTransaction } from 'shared/lib/typings/profile'
    import { AccountRoutes, WalletRoutes } from 'shared/lib/typings/routes'
    import type {
        AccountMessage,
        AccountsBalanceHistory,
        BalanceHistory,
        BalanceOverview,
        WalletAccount,
    } from 'shared/lib/typings/wallet'
    import {
        addMessagesPair,
        api,
        asyncCreateAccount,
        asyncSyncAccountOffline,
        asyncSyncAccounts,
        getAccountMessages,
        getAccountMeta,
        getAccountsBalanceHistory,
        getSyncAccountOptions,
        getTransactions,
        getWalletBalanceHistory,
        hasGeneratedALedgerReceiveAddress,
        initialiseListeners,
        isFirstSessionSync,
        isTransferring,
        prepareAccountInfo,
        processMigratedTransactions,
        removeEventListeners,
        selectedAccount,
        setSelectedAccount,
        transferState,
        updateBalanceOverview,
        wallet,
    } from 'shared/lib/wallet'
    import { onMount, setContext } from 'svelte'
    import { derived, Readable, Writable } from 'svelte/store'
    import { AccountActions, AccountBalance, AccountHistory, AccountNavigation, BarChart, LineChart } from './views/'

    export let locale: Locale

    let drawer: Drawer

    const { accounts, balanceOverview, accountsLoaded, internalTransfersInProgress } = $wallet

    let showActionsModal = false

    $: {
        if ($deepLinkRequestActive && $sendParams && $sendParams.address) {
            accountRoute.set(AccountRoutes.Send)
            deepLinkRequestActive.set(false)
        }
    }
    const accountsBalanceHistory = derived([accounts, priceData], ([$accounts, $priceData]) =>
        getAccountsBalanceHistory($accounts, $priceData)
    )
    const walletBalanceHistory = derived(accountsBalanceHistory, ($accountsBalanceHistory) =>
        getWalletBalanceHistory($accountsBalanceHistory)
    )

    $: navAccounts = $viewableAccounts?.map(({ id, alias, color }) => ({
        id,
        alias,
        color,
        active: $selectedAccount?.id === id,
    }))

    const viewableAccounts: Readable<WalletAccount[]> = derived(
        [activeProfile, accounts],
        ([$activeProfile, $accounts]) => {
            if (!$activeProfile) {
                return []
            }

            if ($activeProfile.settings.showHiddenAccounts) {
                const sortedAccounts = $accounts.sort((a, b) => a.index - b.index)

                // If the last account is "hidden" and has no value, messages or history treat it as "deleted"
                // This account will get re-used if someone creates a new one
                if (sortedAccounts.length > 1 && $activeProfile.hiddenAccounts) {
                    const lastAccount = sortedAccounts[sortedAccounts.length - 1]
                    if (
                        $activeProfile.hiddenAccounts.includes(lastAccount.id) &&
                        lastAccount.rawIotaBalance === 0 &&
                        lastAccount.messages.length === 0
                    ) {
                        sortedAccounts.pop()
                    }
                }

                return sortedAccounts
            }

            return $accounts
                .filter((a) => !$activeProfile.hiddenAccounts?.includes(a.id))
                .sort((a, b) => a.index - b.index)
        }
    )

    const liveAccounts: Readable<WalletAccount[]> = derived(
        [activeProfile, accounts],
        ([$activeProfile, $accounts]) => {
            if (!$activeProfile) {
                return []
            }
            return $accounts
                .filter((a) => !$activeProfile.hiddenAccounts?.includes(a.id))
                .sort((a, b) => a.index - b.index)
        }
    )

    const transactions = derived([viewableAccounts, activeProfile], ([$viewableAccounts, $activeProfile]) => {
        const _migratedTransactions = $activeProfile?.migratedTransactions || []

        return [..._migratedTransactions, ...getTransactions($viewableAccounts)]
    })

    setContext<Writable<BalanceOverview>>('walletBalance', balanceOverview)
    setContext<Writable<WalletAccount[]>>('walletAccounts', accounts)
    setContext<Readable<WalletAccount[]>>('viewableAccounts', viewableAccounts)
    setContext<Readable<WalletAccount[]>>('liveAccounts', liveAccounts)
    setContext<Readable<(AccountMessage | MigratedTransaction)[]>>('walletTransactions', transactions)
    setContext<Readable<AccountsBalanceHistory>>('accountsBalanceHistory', accountsBalanceHistory)
    setContext<Readable<BalanceHistory>>('walletBalanceHistory', walletBalanceHistory)

    let isGeneratingAddress = false

    // If account changes force regeneration of Ledger receive address
    $: {
        // TODO: fix this, selectedAccount changes triggers too many times
        selectedAccount?.id
        if ($isLedgerProfile) {
            hasGeneratedALedgerReceiveAddress.set(false)
        }
    }

    $: if ($accountsLoaded) {
        // update profileType if it is missing
        if (!$activeProfile?.type) {
            setMissingProfileType($accounts)
        }
    }

    function loadAccounts() {
        const _onError = (error: any = null) => {
            if ($isLedgerProfile) {
                if (!LedgerErrorType[error.type]) {
                    displayNotificationForLedgerProfile('error', true, true, false, false, error)
                }
            } else {
                showAppNotification({
                    type: 'error',
                    message: locale(error?.error || 'error.global.generic'),
                })
            }
        }

        api.getAccounts({
            onSuccess(accountsResponse) {
                const _continue = async () => {
                    accountsLoaded.set(true)

                    const { gapLimit, accountDiscoveryThreshold } = getSyncAccountOptions()

                    try {
                        await asyncSyncAccounts(0, gapLimit, accountDiscoveryThreshold, false)

                        if ($isFirstSessionSync) isFirstSessionSync.set(false)
                    } catch (err) {
                        _onError(err)
                    }
                }

                if (accountsResponse.payload.length === 0) {
                    void _continue()
                } else {
                    const totalBalance = {
                        balance: 0,
                        incoming: 0,
                        outgoing: 0,
                    }

                    let completeCount = 0
                    const newAccounts = []
                    for (const payloadAccount of accountsResponse.payload) {
                        addMessagesPair(payloadAccount)

                        getAccountMeta(payloadAccount.id, (err, meta) => {
                            if (!err) {
                                totalBalance.balance += meta.balance
                                totalBalance.incoming += meta.incoming
                                totalBalance.outgoing += meta.outgoing

                                const account = prepareAccountInfo(payloadAccount, meta)
                                newAccounts.push(account)
                            } else {
                                _onError(err)
                            }

                            completeCount++

                            if (completeCount === accountsResponse.payload.length) {
                                accounts.update((_accounts) => newAccounts.sort((a, b) => a.index - b.index))
                                processMigratedTransactions(
                                    payloadAccount.id,
                                    payloadAccount.messages,
                                    payloadAccount.addresses
                                )
                                updateBalanceOverview(
                                    totalBalance.balance,
                                    totalBalance.incoming,
                                    totalBalance.outgoing
                                )
                                void _continue()
                            }
                        })
                    }
                }
            },
            onError(err) {
                _onError(err)
            },
        })
    }

    function onGenerateAddress(accountId: AccountIdentifier) {
        const _generate = () => {
            isGeneratingAddress = true

            if ($isLedgerProfile) displayNotificationForLedgerProfile('error', true, true)

            api.getUnusedAddress(accountId.toString(), {
                onSuccess(response) {
                    accounts.update((accounts) =>
                        accounts.map((account) => {
                            if (account.id === accountId) {
                                account.depositAddress = response.payload.address

                                if (!account.addresses.some((a) => a.address === response.payload.address)) {
                                    account.addresses.push(response.payload)
                                }
                            }

                            return account
                        })
                    )
                    closePopup(true)

                    isGeneratingAddress = false
                    hasGeneratedALedgerReceiveAddress.set(true)
                },
                onError(err) {
                    closePopup(true)

                    console.error(err)

                    isGeneratingAddress = false

                    const isClientError = err && err.type === 'ClientError'
                    const shouldHideErrorNotification =
                        isClientError && err.error === 'error.node.chrysalisNodeInactive'
                    if (!shouldHideErrorNotification) {
                        /**
                         * NOTE: To ensure a clear error message (for Ledger users),
                         * we need to update the locale path.
                         */
                        const localePath =
                            isClientError && $isLedgerProfile ? 'error.ledger.generateAddress' : err.error
                        showAppNotification({
                            type: 'error',
                            message: locale(localePath),
                        })
                    }
                },
            })
        }

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({ type: 'password', props: { onSuccess: _generate } })
                    } else {
                        _generate()
                    }
                },
                onError(error) {
                    console.error(error)
                },
            })
        } else {
            promptUserToConnectLedger(false, () => _generate(), undefined)
        }
    }

    async function onCreateAccount(alias: string, color: string, onComplete) {
        const _create = async (): Promise<unknown> => {
            try {
                const account = await asyncCreateAccount(alias, color)
                await asyncSyncAccountOffline(account)

                // TODO: set selected account to the newly created account
                accountRoute.set(AccountRoutes.Init)

                return onComplete()
            } catch (err) {
                return onComplete(err)
            }
        }

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({ type: 'password', props: { onSuccess: _create } })
                    } else {
                        void _create()
                    }
                },
                onError(error) {
                    console.error(error)
                },
            })
        } else {
            await _create()
        }
    }

    function onSend(senderAccountId, receiveAddress, amount) {
        const _send = () => {
            isTransferring.set(true)
            api.send(
                senderAccountId,
                {
                    amount,
                    address: receiveAddress,
                    remainder_value_strategy: {
                        strategy: 'ChangeAddress',
                    },
                    indexation: { index: 'firefly', data: [] },
                },
                {
                    onSuccess(response) {
                        accounts.update((_accounts) =>
                            _accounts.map((_account) => {
                                if (_account.id === senderAccountId) {
                                    return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                        {} as WalletAccount,
                                        _account,
                                        {
                                            messages: [response.payload, ..._account.messages],
                                        }
                                    )
                                }

                                return _account
                            })
                        )

                        transferState.set({
                            type: TransferProgressEventType.Complete,
                        })

                        setTimeout(() => {
                            clearSendParams()
                            isTransferring.set(false)
                        }, 3000)
                    },
                    onError(err) {
                        isTransferring.set(false)
                        showAppNotification({
                            type: 'error',
                            message: locale(err.error),
                        })
                    },
                }
            )
        }

        if ($isSoftwareProfile) {
            checkStronghold(_send)
        } else {
            _send()
        }
    }

    function onInternalTransfer(senderAccountId, receiverAccountId, amount, internal) {
        const _internalTransfer = () => {
            isTransferring.set(true)
            api.internalTransfer(senderAccountId, receiverAccountId, amount, {
                onSuccess(response) {
                    const message = response.payload

                    internalTransfersInProgress.update((transfers) => {
                        transfers[message.id] = {
                            from: senderAccountId,
                            to: receiverAccountId,
                        }

                        return transfers
                    })

                    accounts.update((_accounts) =>
                        _accounts.map((_account) => {
                            if (_account.id === senderAccountId) {
                                const m = deepCopy(message) as Message
                                const mPayload = m.payload as Transaction
                                mPayload.data.essence.data.incoming = false
                                mPayload.data.essence.data.internal = true
                                _account.messages.push(m)
                            }
                            if (_account.id === receiverAccountId) {
                                const m = deepCopy(message) as Message
                                const mPayload = m.payload as Transaction
                                mPayload.data.essence.data.incoming = true
                                mPayload.data.essence.data.internal = true
                                _account.messages.push(m)
                            }

                            return _account
                        })
                    )

                    transferState.set({
                        type: TransferProgressEventType.Complete,
                    })

                    setTimeout(() => {
                        clearSendParams(internal)
                        isTransferring.set(false)
                    }, 3000)
                },
                onError(err) {
                    isTransferring.set(false)
                    showAppNotification({
                        type: 'error',
                        message: locale(err.error),
                    })
                },
            })
        }

        if ($isSoftwareProfile) {
            api.getStrongholdStatus({
                onSuccess(strongholdStatusResponse) {
                    if (strongholdStatusResponse.payload.snapshot.status === 'Locked') {
                        openPopup({ type: 'password', props: { onSuccess: _internalTransfer } })
                    } else {
                        _internalTransfer()
                    }
                },
                onError(error) {
                    console.error(error)
                },
            })
        } else {
            _internalTransfer()
        }
    }

    $: if (mobile && drawer && $walletRoute === WalletRoutes.CreateAccount) {
        drawer.open()
    }

    $: if ($accountsLoaded && $viewableAccounts.length) {
        // TODO: persist last selected account
        setSelectedAccount($viewableAccounts[0]?.id)
    }

    onMount(() => {
        // If we are in settings when logged out the router reset
        // switches back to the wallet, but there is no longer
        // an active profile, only init if there is a profile
        if ($activeProfile && $loggedIn) {
            if (!$accountsLoaded) {
                loadAccounts()
            }

            removeEventListeners($activeProfile.id)

            initialiseListeners()

            if ($isSoftwareProfile) {
                api.getStrongholdStatus({
                    onSuccess(strongholdStatusResponse) {
                        isStrongholdLocked.set(strongholdStatusResponse.payload.snapshot.status === 'Locked')
                    },
                    onError(error) {
                        console.error(error)
                    },
                })
            }

            void addProfileCurrencyPriceData()
        }
    })

    const handleMenuClick = () => {
        showActionsModal = !showActionsModal
    }
</script>

{#if $selectedAccount}
    <div class="w-full h-full flex flex-col flex-nowrap p-10 pt-0 relative flex-1 bg-gray-50 dark:bg-gray-900">
        <AccountNavigation {locale} accounts={navAccounts} />
        {#key $selectedAccount?.id}
            <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
                <DashboardPane classes=" h-full flex flex-auto flex-col flex-shrink-0">
                    <AccountBalance
                        {locale}
                        color={getColor($activeProfile, $selectedAccount?.id)}
                        balance={$selectedAccount.rawIotaBalance}
                        balanceEquiv={$selectedAccount.balanceEquiv}
                        onMenuClick={handleMenuClick}
                        classes={$accountRoute === AccountRoutes.Manage ? 'hidden' : ''}
                    />
                    <DashboardPane classes="h-full -mt-5 z-0">
                        <AccountActions
                            {isGeneratingAddress}
                            {onSend}
                            {onInternalTransfer}
                            {onGenerateAddress}
                            {locale}
                        />
                    </DashboardPane>
                </DashboardPane>
                <DashboardPane>
                    <AccountHistory
                        {locale}
                        color={$selectedAccount.color}
                        transactions={getAccountMessages($selectedAccount)}
                    />
                </DashboardPane>
                <div class=" flex flex-col space-y-4">
                    <DashboardPane classes="w-full h-1/2">
                        <LineChart {locale} />
                    </DashboardPane>
                    <DashboardPane classes="w-full h-1/2">
                        <BarChart {locale} />
                    </DashboardPane>
                </div>
            </div>
        {/key}
        <AccountActionsModal bind:isActive={showActionsModal} {locale} />
    </div>
{/if}

<style type="text/scss">
    :global(body.platform-win32) .wallet-wrapper {
        @apply pt-0;
    }
</style>
