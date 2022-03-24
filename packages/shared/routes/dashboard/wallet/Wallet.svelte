<script lang="typescript">
    import { onMount, setContext } from 'svelte'
    import { derived, Readable, Writable } from 'svelte/store'
    import { DashboardPane, Drawer } from 'shared/components'
    import { clearSendParams, loggedIn, mobile, sendParams } from 'shared/lib/app'
    import { deepCopy } from 'shared/lib/helpers'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { addProfileCurrencyPriceData, priceData } from 'shared/lib/market'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import {
        activeProfile,
        isLedgerProfile,
        isSoftwareProfile,
        isStrongholdLocked,
        setMissingProfileType,
    } from 'shared/lib/profile'
    import { walletRoute, walletRouter, WalletRoute } from '@core/router'
    import { LedgerErrorType, TransferProgressEventType } from 'shared/lib/typings/events'
    import { Locale } from 'shared/lib/typings/i18n'
    import { Message, Transaction } from 'shared/lib/typings/message'
    import { MigratedTransaction } from 'shared/lib/typings/profile'
    import {
        AccountMessage,
        AccountsBalanceHistory,
        BalanceHistory,
        BalanceOverview,
        WalletAccount,
    } from 'shared/lib/typings/wallet'
    import {
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
        selectedAccountId,
        transferState,
        updateBalanceOverview,
        wallet,
        addMessagesPair,
    } from 'shared/lib/wallet'
    import { Account, CreateAccount, LineChart, Security, WalletActions, WalletBalance, WalletHistory } from './views/'
    import { checkStronghold } from 'shared/lib/stronghold'
    import { AccountIdentifier } from 'shared/lib/typings/account'
    import { isDeepLinkRequestActive } from '@common/deep-links'

    export let locale: Locale

    let drawer: Drawer

    const { accounts, balanceOverview, accountsLoaded, internalTransfersInProgress } = $wallet

    $: {
        if ($isDeepLinkRequestActive && $sendParams && $sendParams.address) {
            $walletRouter.goTo(WalletRoute.Send)
            isDeepLinkRequestActive.set(false)
        }
    }
    const accountsBalanceHistory = derived([accounts, priceData], ([$accounts, $priceData]) =>
        getAccountsBalanceHistory($accounts, $priceData)
    )
    const walletBalanceHistory = derived(accountsBalanceHistory, ($accountsBalanceHistory) =>
        getWalletBalanceHistory($accountsBalanceHistory)
    )
    const selectedAccount = derived([selectedAccountId, accounts], ([$selectedAccountId, $accounts]) =>
        $accounts.find((acc) => acc.id === $selectedAccountId)
    )
    const accountTransactions = derived([selectedAccount], ([$selectedAccount]) =>
        $selectedAccount ? getAccountMessages($selectedAccount) : []
    )

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
    setContext<Writable<boolean>>('walletAccountsLoaded', accountsLoaded)
    setContext<Readable<(AccountMessage | MigratedTransaction)[]>>('walletTransactions', transactions)
    setContext<Readable<WalletAccount>>('selectedAccount', selectedAccount)
    setContext<Readable<AccountsBalanceHistory>>('accountsBalanceHistory', accountsBalanceHistory)
    setContext<Readable<AccountMessage[]>>('accountTransactions', accountTransactions)
    setContext<Readable<BalanceHistory>>('walletBalanceHistory', walletBalanceHistory)

    let isGeneratingAddress = false

    // If wallet route or account changes force regeneration of Ledger receive address
    $: {
        $walletRoute
        $selectedAccountId
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

                $walletRouter.reset()

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

    $: if (mobile && drawer && $walletRoute === WalletRoute.CreateAccount) {
        drawer.open()
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
</script>

{#if $walletRoute === WalletRoute.Account && $selectedAccountId}
    <Account {isGeneratingAddress} {onSend} {onInternalTransfer} {onGenerateAddress} {locale} />
{:else if $mobile}
    <div class="wallet-wrapper w-full h-full flex flex-col flex-1 bg-gray-50 dark:bg-gray-900">
        <div class="w-full h-full grid grid-cols-1 min-h-0">
            <!-- Total Balance, Accounts list & Send/Receive -->
            <div class="flex flex-auto flex-col w-full">
                <WalletBalance {locale} />
                <WalletActions {isGeneratingAddress} {onSend} {onInternalTransfer} {onGenerateAddress} {locale} />
                {#if $walletRoute === WalletRoute.CreateAccount}
                    <Drawer dimLength={180} opened={true} bind:this={drawer} on:close={() => $walletRouter.reset()}>
                        <CreateAccount onCreate={onCreateAccount} {locale} />
                    </Drawer>
                {/if}
            </div>
            <div class="flex flex-col col-span-2 h-full space-y-4">
                <div class="w-full h-1/2 flex flex-row flex-1 space-x-4">
                    <DashboardPane classes="w-full rounded-br-none rounded-bl-none">
                        <WalletHistory {locale} />
                    </DashboardPane>
                </div>
            </div>
        </div>
    </div>
{:else}
    <div class="wallet-wrapper relative w-full h-full flex flex-col p-10 flex-1 bg-gray-50 dark:bg-gray-900 z-0">
        <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
            <DashboardPane classes="h-full">
                <!-- Total Balance, Accounts list & Send/Receive -->
                <div class="flex flex-auto flex-col h-full">
                    {#if $walletRoute === WalletRoute.CreateAccount}
                        <CreateAccount onCreate={onCreateAccount} {locale} />
                    {:else}
                        <WalletBalance {locale} />
                        <DashboardPane classes="-mt-5 h-full z-10">
                            <WalletActions
                                {isGeneratingAddress}
                                {onSend}
                                {onInternalTransfer}
                                {onGenerateAddress}
                                {locale}
                            />
                        </DashboardPane>
                    {/if}
                </div>
            </DashboardPane>
            <div class="flex flex-col col-span-2 h-full space-y-4">
                <DashboardPane classes="w-full h-1/2">
                    <LineChart {locale} />
                </DashboardPane>
                <div class="w-full h-1/2 flex flex-row flex-1 space-x-4">
                    <DashboardPane classes="w-1/2">
                        <WalletHistory {locale} />
                    </DashboardPane>
                    <DashboardPane classes="w-1/2">
                        <Security {locale} />
                    </DashboardPane>
                </div>
            </div>
        </div>
    </div>
{/if}

<style type="text/scss">
    :global(body.platform-win32) .wallet-wrapper {
        @apply pt-0;
    }
</style>
